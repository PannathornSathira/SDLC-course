import { describe, expect, it } from "vitest";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { checkDangerousCommand } = require("../../.agents/scripts/block-dangerous-commands.js");

describe("PreToolUse Safety Hook: Dangerous Command Blocker", () => {
  describe("Blocking 'rm -rf' commands", () => {
    it("blocks standard rm -rf", () => {
      expect(checkDangerousCommand("rm -rf node_modules")?.blocked).toBe(true);
      expect(checkDangerousCommand("rm -rf /")?.blocked).toBe(true);
      expect(checkDangerousCommand("rm -rf ./*")?.blocked).toBe(true);
    });

    it("blocks inverted flags rm -fr", () => {
      expect(checkDangerousCommand("rm -fr dist")?.blocked).toBe(true);
    });

    it("blocks separate flags rm -r -f and rm -f -r", () => {
      expect(checkDangerousCommand("rm -r -f build")?.blocked).toBe(true);
      expect(checkDangerousCommand("rm -f -r build")?.blocked).toBe(true);
      expect(checkDangerousCommand("rm -f --recursive build")?.blocked).toBe(true);
      expect(checkDangerousCommand("rm --force -r build")?.blocked).toBe(true);
    });

    it("blocks uppercase flag rm -Rf / rm -rF / rm -RF", () => {
      expect(checkDangerousCommand("rm -Rf build")?.blocked).toBe(true);
      expect(checkDangerousCommand("rm -rF build")?.blocked).toBe(true);
      expect(checkDangerousCommand("rm -RF build")?.blocked).toBe(true);
    });

    it("blocks long flags rm --recursive --force", () => {
      expect(checkDangerousCommand("rm --recursive --force temp")?.blocked).toBe(true);
      expect(checkDangerousCommand("rm --force --recursive temp")?.blocked).toBe(true);
    });

    it("blocks wrapped commands (sudo, env, bash -c)", () => {
      expect(checkDangerousCommand("sudo rm -rf /tmp/test")?.blocked).toBe(true);
      expect(checkDangerousCommand("VAR=1 rm -rf tmp")?.blocked).toBe(true);
      expect(checkDangerousCommand('bash -c "rm -rf build"')?.blocked).toBe(true);
    });

    it("blocks chained commands containing rm -rf", () => {
      expect(checkDangerousCommand("npm run build && rm -rf temp")?.blocked).toBe(true);
      expect(checkDangerousCommand("echo test; rm -rf out")?.blocked).toBe(true);
    });

    it("allows safe rm commands without recursive + force combo", () => {
      expect(checkDangerousCommand("rm file.txt")).toBeNull();
      expect(checkDangerousCommand("rm -f file.txt")).toBeNull();
      expect(checkDangerousCommand("rm -r empty_dir")).toBeNull();
    });
  });

  describe("Blocking 'git push force' commands", () => {
    it("blocks git push --force", () => {
      expect(checkDangerousCommand("git push --force origin main")?.blocked).toBe(true);
      expect(checkDangerousCommand("git push origin main --force")?.blocked).toBe(true);
    });

    it("blocks git push -f", () => {
      expect(checkDangerousCommand("git push -f origin main")?.blocked).toBe(true);
      expect(checkDangerousCommand("git push origin main -f")?.blocked).toBe(true);
      expect(checkDangerousCommand("git push -f")?.blocked).toBe(true);
      expect(checkDangerousCommand("git push -uf origin main")?.blocked).toBe(true);
    });

    it("blocks git push --force-with-lease and --force-if-includes", () => {
      expect(checkDangerousCommand("git push --force-with-lease origin main")?.blocked).toBe(true);
      expect(checkDangerousCommand("git push origin main --force-if-includes")?.blocked).toBe(true);
    });

    it("blocks git push with force refspec (+branch)", () => {
      expect(checkDangerousCommand("git push origin +main")?.blocked).toBe(true);
      expect(checkDangerousCommand("git push origin +feature:main")?.blocked).toBe(true);
    });

    it("blocks nested in subshell (bash -c)", () => {
      expect(checkDangerousCommand('bash -c "git push -f origin main"')?.blocked).toBe(true);
    });

    it("allows standard git push without force", () => {
      expect(checkDangerousCommand("git push origin main")).toBeNull();
      expect(checkDangerousCommand("git push -u origin feature")).toBeNull();
      expect(checkDangerousCommand("git push --set-upstream origin main")).toBeNull();
    });
  });

  describe("Edge cases & False Positives prevention", () => {
    it("does not block git commit messages mentioning rm -rf or -f", () => {
      expect(checkDangerousCommand('git commit -m "remove rm -rf from docs"')).toBeNull();
      expect(checkDangerousCommand('git commit -m "avoid git push -f"')).toBeNull();
    });

    it("does not block echo or grep referencing blocked strings", () => {
      expect(checkDangerousCommand('echo "rm -rf is dangerous"')).toBeNull();
      expect(checkDangerousCommand('grep "rm -rf" .')).toBeNull();
    });

    it("handles null or non-string inputs safely", () => {
      expect(checkDangerousCommand("")).toBeNull();
      expect(checkDangerousCommand(null as unknown as string)).toBeNull();
    });
  });
});

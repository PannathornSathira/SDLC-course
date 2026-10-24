#!/usr/bin/env node

const fs = require('fs');

/**
 * Tokenizes a shell command string into individual arguments while respecting quotes and escapes.
 */
function parseCommandTokens(cmdStr) {
  const tokens = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escape = false;

  for (let i = 0; i < cmdStr.length; i++) {
    const char = cmdStr[i];
    if (escape) {
      current += char;
      escape = false;
      continue;
    }
    if (char === '\\') {
      escape = true;
      current += char;
      continue;
    }
    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      current += char;
      continue;
    }
    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      current += char;
      continue;
    }
    if (/\s/.test(char) && !inSingleQuote && !inDoubleQuote) {
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
      continue;
    }
    current += char;
  }
  if (current.length > 0) {
    tokens.push(current);
  }
  return tokens;
}

function stripQuotes(str) {
  if (!str) return '';
  if (
    (str.startsWith('"') && str.endsWith('"')) ||
    (str.startsWith("'") && str.endsWith("'"))
  ) {
    return str.slice(1, -1);
  }
  return str;
}

/**
 * Checks if a command string contains blocked commands:
 * 1. rm -rf (including variants like rm -fr, rm -r -f, rm --recursive --force, etc.)
 * 2. git push force (including git push --force, -f, --force-with-lease, +refspec, etc.)
 */
function checkDangerousCommand(cmd) {
  if (!cmd || typeof cmd !== 'string') return null;

  // Split command by pipeline and sequential execution operators outside quotes
  const segments = [];
  let currentSeg = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escape = false;

  for (let i = 0; i < cmd.length; i++) {
    const char = cmd[i];
    const nextChar = cmd[i + 1] || '';
    if (escape) {
      currentSeg += char;
      escape = false;
      continue;
    }
    if (char === '\\') {
      escape = true;
      currentSeg += char;
      continue;
    }
    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      currentSeg += char;
      continue;
    }
    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      currentSeg += char;
      continue;
    }
    if (!inSingleQuote && !inDoubleQuote) {
      if (char === ';' || char === '\n') {
        segments.push(currentSeg);
        currentSeg = '';
        continue;
      }
      if ((char === '&' && nextChar === '&') || (char === '|' && nextChar === '|')) {
        segments.push(currentSeg);
        currentSeg = '';
        i++; // skip next operator char
        continue;
      }
      if (char === '|' || char === '&') {
        segments.push(currentSeg);
        currentSeg = '';
        continue;
      }
    }
    currentSeg += char;
  }
  if (currentSeg.trim()) segments.push(currentSeg);

  for (const seg of segments) {
    const tokens = parseCommandTokens(seg.trim());
    if (tokens.length === 0) continue;

    // Skip environment variable prefixes (e.g. VAR=val)
    let idx = 0;
    while (idx < tokens.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(tokens[idx])) {
      idx++;
    }

    // Skip execution wrapper commands
    while (
      idx < tokens.length &&
      /^(sudo|nohup|time|env|command|builtin|xargs)$/.test(stripQuotes(tokens[idx]))
    ) {
      idx++;
    }
    if (idx >= tokens.length) continue;

    const baseCmd = stripQuotes(tokens[idx]);
    const cmdArgs = tokens.slice(idx + 1);

    // Recursively check shells with -c (e.g. bash -c "...", sh -c "...", zsh -c "...")
    if (/^(sh|bash|zsh)$/.test(baseCmd)) {
      const cIdx = cmdArgs.findIndex((a) => a === '-c');
      if (cIdx !== -1 && cIdx + 1 < cmdArgs.length) {
        const subResult = checkDangerousCommand(stripQuotes(cmdArgs[cIdx + 1]));
        if (subResult) return subResult;
      }
    }

    // Check 1: rm -rf
    if (baseCmd === 'rm') {
      let hasR = false;
      let hasF = false;
      for (const arg of cmdArgs) {
        const raw = stripQuotes(arg);
        if (raw === '--') break;
        if (raw.startsWith('--')) {
          if (raw === '--recursive') hasR = true;
          if (raw === '--force') hasF = true;
        } else if (raw.startsWith('-') && raw.length > 1) {
          const flags = raw.slice(1);
          if (/[rR]/.test(flags)) hasR = true;
          if (/[fF]/.test(flags)) hasF = true;
        }
      }
      if (hasR && hasF) {
        return {
          blocked: true,
          reason: `Execution blocked by PreToolUse hook: forbidden command "rm -rf" detected in "${seg.trim()}".`
        };
      }
    }

    // Check 2: git push force
    if (baseCmd === 'git') {
      let subCmdIdx = -1;
      for (let i = 0; i < cmdArgs.length; i++) {
        const a = stripQuotes(cmdArgs[i]);
        if (a === 'push') {
          subCmdIdx = i;
          break;
        }
        if (a === '-C' || a === '-c' || a === '--git-dir' || a === '--work-tree') {
          i++; // skip flag value
        }
      }

      if (subCmdIdx !== -1) {
        const pushArgs = cmdArgs.slice(subCmdIdx + 1);
        let hasForce = false;
        for (const arg of pushArgs) {
          const raw = stripQuotes(arg);
          if (raw === '--') break;
          if (
            raw === '-f' ||
            raw === '--force' ||
            raw === '--force-with-lease' ||
            raw === '--force-if-includes'
          ) {
            hasForce = true;
            break;
          }
          if (raw.startsWith('-') && !raw.startsWith('--')) {
            if (raw.slice(1).includes('f')) {
              hasForce = true;
              break;
            }
          }
          if (raw.startsWith('+') && raw.length > 1) {
            hasForce = true;
            break;
          }
        }
        if (hasForce) {
          return {
            blocked: true,
            reason: `Execution blocked by PreToolUse hook: forbidden command "git push --force" detected in "${seg.trim()}".`
          };
        }
      }
    }
  }

  return null;
}

function main() {
  let rawInput = '';
  try {
    rawInput = fs.readFileSync(0, 'utf-8');
  } catch (err) {
    console.log(JSON.stringify({ decision: 'allow' }));
    return;
  }

  let input = {};
  if (rawInput && rawInput.trim()) {
    try {
      input = JSON.parse(rawInput);
    } catch (e) {
      console.log(JSON.stringify({ decision: 'allow' }));
      return;
    }
  }

  const args = input.toolCall?.args || {};
  const command = args.CommandLine || args.commandLine || args.command || '';

  if (command) {
    const checkResult = checkDangerousCommand(command);
    if (checkResult && checkResult.blocked) {
      console.log(
        JSON.stringify({
          decision: 'deny',
          reason: checkResult.reason
        })
      );
      return;
    }
  }

  console.log(JSON.stringify({ decision: 'allow' }));
}

if (require.main === module) {
  main();
}

module.exports = {
  checkDangerousCommand,
  parseCommandTokens,
  stripQuotes
};

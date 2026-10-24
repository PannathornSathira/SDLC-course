import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { closeDb, getDb } from "@/lib/db/index";

export const TEST_DB_PATH = path.join(process.cwd(), "data", "test-farmart.db");

/**
 * Sets up a fresh, isolated SQLite database for integration tests.
 */
export function setupTestDatabase(): void {
  // Ensure previous connection is closed
  closeDb();

  // Remove previous test DB files if they exist
  for (const suffix of ["", "-shm", "-wal"]) {
    const file = `${TEST_DB_PATH}${suffix}`;
    if (existsSync(file)) {
      try {
        rmSync(file, { force: true });
      } catch {
        // ignore
      }
    }
  }

  // Point DB to test database file
  process.env.FARMART_DB_PATH = TEST_DB_PATH;

  // Initializing via getDb() auto-migrates and seeds the schema
  const db = getDb();
  db.exec("PRAGMA foreign_keys = ON;");
}

/**
 * Tears down and closes the test database.
 */
export function teardownTestDatabase(): void {
  closeDb();
  for (const suffix of ["", "-shm", "-wal"]) {
    const file = `${TEST_DB_PATH}${suffix}`;
    if (existsSync(file)) {
      try {
        rmSync(file, { force: true });
      } catch {
        // ignore
      }
    }
  }
}

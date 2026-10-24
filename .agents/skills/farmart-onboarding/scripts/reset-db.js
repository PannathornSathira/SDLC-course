#!/usr/bin/env node
/**
 * Farmart Database Reset Script
 * Deletes current database files and re-runs the seeder.
 */

const { rmSync, existsSync } = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const projectRoot = path.resolve(__dirname, '..');
const dbFile = process.env.FARMART_DB_PATH || path.join(projectRoot, 'data', 'farmart.db');

console.log('🧹 Resetting Farmart Database...');

for (const suffix of ['', '-shm', '-wal']) {
  const f = `${dbFile}${suffix}`;
  if (existsSync(f)) {
    try {
      rmSync(f, { force: true });
      console.log(`  Removed: ${path.basename(f)}`);
    } catch (e) {
      console.warn(`  Could not remove ${f}: ${e.message}`);
    }
  }
}

console.log('🔄 Re-seeding database...');
execSync(`node "${path.join(__dirname, 'seed-db.js')}"`, { stdio: 'inherit' });

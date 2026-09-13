#!/usr/bin/env node

/**
 * Swagger Documentation Validator
 * Validates all route documentation coverage and schema consistency
 * Usage: npm run swagger:validate
 */

const { execSync } = require('child_process');
const path = require('path');

const scriptsDir = __dirname;
const rootDir = path.resolve(scriptsDir, '..');

let hasErrors = false;
const errors = [];

console.log('Validating Swagger documentation...\n');

try {
  console.log('Checking documentation coverage...');
  execSync(`node ${path.join(scriptsDir, 'validate-swagger-coverage.js')}`, {
    stdio: 'inherit',
    cwd: rootDir,
  });
  console.log('Coverage validation passed\n');
} catch {
  hasErrors = true;
  errors.push('Coverage validation failed');
  console.log('Coverage validation failed\n');
}

try {
  console.log('Checking schema consistency...');
  execSync(`node ${path.join(scriptsDir, 'validate-swagger-schemas.js')}`, {
    stdio: 'inherit',
    cwd: rootDir,
  });
  console.log('Schema validation passed\n');
} catch {
  hasErrors = true;
  errors.push('Schema validation failed');
  console.log('Schema validation failed\n');
}

if (hasErrors) {
  console.log('\nSwagger validation failed');
  console.log('Errors:', errors.join(', '));
  process.exit(1);
}

console.log('All Swagger validation checks passed!');
process.exit(0);

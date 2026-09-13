#!/usr/bin/env node

/**
 * Swagger Schema Validator
 * Validates that Swagger documentation schemas are properly formatted
 * and detects common issues
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const API_DIR = path.join(process.cwd(), 'src/app/api');
let hasErrors = false;
const schemaErrors = [];

const WHITELIST_PATTERNS = [/\(controller\)\/public\//];

function isWhitelisted(filePath) {
  const relativePath = path.relative(API_DIR, filePath);
  return WHITELIST_PATTERNS.some((pattern) => pattern.test(relativePath));
}

function findDocFiles() {
  const allFiles = glob.sync('**/route.docs.ts', {
    cwd: API_DIR,
    absolute: true,
    ignore: ['**/node_modules/**', '**/.next/**'],
  });
  return allFiles.filter((file) => isWhitelisted(file));
}

function validateSwaggerSyntax(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const errors = [];

  if (!content.includes('@swagger')) {
    errors.push('Missing @swagger annotation');
    return errors;
  }

  const hasPath = /\/api\/[^:]+:/.test(content);
  if (!hasPath) {
    errors.push('Missing or invalid API path definition');
  }

  const hasHttpMethod = /(get|post|put|delete|patch):/i.test(content);
  if (!hasHttpMethod) {
    errors.push('Missing HTTP method definition');
  }

  if (!content.includes('summary:')) {
    errors.push('Missing summary field');
  }

  return errors;
}

function validateSchemas() {
  const docFiles = findDocFiles();

  docFiles.forEach((docFile) => {
    const errors = validateSwaggerSyntax(docFile);
    if (errors.length > 0) {
      schemaErrors.push({
        file: path.relative(process.cwd(), docFile),
        errors,
      });
      hasErrors = true;
    }
  });
}

function printResults() {
  if (!hasErrors) {
    const docFiles = findDocFiles();
    console.log(`Validated ${docFiles.length} documentation file(s)`);
    return;
  }

  console.log('\nSchema Validation Results:\n');

  if (schemaErrors.length > 0) {
    console.log(`Schema errors: ${schemaErrors.length} file(s)`);
    schemaErrors.forEach(({ file, errors }) => {
      console.log(`   - ${file}`);
      errors.forEach((error) => {
        console.log(`     - ${error}`);
      });
    });
    console.log();
  }
}

try {
  validateSchemas();
  printResults();

  if (hasErrors) {
    process.exit(1);
  }
} catch (error) {
  console.error('Error during schema validation:', error.message);
  process.exit(1);
}

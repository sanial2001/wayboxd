#!/usr/bin/env node

/**
 * Swagger Coverage Validator
 * Checks that all route.ts files have corresponding route.docs.ts files
 * and that all HTTP methods are documented
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const API_DIR = path.join(process.cwd(), 'src/app/api');
const REQUEST_MODELS_DIR = path.join(process.cwd(), 'src/app/api/model/request');
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const BODY_METHODS = ['POST', 'PUT', 'PATCH'];

const WHITELIST_PATTERNS = [/\(controller\)\/place\//];

let hasErrors = false;
const missingDocs = [];
const methodMismatches = [];
const orphanedDocs = [];
const missingRequestBody = [];
const requestBodyMismatches = [];

function isWhitelisted(filePath) {
  const relativePath = path.relative(API_DIR, filePath);
  return WHITELIST_PATTERNS.some((pattern) => pattern.test(relativePath));
}

function findRouteFiles() {
  const allFiles = glob.sync('**/route.ts', {
    cwd: API_DIR,
    absolute: true,
    ignore: ['**/node_modules/**', '**/.next/**'],
  });
  return allFiles.filter((file) => isWhitelisted(file));
}

function findDocFiles() {
  const allFiles = glob.sync('**/route.docs.ts', {
    cwd: API_DIR,
    absolute: true,
    ignore: ['**/node_modules/**', '**/.next/**'],
  });
  return allFiles.filter((file) => isWhitelisted(file));
}

function extractHttpMethods(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const methods = [];

  for (const method of HTTP_METHODS) {
    const regex = new RegExp(`export\\s+async\\s+function\\s+${method}\\s*\\(`, 'i');
    if (regex.test(content)) {
      methods.push(method);
    }
  }

  return methods;
}

function extractDocumentedMethods(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const methods = [];

  for (const method of HTTP_METHODS) {
    const regex = new RegExp(`\\s+${method.toLowerCase()}:`, 'i');
    if (regex.test(content)) {
      methods.push(method);
    }
  }

  return methods;
}

function extractRequestBodyFromRoute(routeContent, method) {
  const methodFuncRegex = new RegExp(
    `export\\s+async\\s+function\\s+${method}\\s*\\([^)]*\\)[^{]*\\{([\\s\\S]*?)(?=export\\s+async\\s+function|$)`,
    'i'
  );
  const methodMatch = routeContent.match(methodFuncRegex);

  if (!methodMatch) return null;

  const methodBody = methodMatch[1];
  const hasReqJson = /await\s+req\.json\(\)/.test(methodBody);
  if (!hasReqJson) return null;

  const typeMatch = methodBody.match(
    /const\s+\w+:\s*([A-Z]\w+(?:<[^>]+>)?(?:\[\])?)\s*=\s*await\s+req\.json\(\)/
  );

  if (!typeMatch) return { hasBody: true, typeName: null };

  return { hasBody: true, typeName: typeMatch[1].replace(/\[\]$/, '') };
}

function extractInterfaceProperties(typeName) {
  if (!typeName) return null;

  const requestFiles = glob.sync('**/*.ts', {
    cwd: REQUEST_MODELS_DIR,
    absolute: true,
  });

  for (const file of requestFiles) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const interfaceRegex = new RegExp(
        `export\\s+(?:interface|type)\\s+${typeName}\\s*(?:=\\s*)?\\{([^}]+)\\}`,
        's'
      );
      const match = content.match(interfaceRegex);

      if (match) {
        const body = match[1];
        const propertyMatches = body.matchAll(/^\s*(\w+)\??:/gm);
        return Array.from(propertyMatches, (m) => m[1]);
      }
    } catch {
      continue;
    }
  }

  return null;
}

function extractDocumentedRequestBodyProperties(docContent, method) {
  const methodLower = method.toLowerCase();
  const methodRegex = new RegExp(
    `${methodLower}:([\\s\\S]*?)(?:\\n\\s+(?:get|post|put|delete|patch):|$)`,
    'i'
  );
  const methodMatch = docContent.match(methodRegex);

  if (!methodMatch) return null;

  const methodSection = methodMatch[1];
  if (!/requestBody:/i.test(methodSection)) return { hasRequestBody: false };

  const requestBodyRegex = /requestBody:([\s\S]*?)(?:\n\s*\*\s+responses:)/;
  const requestBodyMatch = methodSection.match(requestBodyRegex);

  if (!requestBodyMatch) return { hasRequestBody: true, properties: [] };

  const requestBodySection = requestBodyMatch[1];
  const propertiesRegex = /properties:\s*\n([\s\S]*?)$/;
  const propertiesMatch = requestBodySection.match(propertiesRegex);

  if (!propertiesMatch) return { hasRequestBody: true, properties: [] };

  const propertiesSection = propertiesMatch[1];
  const lines = propertiesSection.split('\n');
  const properties = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^\s*\*\s{15}(\w+):\s*$/);
    if (match) {
      const prop = match[1];
      const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
      const isPropertyDefinition = nextLine.match(
        /^\s*\*\s{17}(type|description|example|enum|items|format|minimum|maximum|required|nullable|properties|items):/
      );

      if (
        isPropertyDefinition ||
        ![
          'type',
          'description',
          'example',
          'enum',
          'items',
          'format',
          'minimum',
          'maximum',
          'required',
          'content',
          'schema',
        ].includes(prop)
      ) {
        properties.push(prop);
      }
    }
  }

  return { hasRequestBody: true, properties };
}

function getRelativePath(filePath) {
  return path.relative(process.cwd(), filePath);
}

function validateCoverage() {
  const routeFiles = findRouteFiles();
  const docFiles = findDocFiles();
  const routeFilesMap = new Map();

  routeFiles.forEach((routeFile) => {
    const docFile = routeFile.replace(/route\.ts$/, 'route.docs.ts');
    routeFilesMap.set(routeFile, docFile);
  });

  routeFiles.forEach((routeFile) => {
    const docFile = routeFilesMap.get(routeFile);
    if (!fs.existsSync(docFile)) {
      missingDocs.push(getRelativePath(routeFile));
      hasErrors = true;
    }
  });

  routeFiles.forEach((routeFile) => {
    const docFile = routeFilesMap.get(routeFile);
    if (fs.existsSync(docFile)) {
      const routeMethods = extractHttpMethods(routeFile);
      const docMethods = extractDocumentedMethods(docFile);

      if (routeMethods.length > 0) {
        const missingMethods = routeMethods.filter((m) => !docMethods.includes(m));
        if (missingMethods.length > 0) {
          methodMismatches.push({
            route: getRelativePath(routeFile),
            missing: missingMethods,
            routeMethods,
            docMethods,
          });
          hasErrors = true;
        }
      }
    }
  });

  docFiles.forEach((docFile) => {
    const routeFile = docFile.replace(/route\.docs\.ts$/, 'route.ts');
    if (!fs.existsSync(routeFile)) {
      orphanedDocs.push(getRelativePath(docFile));
      hasErrors = true;
    }
  });

  routeFiles.forEach((routeFile) => {
    const docFile = routeFilesMap.get(routeFile);
    if (!fs.existsSync(docFile)) return;

    const routeContent = fs.readFileSync(routeFile, 'utf-8');
    const docContent = fs.readFileSync(docFile, 'utf-8');
    const routeMethods = extractHttpMethods(routeFile);

    routeMethods.forEach((method) => {
      if (!BODY_METHODS.includes(method)) return;

      const bodyInfo = extractRequestBodyFromRoute(routeContent, method);
      const docBodyInfo = extractDocumentedRequestBodyProperties(docContent, method);

      if (bodyInfo?.hasBody && (!docBodyInfo || !docBodyInfo.hasRequestBody)) {
        missingRequestBody.push({
          route: getRelativePath(routeFile),
          method,
          typeName: bodyInfo.typeName,
        });
        hasErrors = true;
        return;
      }

      if (bodyInfo?.hasBody && bodyInfo.typeName && docBodyInfo?.hasRequestBody) {
        const expectedProps = extractInterfaceProperties(bodyInfo.typeName);
        const documentedProps = docBodyInfo.properties || [];

        if (expectedProps && expectedProps.length > 0) {
          const missingProps = expectedProps.filter((prop) => !documentedProps.includes(prop));
          const extraProps = documentedProps.filter((prop) => !expectedProps.includes(prop));

          if (missingProps.length > 0 || extraProps.length > 0) {
            requestBodyMismatches.push({
              route: getRelativePath(routeFile),
              method,
              typeName: bodyInfo.typeName,
              expectedProps,
              documentedProps,
              missingProps,
              extraProps,
            });
            hasErrors = true;
          }
        }
      }
    });
  });
}

function printResults() {
  if (!hasErrors) {
    const routeFiles = findRouteFiles();
    console.log(`Found ${routeFiles.length} route files, all properly documented`);
    return;
  }

  console.log('\nCoverage Validation Results:\n');

  if (missingDocs.length > 0) {
    console.log(`Missing documentation: ${missingDocs.length} route(s)`);
    missingDocs.forEach((file) => {
      console.log(`   - ${file}`);
    });
    console.log();
  }

  if (methodMismatches.length > 0) {
    console.log(`Method mismatches: ${methodMismatches.length} route(s)`);
    methodMismatches.forEach(({ route, missing, routeMethods, docMethods }) => {
      console.log(`   - ${route}`);
      console.log(`     Route has: ${routeMethods.join(', ')}`);
      console.log(`     Docs have: ${docMethods.length > 0 ? docMethods.join(', ') : 'none'}`);
      console.log(`     Missing: ${missing.join(', ')}`);
    });
    console.log();
  }

  if (orphanedDocs.length > 0) {
    console.log(`Orphaned documentation: ${orphanedDocs.length} file(s)`);
    orphanedDocs.forEach((file) => {
      console.log(`   - ${file}`);
    });
    console.log();
  }

  if (missingRequestBody.length > 0) {
    console.log(`Missing requestBody documentation: ${missingRequestBody.length} route(s)`);
    missingRequestBody.forEach(({ route, method, typeName }) => {
      console.log(`   - ${route}`);
      console.log(
        `     ${method} reads request body${typeName ? ` (${typeName})` : ''} but docs missing requestBody`
      );
    });
    console.log();
  }

  if (requestBodyMismatches.length > 0) {
    console.log(`Request body property mismatches: ${requestBodyMismatches.length} route(s)`);
    requestBodyMismatches.forEach(
      ({ route, method, typeName, expectedProps, documentedProps, missingProps, extraProps }) => {
        console.log(`   - ${route}`);
        console.log(`     ${method} uses ${typeName}`);
        console.log(`     Expected properties: ${expectedProps.join(', ')}`);
        console.log(`     Documented properties: ${documentedProps.join(', ')}`);
        if (missingProps.length > 0) {
          console.log(`     Missing in docs: ${missingProps.join(', ')}`);
        }
        if (extraProps.length > 0) {
          console.log(`     Extra in docs: ${extraProps.join(', ')}`);
        }
      }
    );
    console.log();
  }
}

try {
  validateCoverage();
  printResults();

  if (hasErrors) {
    process.exit(1);
  }
} catch (error) {
  console.error('Error during validation:', error.message);
  process.exit(1);
}

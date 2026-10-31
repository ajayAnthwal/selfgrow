const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const targetOutputPath = path.resolve(__dirname, '../src/types/api.d.ts');
const localOpenApiJson = path.resolve(__dirname, '../../backend/openapi.json');

async function main() {
  console.log('Generating TypeScript API definitions from OpenAPI spec...');

  let source = localOpenApiJson;

  // If backend is running, prefer live docs endpoint
  try {
    const res = await fetch('http://localhost:5000/api/docs.json');
    if (res.ok) {
      source = 'http://localhost:5000/api/docs.json';
      console.log('Fetching live OpenAPI spec from http://localhost:5000/api/docs.json');
    }
  } catch {
    console.log(`Backend server not reachable online, using local spec: ${localOpenApiJson}`);
  }

  try {
    execSync(`npx openapi-typescript "${source}" -o "${targetOutputPath}"`, {
      stdio: 'inherit',
    });
    console.log(`✓ Successfully generated API types at: ${targetOutputPath}`);
  } catch (err) {
    console.error('Failed to generate API types:', err);
    process.exit(1);
  }
}

main();


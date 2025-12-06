#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

async function setupMonorepo() {
  const rootDir = process.cwd();
  const appsDir = path.join(rootDir, 'apps');
  const oldClientDir = path.join(rootDir, 'client');
  const oldServerDir = path.join(rootDir, 'server');
  const newClientDir = path.join(appsDir, 'client');
  const newServerDir = path.join(appsDir, 'server');

  console.log('🚀 Setting up monorepo structure...');

  try {
    // Ensure apps directory exists
    await fs.ensureDir(appsDir);

    // Check if apps already has the correct structure
    const clientExists = await fs.pathExists(newClientDir);
    const serverExists = await fs.pathExists(newServerDir);

    if (!clientExists && await fs.pathExists(oldClientDir)) {
      console.log('📁 Moving client to apps/client...');
      await fs.move(oldClientDir, newClientDir);
    }

    if (!serverExists && await fs.pathExists(oldServerDir)) {
      console.log('📁 Moving server to apps/server...');
      await fs.move(oldServerDir, newServerDir);
    }

    // Update package.json scripts if needed
    const packageJsonPath = path.join(rootDir, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);
    
    if (!packageJson.workspaces) {
      console.log('📝 Updating package.json with workspace configuration...');
      packageJson.workspaces = ['apps/*'];
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }

    console.log('✅ Monorepo structure setup complete!');
    console.log('📋 Next steps:');
    console.log('   1. Run: npm run install:all');
    console.log('   2. Configure environment variables');
    console.log('   3. Run: npm run dev');
    console.log('   4. Deploy using: npm run deploy:vercel or npm run docker:up');

  } catch (error) {
    console.error('❌ Error setting up monorepo:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  setupMonorepo();
}

module.exports = setupMonorepo;
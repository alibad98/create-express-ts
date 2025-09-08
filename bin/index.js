#!/usr/bin/env node
/**
 * create-express-ts-app
 * Simple scaffolder.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_DIR = path.join(__dirname, '../template');

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function replacePlaceholders(rootDir, replacements) {
  const extsToReplace = ['.json', '.env', '.md', '.txt'];

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await walk(full);
      } else {
        const ext = path.extname(e.name);
        if (extsToReplace.includes(ext) || e.name === 'package.json') {
          let txt = await fs.readFile(full, 'utf8');
          for (const [k, v] of Object.entries(replacements)) {
            txt = txt.split(k).join(v);
          }
          await fs.writeFile(full, txt, 'utf8');
        }
      }
    }
  }

  await walk(rootDir);
}

function detectInstaller() {
  try {
    execSync('bun --version', { stdio: 'ignore' });
    return 'bun';
  } catch {
    return 'npm';
  }
}

function normalizeMongoUri(raw) {
  try {
    const url = new URL(raw);
    if (url.password) {
      url.password = encodeURIComponent(url.password);
    }
    return url.toString();
  } catch {
    console.warn('Invalid MongoDB URI provided, using placeholder.');
    return 'mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.mongodb.net/mydb?retryWrites=true&w=majority';
  }
}

async function main() {
  const argvName = process.argv[2];

  const response = await prompts([
    {
      type: 'text',
      name: 'name',
      message: 'Project name',
      initial: argvName || 'my-express-app',
    },
    {
      type: 'text',
      name: 'description',
      message: 'Description',
      initial: 'Express + TypeScript + Bun + Mongo boilerplate',
    },
    {
      type: 'text',
      name: 'mongoUri',
      message: 'Enter your MongoDB connection string (full URI):',
      initial:
        'mongodb+srv://username:password@cluster0.mongodb.net/mydb?retryWrites=true&w=majority',
    },
    {
      type: 'confirm',
      name: 'install',
      message: 'Run dependency installer after scaffolding?',
      initial: true,
    },
  ]);

  if (!response.name) {
    console.error('Project name is required.');
    process.exit(1);
  }

  const projectPath = path.join(process.cwd(), response.name);
  if (await exists(projectPath)) {
    console.error(`Folder "${response.name}" already exists. Aborting.`);
    process.exit(1);
  }

  console.log(`Creating project folder: ${projectPath}`);
  await copyDir(TEMPLATE_DIR, projectPath);

  const mongoUri = normalizeMongoUri(response.mongoUri);

  const replacements = {
    projectname: response.name,
    description: response.description || '',
    __MONGO_URI__: mongoUri,
  };

  await replacePlaceholders(projectPath, replacements);

  const envExamplePath = path.join(projectPath, '.env.example');
  const envPath = path.join(projectPath, '.env');
  if (await exists(envExamplePath)) {
    await fs.rename(envExamplePath, envPath);
  }

  if (response.install) {
    const installer = detectInstaller();
    console.log(`Running installer using: ${installer}`);
    try {
      if (installer === 'bun') {
        execSync('bun install', { cwd: projectPath, stdio: 'inherit' });
      } else {
        execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
      }
    } catch {
      console.error(
        'Installer failed. You can run it manually inside project folder.'
      );
    }
  }

  console.log(`\nDone! Next steps:\n  cd ${response.name}`);
  console.log('  npm run dev  // or bun run dev\n');
}

main().catch((err) => {
  console.error('Scaffolder error:', err);
  process.exit(1);
});

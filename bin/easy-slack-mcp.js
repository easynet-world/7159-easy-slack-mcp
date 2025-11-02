#!/usr/bin/env node

// Bin script for easy-slack-mcp package
// This allows the package to be run directly via: npx easy-slack-mcp

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Find easy-mcp-server in node_modules
// Try require.resolve first, then fallback to manual path resolution
let easyMcpServerBin;
try {
  // Try to resolve the main entry point and work backwards
  const easyMcpServerMain = require.resolve('easy-mcp-server');
  const easyMcpServerDir = path.dirname(easyMcpServerMain);
  const binPath = path.join(easyMcpServerDir, 'src', 'easy-mcp-server.js');
  
  if (fs.existsSync(binPath)) {
    easyMcpServerBin = binPath;
  } else {
    throw new Error('Bin path not found');
  }
} catch (err) {
  // Fallback: construct path from current module's node_modules
  const currentDir = __dirname;
  const projectRoot = path.resolve(currentDir, '..');
  const nodeModulesPath = path.join(projectRoot, 'node_modules', 'easy-mcp-server', 'src', 'easy-mcp-server.js');
  
  if (fs.existsSync(nodeModulesPath)) {
    easyMcpServerBin = nodeModulesPath;
  } else {
    console.error('Error: Could not find easy-mcp-server. Please ensure it is installed.');
    process.exit(1);
  }
}

// Spawn easy-mcp-server with current process's env and stdio
const child = spawn('node', [easyMcpServerBin], {
  stdio: 'inherit',
  env: process.env,
  cwd: process.cwd(),
  shell: false
});

child.on('error', (err) => {
  console.error('Failed to start easy-mcp-server:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

// Handle signals
process.on('SIGINT', () => {
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});


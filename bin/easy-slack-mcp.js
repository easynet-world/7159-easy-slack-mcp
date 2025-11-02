#!/usr/bin/env node

// Bin script for easy-slack-mcp package
// This allows the package to be run directly via: npx easy-slack-mcp

const { spawn } = require('child_process');
const path = require('path');

// Get the path to easy-mcp-server's bin
const easyMcpServerPackage = path.dirname(require.resolve('easy-mcp-server/package.json'));
const easyMcpServerBin = path.join(easyMcpServerPackage, 'src', 'easy-mcp-server.js');

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


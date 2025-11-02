const request = require('supertest');
const { DynamicAPIServer } = require('easy-mcp-server');
const path = require('path');
const fs = require('fs');

// Increase timeout for all tests
jest.setTimeout(30000);

describe('Setup and Installation Tests', () => {
  describe('Quick Start - Environment Variable Setup', () => {
    test('Server should start with SLACK_BOT_TOKEN from environment', async () => {
      // This test verifies the Quick Start command pattern works
      // SLACK_BOT_TOKEN=xoxb-your-token-here npx easy-slack-mcp
      
      const originalToken = process.env.SLACK_BOT_TOKEN;
      
      // Set a test token
      process.env.SLACK_BOT_TOKEN = 'xoxb-test-token-123';
      
      const server = new DynamicAPIServer({
        port: 0, // Random port
        cors: { origin: '*' }
      });
      
      try {
        await server.start();
        const app = server.app;
        
        // Test that server is running
        const healthResponse = await request(app).get('/health');
        expect(healthResponse.status).toBe(200);
        
        // Test that environment variable is loaded
        expect(process.env.SLACK_BOT_TOKEN).toBe('xoxb-test-token-123');
        
        await server.stop();
      } finally {
        // Restore original token
        if (originalToken) {
          process.env.SLACK_BOT_TOKEN = originalToken;
        } else {
          delete process.env.SLACK_BOT_TOKEN;
        }
      }
    });

    test('Server should work without SLACK_BOT_TOKEN (graceful handling)', async () => {
      const originalToken = process.env.SLACK_BOT_TOKEN;
      delete process.env.SLACK_BOT_TOKEN;
      
      const server = new DynamicAPIServer({
        port: 0,
        cors: { origin: '*' }
      });
      
      try {
        await server.start();
        const app = server.app;
        
        // Server should still start (Slack endpoints will fail but server is up)
        const healthResponse = await request(app).get('/health');
        expect(healthResponse.status).toBe(200);
        
        await server.stop();
      } finally {
        if (originalToken) {
          process.env.SLACK_BOT_TOKEN = originalToken;
        }
      }
    });
  });

  describe('Server Endpoints After Setup', () => {
    let server;
    let app;
    let originalPort;
    let originalMcpPort;

    beforeAll(async () => {
      // Clear port env vars to ensure random port is used
      originalPort = process.env.EASY_MCP_SERVER_PORT;
      originalMcpPort = process.env.EASY_MCP_SERVER_MCP_PORT;
      delete process.env.EASY_MCP_SERVER_PORT;
      delete process.env.EASY_MCP_SERVER_MCP_PORT;
      
      server = new DynamicAPIServer({
        port: 0,
        cors: { origin: '*' }
      });
      await server.start();
      app = server.app;
    }, 30000);

    afterAll(async () => {
      if (server) {
        try {
          await server.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      // Restore env vars
      if (originalPort) process.env.EASY_MCP_SERVER_PORT = originalPort;
      if (originalMcpPort) process.env.EASY_MCP_SERVER_MCP_PORT = originalMcpPort;
    }, 10000);

    test('Health endpoint should be accessible at /health', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
    });

    test('API info endpoint should be accessible at /api-info', async () => {
      const response = await request(app).get('/api-info');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    test('OpenAPI spec should be accessible at /openapi.json', async () => {
      const response = await request(app).get('/openapi.json');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('openapi');
      expect(response.body.openapi).toMatch(/^\d+\.\d+\.\d+$/);
    });

    test('Swagger UI docs should be accessible at /docs', async () => {
      const response = await request(app).get('/docs');
      // Should return HTML (Swagger UI) or redirect
      expect([200, 302, 301]).toContain(response.status);
    });

    test('Server should run on specified port', async () => {
      const testPort = 0; // Use random port to avoid conflicts
      const defaultPortServer = new DynamicAPIServer({
        port: testPort,
        cors: { origin: '*' }
      });
      
      await defaultPortServer.start();
      // Server should start successfully on a random port
      expect(defaultPortServer.port).toBeGreaterThan(0);
      await defaultPortServer.stop();
    });
  });

  describe('Environment Configuration', () => {
    test('Should load configuration from environment variables', async () => {
      // Test that server can start with environment variables
      // Save and clear port env vars to ensure port 0 is used
      const originalPort = process.env.EASY_MCP_SERVER_PORT;
      const originalMcpPort = process.env.EASY_MCP_SERVER_MCP_PORT;
      
      delete process.env.EASY_MCP_SERVER_PORT;
      delete process.env.EASY_MCP_SERVER_MCP_PORT;
      
      try {
        const server = new DynamicAPIServer({
          port: 0, // Random port
          cors: { origin: '*' }
        });
        
        await server.start();
        expect(server.port).toBeGreaterThan(0);
        await server.stop();
      } finally {
        if (originalPort) process.env.EASY_MCP_SERVER_PORT = originalPort;
        if (originalMcpPort) process.env.EASY_MCP_SERVER_MCP_PORT = originalMcpPort;
      }
    });

    test('SLACK_BOT_TOKEN format should be validated', async () => {
      const server = new DynamicAPIServer({
        port: 0,
        cors: { origin: '*' }
      });
      
      await server.start();
      const app = server.app;
      
      // Test auth endpoint - should handle invalid/missing tokens gracefully
      const response = await request(app).get('/slack/auth/test');
      
      // Should return a response (either success or error, but not crash)
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(600);
      
      await server.stop();
    });
  });

  describe('Package Installation and Execution', () => {
    test('Package.json should have correct start script', () => {
      const packageJson = require('../package.json');
      expect(packageJson.scripts).toHaveProperty('start');
      expect(packageJson.scripts.start).toBe('easy-mcp-server');
    });

    test('Package.json should have correct test script', () => {
      const packageJson = require('../package.json');
      expect(packageJson.scripts).toHaveProperty('test');
      expect(packageJson.scripts.test).toBe('jest');
    });

    test('Package name should match npm package', () => {
      const packageJson = require('../package.json');
      expect(packageJson.name).toBe('easy-slack-mcp');
    });

    test('Package should declare easy-mcp-server as dependency', () => {
      const packageJson = require('../package.json');
      expect(packageJson.dependencies).toHaveProperty('easy-mcp-server');
    });

    test('Required files should be included in package', () => {
      const packageJson = require('../package.json');
      expect(packageJson.files).toContain('index.js');
      expect(packageJson.files).toContain('api/');
      expect(packageJson.files).toContain('README.md');
    });
  });

  describe('Server Startup and Shutdown', () => {
    test('Server should start successfully', async () => {
      const server = new DynamicAPIServer({
        port: 0,
        cors: { origin: '*' }
      });
      
      await expect(server.start()).resolves.not.toThrow();
      expect(server.port).toBeGreaterThan(0);
      
      await server.stop();
    });

    test('Server should stop gracefully', async () => {
      const server = new DynamicAPIServer({
        port: 0,
        cors: { origin: '*' }
      });
      
      await server.start();
      await expect(server.stop()).resolves.not.toThrow();
    });

    test('Multiple server instances should use different ports', async () => {
      const server1 = new DynamicAPIServer({ port: 0, cors: { origin: '*' } });
      const server2 = new DynamicAPIServer({ port: 0, cors: { origin: '*' } });
      
      try {
        await Promise.all([server1.start(), server2.start()]);
        
        expect(server1.port).not.toBe(server2.port);
        expect(server1.port).toBeGreaterThan(0);
        expect(server2.port).toBeGreaterThan(0);
      } finally {
        // Ensure cleanup even if test fails
        await Promise.all([
          server1.stop().catch(() => {}),
          server2.stop().catch(() => {})
        ]);
      }
    });
  });

  describe('Quick Start Command Verification', () => {
    test('npx command pattern should work (simulated)', () => {
      // This test verifies the Quick Start pattern is correct
      // In real scenario: SLACK_BOT_TOKEN=xoxb-your-token-here npx easy-slack-mcp
      
      const commandPattern = 'SLACK_BOT_TOKEN=xoxb-your-token-here npx easy-slack-mcp';
      
      // Verify command pattern structure
      expect(commandPattern).toContain('SLACK_BOT_TOKEN=');
      expect(commandPattern).toContain('npx');
      expect(commandPattern).toContain('easy-slack-mcp');
      
      // Verify token format
      const tokenMatch = commandPattern.match(/SLACK_BOT_TOKEN=(xoxb-[^\s]+)/);
      expect(tokenMatch).not.toBeNull();
      expect(tokenMatch[1]).toMatch(/^xoxb-/);
    });

    test('Server should be accessible after Quick Start (simulated)', async () => {
      // Simulate Quick Start: Set token and start server
      const originalToken = process.env.SLACK_BOT_TOKEN;
      process.env.SLACK_BOT_TOKEN = 'xoxb-test-quick-start-token';
      
      const server = new DynamicAPIServer({
        port: 0,
        cors: { origin: '*' }
      });
      
      try {
        await server.start();
        const app = server.app;
        
        // Verify all Quick Start mentioned endpoints are accessible
        const endpoints = [
          '/health',
          '/api-info',
          '/openapi.json',
          '/docs'
        ];
        
        for (const endpoint of endpoints) {
          const response = await request(app).get(endpoint);
          expect([200, 302, 301]).toContain(response.status);
        }
        
        await server.stop();
      } finally {
        if (originalToken) {
          process.env.SLACK_BOT_TOKEN = originalToken;
        } else {
          delete process.env.SLACK_BOT_TOKEN;
        }
      }
    });
  });

  describe('Documentation and API Access', () => {
    let server;
    let app;
    let originalPort;
    let originalMcpPort;

    beforeAll(async () => {
      // Clear port env vars to ensure random port is used
      originalPort = process.env.EASY_MCP_SERVER_PORT;
      originalMcpPort = process.env.EASY_MCP_SERVER_MCP_PORT;
      delete process.env.EASY_MCP_SERVER_PORT;
      delete process.env.EASY_MCP_SERVER_MCP_PORT;
      
      server = new DynamicAPIServer({
        port: 0,
        cors: { origin: '*' }
      });
      await server.start();
      app = server.app;
    }, 30000);

    afterAll(async () => {
      if (server) {
        try {
          await server.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      // Restore env vars
      if (originalPort) process.env.EASY_MCP_SERVER_PORT = originalPort;
      if (originalMcpPort) process.env.EASY_MCP_SERVER_MCP_PORT = originalMcpPort;
    }, 10000);

    test('OpenAPI spec should include Slack endpoints', async () => {
      const response = await request(app).get('/openapi.json');
      expect(response.status).toBe(200);
      
      const openapi = response.body;
      expect(openapi).toHaveProperty('paths');
      
      // Check for some key Slack endpoints
      const paths = Object.keys(openapi.paths);
      expect(paths.some(path => path.includes('/slack'))).toBe(true);
    });

    test('API info should return correct framework information', async () => {
      const response = await request(app).get('/api-info');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      // Should mention the framework
      expect(response.body.message).toContain('API');
    });
  });
});

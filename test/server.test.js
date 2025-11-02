const request = require('supertest');
const { DynamicAPIServer } = require('easy-mcp-server');
require('dotenv').config();

describe('Slack MCP Server', () => {
  let server;
  let app;

  beforeAll(async () => {
    server = new DynamicAPIServer({
      port: 0, // Use random port for testing
      cors: { origin: '*' }
    });
    await server.start();
    app = server.app;
  });

  afterAll(async () => {
    if (server) {
      await server.stop();
    }
  });

  // System Endpoints
  describe('System Endpoints', () => {
    test('GET /health should return 200', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(['OK', 'healthy', 'partial', 'unhealthy']).toContain(response.body.status);
    });

    test('GET /api-info should return API information', async () => {
      const response = await request(app).get('/api-info');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Dynamic API Framework');
    });

    test('GET /openapi.json should return OpenAPI spec', async () => {
      const response = await request(app).get('/openapi.json');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('openapi');
    });
  });

  // Authentication Tests
  describe('Slack Authentication', () => {
    test('GET /slack/auth/test should test authentication', async () => {
      const response = await request(app).get('/slack/auth/test');

      if (process.env.SLACK_BOT_TOKEN && !process.env.SLACK_BOT_TOKEN.includes('your-')) {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success');
        if (response.body.success) {
          expect(response.body.data).toHaveProperty('team');
          expect(response.body.data).toHaveProperty('user');
          expect(response.body.data).toHaveProperty('team_id');
        }
      } else {
        // If no valid token, should return error
        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
      }
    });
  });

  // Message Tests
  describe('Slack Messages', () => {
    test('POST /slack/messages should validate required fields', async () => {
      const response = await request(app)
        .post('/slack/messages')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('channel');
    });

    test('POST /slack/messages should validate text or blocks', async () => {
      const response = await request(app)
        .post('/slack/messages')
        .send({ channel: 'C1234567890' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('text');
    });

    test('POST /slack/messages should accept valid message', async () => {
      const response = await request(app)
        .post('/slack/messages')
        .send({
          channel: process.env.TEST_CHANNEL_ID || 'C1234567890',
          text: 'Test message'
        });

      // Will fail without valid token, but structure should be correct
      expect(response.body).toHaveProperty('success');
      if (!response.body.success) {
        expect(response.body).toHaveProperty('error');
      }
    });

    test('POST /slack/messages/update should validate required fields', async () => {
      const response = await request(app)
        .post('/slack/messages/update')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('POST /slack/messages/update should accept valid update', async () => {
      const response = await request(app)
        .post('/slack/messages/update')
        .send({
          channel: process.env.TEST_CHANNEL_ID || 'C1234567890',
          ts: process.env.TEST_MESSAGE_TS || '1234567890.123456',
          text: 'Updated message'
        });

      expect(response.body).toHaveProperty('success');
    });

    test('POST /slack/messages/delete should validate required fields', async () => {
      const response = await request(app)
        .post('/slack/messages/delete')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('POST /slack/messages/delete should accept valid delete', async () => {
      const response = await request(app)
        .post('/slack/messages/delete')
        .send({
          channel: process.env.TEST_CHANNEL_ID || 'C1234567890',
          ts: process.env.TEST_MESSAGE_TS || '1234567890.123456'
        });

      expect(response.body).toHaveProperty('success');
    });
  });

  // Conversation Tests
  describe('Slack Conversations', () => {
    test('GET /slack/conversations/list should list conversations', async () => {
      const response = await request(app)
        .get('/slack/conversations/list')
        .query({ types: 'public_channel' });

      expect(response.body).toHaveProperty('success');
      if (response.body.success) {
        expect(response.body.data).toHaveProperty('channels');
      }
    });

    test('GET /slack/conversations/info should validate channel parameter', async () => {
      const response = await request(app)
        .get('/slack/conversations/info');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('channel');
    });

    test('GET /slack/conversations/info should accept valid channel', async () => {
      const response = await request(app)
        .get('/slack/conversations/info')
        .query({ channel: process.env.TEST_CHANNEL_ID || 'C1234567890' });

      expect(response.body).toHaveProperty('success');
    });

    test('POST /slack/conversations/create should validate name', async () => {
      const response = await request(app)
        .post('/slack/conversations/create')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('name');
    });

    test('POST /slack/conversations/create should accept valid name', async () => {
      const response = await request(app)
        .post('/slack/conversations/create')
        .send({ name: 'test-channel-' + Date.now() });

      expect(response.body).toHaveProperty('success');
    });

    test('GET /slack/conversations/history should validate channel', async () => {
      const response = await request(app)
        .get('/slack/conversations/history');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('GET /slack/conversations/history should accept valid request', async () => {
      const response = await request(app)
        .get('/slack/conversations/history')
        .query({
          channel: process.env.TEST_CHANNEL_ID || 'C1234567890',
          limit: 10
        });

      expect(response.body).toHaveProperty('success');
    });
  });

  // User Tests
  describe('Slack Users', () => {
    test('GET /slack/users/list should list users', async () => {
      const response = await request(app)
        .get('/slack/users/list');

      expect(response.body).toHaveProperty('success');
      if (response.body.success) {
        expect(response.body.data).toHaveProperty('members');
      }
    });

    test('GET /slack/users/list should accept limit parameter', async () => {
      const response = await request(app)
        .get('/slack/users/list')
        .query({ limit: 50 });

      expect(response.body).toHaveProperty('success');
    });

    test('GET /slack/users/info should validate user parameter', async () => {
      const response = await request(app)
        .get('/slack/users/info');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('user');
    });

    test('GET /slack/users/info should accept valid user', async () => {
      const response = await request(app)
        .get('/slack/users/info')
        .query({ user: process.env.TEST_USER_ID || 'U1234567890' });

      expect(response.body).toHaveProperty('success');
    });

    test('GET /slack/users/profile should get profile', async () => {
      const response = await request(app)
        .get('/slack/users/profile');

      expect(response.body).toHaveProperty('success');
    });

    test('GET /slack/users/profile should accept user parameter', async () => {
      const response = await request(app)
        .get('/slack/users/profile')
        .query({ user: process.env.TEST_USER_ID || 'U1234567890' });

      expect(response.body).toHaveProperty('success');
    });
  });

  // File Tests
  describe('Slack Files', () => {
    test('POST /slack/files/upload should validate content or file', async () => {
      const response = await request(app)
        .post('/slack/files/upload')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('content');
    });

    test('POST /slack/files/upload should accept text content', async () => {
      const response = await request(app)
        .post('/slack/files/upload')
        .send({
          content: 'Test file content',
          filename: 'test.txt',
          channels: process.env.TEST_CHANNEL_ID || 'C1234567890'
        });

      expect(response.body).toHaveProperty('success');
    });

    test('POST /slack/files/upload should accept base64 file', async () => {
      const response = await request(app)
        .post('/slack/files/upload')
        .send({
          file: Buffer.from('Test content').toString('base64'),
          filename: 'test.txt',
          channels: process.env.TEST_CHANNEL_ID || 'C1234567890'
        });

      expect(response.body).toHaveProperty('success');
    });

    test('GET /slack/files/list should list files', async () => {
      const response = await request(app)
        .get('/slack/files/list');

      expect(response.body).toHaveProperty('success');
      if (response.body.success) {
        expect(response.body.data).toHaveProperty('files');
      }
    });

    test('GET /slack/files/list should accept filter parameters', async () => {
      const response = await request(app)
        .get('/slack/files/list')
        .query({
          count: 10,
          types: 'images'
        });

      expect(response.body).toHaveProperty('success');
    });

    test('GET /slack/files/info should validate file parameter', async () => {
      const response = await request(app)
        .get('/slack/files/info');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('file');
    });

    test('GET /slack/files/info should accept valid file ID', async () => {
      const response = await request(app)
        .get('/slack/files/info')
        .query({ file: 'F1234567890' });

      expect(response.body).toHaveProperty('success');
    });
  });

  // Reaction Tests
  describe('Slack Reactions', () => {
    test('POST /slack/reactions/add should validate required fields', async () => {
      const response = await request(app)
        .post('/slack/reactions/add')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('POST /slack/reactions/add should accept valid reaction', async () => {
      const response = await request(app)
        .post('/slack/reactions/add')
        .send({
          channel: process.env.TEST_CHANNEL_ID || 'C1234567890',
          timestamp: process.env.TEST_MESSAGE_TS || '1234567890.123456',
          name: 'thumbsup'
        });

      expect(response.body).toHaveProperty('success');
    });

    test('POST /slack/reactions/remove should validate required fields', async () => {
      const response = await request(app)
        .post('/slack/reactions/remove')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('POST /slack/reactions/remove should accept valid reaction', async () => {
      const response = await request(app)
        .post('/slack/reactions/remove')
        .send({
          channel: process.env.TEST_CHANNEL_ID || 'C1234567890',
          timestamp: process.env.TEST_MESSAGE_TS || '1234567890.123456',
          name: 'thumbsup'
        });

      expect(response.body).toHaveProperty('success');
    });
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    test('Should return 404 for non-existent endpoints', async () => {
      const response = await request(app)
        .get('/slack/nonexistent/endpoint');

      expect(response.status).toBe(404);
    });

    test('Should handle invalid JSON in POST requests', async () => {
      const response = await request(app)
        .post('/slack/messages')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      // Should return error status (400 or 500 depending on framework handling)
      expect([400, 500]).toContain(response.status);
    });
  });

  // Response Format Tests
  describe('Response Format', () => {
    test('Success responses should have consistent format', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.body).toHaveProperty('status');
    });

    test('Error responses should have consistent format', async () => {
      const response = await request(app)
        .post('/slack/messages')
        .send({});

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Integration Tests (require valid token)
  describe('Integration Tests (with valid token)', () => {
    const hasValidToken = process.env.SLACK_BOT_TOKEN &&
                         !process.env.SLACK_BOT_TOKEN.includes('your-');

    (hasValidToken ? test : test.skip)('Should successfully authenticate', async () => {
      const response = await request(app)
        .get('/slack/auth/test');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('team_id');
    });

    (hasValidToken ? test : test.skip)('Should successfully list conversations', async () => {
      const response = await request(app)
        .get('/slack/conversations/list')
        .query({ types: 'public_channel', limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.channels)).toBe(true);
    });

    (hasValidToken ? test : test.skip)('Should successfully list users', async () => {
      const response = await request(app)
        .get('/slack/users/list')
        .query({ limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.members)).toBe(true);
    });
  });
});


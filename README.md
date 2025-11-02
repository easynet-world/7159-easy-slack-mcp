# Slack MCP Server

A Model Context Protocol (MCP) server for Slack integration that provides comprehensive access to Slack's Web API, enabling AI agents to interact with Slack workspaces programmatically.

## Features

- **Complete Slack API Integration**: Access to messaging, channels, users, files, and more
- **MCP-Compatible**: Works with any MCP-compatible AI agent or client
- **RESTful API**: Clean, consistent REST endpoints for all Slack operations
- **Comprehensive Documentation**: Built-in API docs and MCP resources
- **AI-Ready Prompts**: Pre-built prompts for common Slack workflows

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Slack Credentials

1. Create a Slack App at [https://api.slack.com/apps](https://api.slack.com/apps)
2. Add required OAuth scopes (see [Quick Start Guide](mcp/resources/slack-quick-start.md))
3. Install the app to your workspace
4. Copy your Bot Token

### 3. Set Environment Variables

Create a `.env` file in the project root and add your Slack Bot Token:

```
SLACK_BOT_TOKEN=xoxb-your-token-here
```

### 4. Start the Server

```bash
npm start
```

The server will start on port 8887. You can change the port by setting the `EASY_MCP_SERVER_PORT` environment variable.

## API Endpoints

### Messages
- `POST /slack/messages` - Send a message
- `POST /slack/messages/update` - Update a message
- `POST /slack/messages/delete` - Delete a message

### Conversations (Channels)
- `GET /slack/conversations/list` - List channels
- `GET /slack/conversations/info` - Get channel info
- `POST /slack/conversations/create` - Create a channel
- `GET /slack/conversations/history` - Get message history

### Users
- `GET /slack/users/list` - List users
- `GET /slack/users/info` - Get user info
- `GET /slack/users/profile` - Get user profile

### Files
- `POST /slack/files/upload` - Upload a file
- `GET /slack/files/list` - List files
- `GET /slack/files/info` - Get file info

### Reactions
- `POST /slack/reactions/add` - Add a reaction
- `POST /slack/reactions/remove` - Remove a reaction

### Authentication
- `GET /slack/auth/test` - Test authentication

### System Endpoints
- `GET /health` - Health check
- `GET /api-info` - API information
- `GET /openapi.json` - OpenAPI specification
- `GET /docs` - API documentation

## MCP Resources

This server includes MCP resources that AI agents can access:

- **[API Documentation](mcp/resources/api-documentation.md)** - Complete API reference
- **[Quick Start Guide](mcp/resources/slack-quick-start.md)** - Setup and usage instructions

## MCP Prompts

Pre-built prompts for common Slack operations:

- **send-message** - Send messages to channels
- **channel-summary** - Analyze and summarize channel activity
- **workspace-digest** - Generate comprehensive workspace digests
- **user-lookup** - Find and display user information

## Example Usage

### Send a Message

```bash
curl -X POST http://localhost:8887/slack/messages \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "C1234567890",
    "text": "Hello from Slack MCP!"
  }'
```

### List Channels

```bash
curl http://localhost:8887/slack/conversations/list?types=public_channel
```

### Get User Info

```bash
curl "http://localhost:8887/slack/users/info?user=U1234567890"
```

### Upload a File

```bash
curl -X POST http://localhost:8887/slack/files/upload \
  -H "Content-Type: application/json" \
  -d '{
    "channels": "C1234567890",
    "filename": "report.txt",
    "content": "This is the file content"
  }'
```

## Environment Variables

Configure these in your `.env` file:

### Required
- `SLACK_BOT_TOKEN` - Your Slack Bot User OAuth Token

### Optional
- `SLACK_APP_TOKEN` - App-level token (for Socket Mode)
- `SLACK_SIGNING_SECRET` - Signing secret (for event verification)
- `EASY_MCP_SERVER_PORT` - Server port (default: 8887)
- `EASY_MCP_SERVER_CORS_ORIGIN` - CORS origin (default: *)
- `EASY_MCP_SERVER_CORS_METHODS` - Allowed HTTP methods
- `EASY_MCP_SERVER_CORS_CREDENTIALS` - Allow credentials

## Troubleshooting

See the [Quick Start Guide](mcp/resources/slack-quick-start.md#troubleshooting) for common issues and solutions.

## Learn More

- [Easy MCP Server Documentation](https://github.com/easynet-world/7134-easy-mcp-server)
- [Slack API Documentation](https://api.slack.com/methods)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Slack API Scopes Reference](https://api.slack.com/scopes)

## License

MIT


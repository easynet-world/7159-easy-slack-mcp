# easy-slack-mcp

**Slack integration for AI assistants** - Connect Cursor, Claude Desktop, and other MCP-compatible tools directly to Slack. Send messages, read channels, manage users, and automate workflows with AI.

[![npm version](https://img.shields.io/npm/v/easy-slack-mcp)](https://www.npmjs.com/package/easy-slack-mcp)

---

## 🚀 Quick Start (2 Steps)

### 1️⃣ Get your Slack Bot Token
1. Go to [https://api.slack.com/apps](https://api.slack.com/apps)
2. Create a new app → Install to workspace
3. Copy your **Bot Token** (starts with `xoxb-`)
4. Add scopes: `chat:write`, `channels:read`, `channels:history`, `users:read`, `files:write`

### 2️⃣ Configure & Run
```bash
# Create a directory for your Slack MCP server
mkdir slack-mcp-server && cd slack-mcp-server

# Create .env file with your token
echo "SLACK_BOT_TOKEN=xoxb-your-token-here" > .env

# Start the server (choose one method)
npx easy-slack-mcp
# OR if installed locally: npm start
```

**That's it!** The server runs on:
- 🌐 **REST API**: http://localhost:8887
- 📚 **API Docs**: http://localhost:8887/docs (Swagger UI)
- 🤖 **MCP Server**: http://localhost:8888

---

## 💻 Use in Cursor / Claude Desktop

### Option A: Use as npm package (Recommended)

**For Cursor:**
1. Open Cursor Settings → Features → Model Context Protocol
2. Click "Edit Config"
3. Add this to your MCP config:

```json
{
  "mcpServers": {
    "easy-slack-mcp": {
      "command": "npx",
      "args": ["-y", "easy-slack-mcp"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-token-here"
      }
    }
  }
}
```

**For Claude Desktop:**
1. Open `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac)
   or `%APPDATA%\Claude\claude_desktop_config.json` (Windows)
2. Add the same configuration above

**For any MCP client:**
The server runs automatically when invoked via `npx easy-slack-mcp`

### Option B: Local Installation

If you prefer a local setup:

```bash
# Install locally
npm install easy-slack-mcp

# Create .env file
echo "SLACK_BOT_TOKEN=xoxb-your-token-here" > .env

# Run it
npx easy-slack-mcp
```

Then configure your MCP client to run:
```bash
npx easy-slack-mcp
```

---

## 📡 Using the REST API

Once the server is running, you have full access to Slack via REST endpoints.

### 🔍 Interactive API Documentation

**Swagger UI** (Recommended - Visual Interface):
```
http://localhost:8887/docs
```
- Browse all endpoints
- Try requests directly in the browser
- See request/response schemas

**OpenAPI JSON**:
```
http://localhost:8887/openapi.json
```
- Import into Postman, Insomnia, or any OpenAPI-compatible tool

### 📝 Common API Examples

#### Send a Message
```bash
curl -X POST http://localhost:8887/slack/messages \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "C1234567890",
    "text": "Hello from easy-slack-mcp!"
  }'
```

#### List Channels
```bash
curl "http://localhost:8887/slack/conversations/list?types=public_channel"
```

#### Get Channel History
```bash
curl "http://localhost:8887/slack/conversations/history?channel=C1234567890&limit=20"
```

#### List Users
```bash
curl "http://localhost:8887/slack/users/list"
```

#### Upload a File
```bash
curl -X POST http://localhost:8887/slack/files/upload \
  -H "Content-Type: application/json" \
  -d '{
    "channels": "C1234567890",
    "filename": "report.txt",
    "content": "File content here"
  }'
```

---

## 📚 All Available Endpoints

### Messages
- `POST /slack/messages` - Send a message
- `POST /slack/messages/update` - Update a message
- `POST /slack/messages/delete` - Delete a message

### Conversations (Channels)
- `GET /slack/conversations/list` - List all channels
- `GET /slack/conversations/info` - Get channel details
- `POST /slack/conversations/create` - Create a channel
- `GET /slack/conversations/history` - Get message history

### Users
- `GET /slack/users/list` - List workspace users
- `GET /slack/users/info` - Get user details
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

### System
- `GET /health` - Health check
- `GET /api-info` - API information
- `GET /openapi.json` - OpenAPI specification
- `GET /docs` - Swagger UI documentation

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in your project directory:

```bash
# Required
SLACK_BOT_TOKEN=xoxb-your-token-here

# Optional
SLACK_APP_TOKEN=xapp-your-app-token      # For Socket Mode
SLACK_SIGNING_SECRET=your-signing-secret # For event verification
EASY_MCP_SERVER_PORT=8887                # REST API port (default: 8887)
EASY_MCP_SERVER_MCP_PORT=8888           # MCP server port (default: 8888)
```

### Required Slack Scopes

When creating your Slack app, add these Bot Token Scopes:

**Messages:**
- `chat:write` - Send messages
- `chat:write.public` - Send to channels bot isn't in

**Channels:**
- `channels:read` - View channel info
- `channels:history` - Read channel messages

**Users:**
- `users:read` - View users
- `users:read.email` - View email addresses

**Files:**
- `files:write` - Upload files
- `files:read` - View files

**Reactions:**
- `reactions:write` - Add reactions
- `reactions:read` - View reactions

---

## 🎯 Use Cases

### In Cursor / Claude Desktop
- **"Send a message to #general about the project update"**
- **"What's the latest activity in #support channel?"**
- **"Find user @john and show their profile"**
- **"Summarize this week's messages in #engineering"**

### Via REST API
- Build custom integrations
- Automate Slack workflows
- Create Slack bots
- Integrate with other services

### Via Swagger UI
- Explore endpoints visually
- Test API calls
- Understand request/response formats
- Share API documentation

---

## 🔧 Troubleshooting

### Server won't start
- ✅ Check that port 8887/8888 is not in use
- ✅ Verify your `SLACK_BOT_TOKEN` is correct in `.env`
- ✅ Ensure Node.js >= 16.0.0 is installed

### "not_authed" errors
- ✅ Verify token starts with `xoxb-`
- ✅ Reinstall app to workspace to refresh token
- ✅ Check token is set in environment or `.env` file

### "channel_not_found" errors
- ✅ Invite the bot to the channel: `/invite @your-bot-name`
- ✅ Verify channel ID is correct
- ✅ Check required scopes are added

### MCP not working in Cursor/Claude
- ✅ Restart Cursor/Claude after adding MCP config
- ✅ Check server is running (`curl http://localhost:8887/health`)
- ✅ Verify environment variables are set correctly
- ✅ Check Cursor/Claude logs for MCP errors

---

## 📖 Learn More

- **Easy MCP Server Framework**: 
  - [GitHub Repository](https://github.com/easynet-world/7134-easy-mcp-server)
  - [npm Package](https://www.npmjs.com/package/easy-mcp-server)
- **Full Setup Guide**: See [mcp/resources/slack-quick-start.md](mcp/resources/slack-quick-start.md)
- **Complete API Docs**: See [mcp/resources/api-documentation.md](mcp/resources/api-documentation.md)
- **Slack API**: [https://api.slack.com/methods](https://api.slack.com/methods)
- **Model Context Protocol**: [https://modelcontextprotocol.io/](https://modelcontextprotocol.io/)

---

## 📦 Package Info

- **npm**: [easy-slack-mcp](https://www.npmjs.com/package/easy-slack-mcp)
- **Repository**: [GitHub](https://github.com/easynet-world/7159-easy-slack-mcp)
- **License**: MIT

---

## 🆘 Need Help?

1. Check **Swagger UI**: http://localhost:8887/docs
2. Test authentication: `curl http://localhost:8887/slack/auth/test`
3. Check server health: `curl http://localhost:8887/health`
4. Review the [setup guide](mcp/resources/slack-quick-start.md)

---

**Ready to automate Slack with AI?** Get started:

```bash
# Install and run directly
npx easy-slack-mcp

# Or install locally for project use
npm install easy-slack-mcp
npm start
```

---

**Powered by [easy-mcp-server](https://github.com/easynet-world/7134-easy-mcp-server) framework**

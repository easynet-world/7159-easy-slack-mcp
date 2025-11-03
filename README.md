# easy-slack-mcp

<img src="images/slack.jpg" alt="Slack Logo" style="width: 100%;"/>

<h2 style="font-size: 1.5em; margin: 1em 0;">🚀 The Easiest way to run Slack MCP</h2>

**Slack integration for AI assistants** - Connect Cursor, Claude Desktop, and other MCP-compatible tools directly to Slack. Send messages, read channels, manage users, and automate workflows with AI.

[![npm version](https://img.shields.io/npm/v/easy-slack-mcp)](https://www.npmjs.com/package/easy-slack-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-success.svg)](https://modelcontextprotocol.io/)
[![Slack API](https://img.shields.io/badge/Slack-API-4A154B.svg?logo=slack&logoColor=white)](https://api.slack.com/)
[![Powered by easy-mcp-server](https://img.shields.io/badge/Powered%20by-easy--mcp--server-orange.svg)](https://github.com/easynet-world/7134-easy-mcp-server)

---

## 📦 What We Provide

| Feature | Description |
|---|---|
| **MCP Server** | Full Model Context Protocol integration for AI assistants (Cursor, Claude Desktop, etc.) |
| **REST API** | Complete Slack API wrapper with OpenAPI/Swagger documentation |
| **Message Management** | Send, update, and delete messages in channels and DMs |
| **Channel Operations** | List, create, view details, and read message history for channels |
| **User Management** | List users, get user info, and access user profiles |
| **File Operations** | Upload files, list files, and get file information |
| **Reactions** | Add and remove emoji reactions to messages |
| **Interactive Docs** | Swagger UI for exploring and testing all endpoints |
| **Zero Configuration** | Run with a single command - just provide your Slack bot token |
| **Production Ready** | Built on [easy-mcp-server](https://github.com/easynet-world/7134-easy-mcp-server) framework |

---

## 🚀 Quick Start

```bash
SLACK_BOT_TOKEN=xoxb-your-token-here npx easy-slack-mcp
```

**That's it!** The server runs on:

| Service | URL | Notes |
|---|---|---|
| REST API | `http://localhost:8887` | Base for all endpoints |
| API Docs (Swagger UI) | `http://localhost:8887/docs` | Interactive documentation |
| MCP Server | `http://localhost:8888` | For MCP-compatible clients |

---

## 📋 Detailed Configuration

### Getting Your Slack Bot Token

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps)
2. Click **"Create New App"** → **"From scratch"**
3. Give your app a name and select your workspace
4. Click **"Create App"**
5. Navigate to **"OAuth & Permissions"** in the sidebar
6. Scroll down to **"Bot Token Scopes"** and add the following scopes:
   - `chat:write` - Send messages
   - `chat:write.public` - Send to channels bot isn't in
   - `channels:read` - View channel info
   - `channels:history` - Read channel messages
   - `users:read` - View users
   - `users:read.email` - View email addresses
   - `files:write` - Upload files
   - `files:read` - View files
   - `reactions:write` - Add reactions
   - `reactions:read` - View reactions
7. Scroll to the top and click **"Install to Workspace"**
8. Authorize the app
9. Copy your **Bot User OAuth Token** (starts with `xoxb-`)

### Using Environment Variables

Instead of passing the token inline, you can use a `.env` file for persistent configuration:

```bash
# Create .env file
echo "SLACK_BOT_TOKEN=xoxb-your-token-here" > .env

# Run (it will automatically load .env)
npx easy-slack-mcp
```

### Local Installation

For a permanent local installation:

```bash
# Install locally
npm install easy-slack-mcp

# Create .env file
echo "SLACK_BOT_TOKEN=xoxb-your-token-here" > .env

# Run
npm start
# OR
npx easy-slack-mcp
```

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

#### Client configuration paths

| Client | Platform | Config Location |
|---|---|---|
| Cursor | macOS/Windows/Linux | Settings → Features → Model Context Protocol |
| Claude Desktop | macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Claude Desktop | Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

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

| Name | URL | Best for |
|---|---|---|
| Swagger UI | `http://localhost:8887/docs` | Browsing endpoints, trying requests, viewing schemas |
| OpenAPI JSON | `http://localhost:8887/openapi.json` | Import into Postman/Insomnia or tooling |

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

| Category | Method | Path | Description |
|---|---|---|---|
| Messages | POST | `/slack/messages` | Send a message |
| Messages | POST | `/slack/messages/update` | Update a message |
| Messages | POST | `/slack/messages/delete` | Delete a message |
| Conversations | GET | `/slack/conversations/list` | List all channels |
| Conversations | GET | `/slack/conversations/info` | Get channel details |
| Conversations | POST | `/slack/conversations/create` | Create a channel |
| Conversations | GET | `/slack/conversations/history` | Get message history |
| Users | GET | `/slack/users/list` | List workspace users |
| Users | GET | `/slack/users/info` | Get user details |
| Users | GET | `/slack/users/profile` | Get user profile |
| Files | POST | `/slack/files/upload` | Upload a file |
| Files | GET | `/slack/files/list` | List files |
| Files | GET | `/slack/files/info` | Get file info |
| Reactions | POST | `/slack/reactions/add` | Add a reaction |
| Reactions | POST | `/slack/reactions/remove` | Remove a reaction |
| Authentication | GET | `/slack/auth/test` | Test authentication |
| System | GET | `/health` | Health check |
| System | GET | `/api-info` | API information |
| System | GET | `/openapi.json` | OpenAPI specification |
| System | GET | `/docs` | Swagger UI documentation |

---

## ⚙️ Advanced Configuration

### Environment Variables

All configuration can be set via environment variables:

| Name | Required | Default | Description |
|---|---|---|---|
| `SLACK_BOT_TOKEN` | Yes | — | Bot User OAuth Token (starts with `xoxb-`) |
| `SLACK_APP_TOKEN` | No | — | App-level token for Socket Mode (starts with `xapp-`) |
| `SLACK_SIGNING_SECRET` | No | — | Verifies Slack request signatures for Events/API Gateway |
| `EASY_MCP_SERVER_PORT` | No | `8887` | REST API port |
| `EASY_MCP_SERVER_MCP_PORT` | No | `8888` | MCP server port |

Example `.env` content:

```bash
SLACK_BOT_TOKEN=xoxb-your-token-here
# Optional
SLACK_APP_TOKEN=xapp-your-app-token
SLACK_SIGNING_SECRET=your-signing-secret
EASY_MCP_SERVER_PORT=8887
EASY_MCP_SERVER_MCP_PORT=8888
```

### Required Slack Scopes

See the [Detailed Configuration](#-detailed-configuration) section above for setup steps. The bot typically needs these scopes:

| Scope | Purpose |
|---|---|
| `chat:write` | Send messages as the bot |
| `chat:write.public` | Post to channels the bot isn’t a member of |
| `channels:read` | View basic channel information |
| `channels:history` | Read channel messages |
| `users:read` | View users in the workspace |
| `users:read.email` | View user email addresses |
| `files:write` | Upload files |
| `files:read` | View files |
| `reactions:write` | Add reactions to messages |
| `reactions:read` | View reactions on messages |

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

| Item | Link/Value |
|---|---|
| npm | [easy-slack-mcp](https://www.npmjs.com/package/easy-slack-mcp) |
| Repository | [GitHub](https://github.com/easynet-world/7159-easy-slack-mcp) |
| License | MIT |

---

## 🆘 Need Help?

1. Check **Swagger UI**: http://localhost:8887/docs
2. Test authentication: `curl http://localhost:8887/slack/auth/test`
3. Check server health: `curl http://localhost:8887/health`
4. Review the [setup guide](mcp/resources/slack-quick-start.md)
5. For customization or support, contact `info@easynet.world`

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

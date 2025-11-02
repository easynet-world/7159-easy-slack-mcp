# Slack MCP Server - Quick Start Guide

## Setup Instructions

### 1. Create a Slack App

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Give your app a name and select your workspace
4. Click "Create App"

### 2. Configure Bot Token Scopes

Navigate to "OAuth & Permissions" and add the following Bot Token Scopes:

**Message Scopes:**
- `chat:write` - Send messages
- `chat:write.public` - Send messages to channels the bot isn't in
- `chat:write.customize` - Send messages with a customized username and avatar

**Channel Scopes:**
- `channels:read` - View basic channel info
- `channels:manage` - Manage public channels
- `channels:history` - View messages in public channels
- `groups:read` - View basic info about private channels
- `groups:write` - Manage private channels
- `groups:history` - View messages in private channels

**User Scopes:**
- `users:read` - View people in the workspace
- `users:read.email` - View email addresses

**File Scopes:**
- `files:read` - View files
- `files:write` - Upload, edit, and delete files

**Reaction Scopes:**
- `reactions:read` - View emoji reactions
- `reactions:write` - Add and remove emoji reactions

**Additional Scopes:**
- `im:read` - View basic info about direct messages
- `im:history` - View messages in direct messages
- `mpim:read` - View basic info about group direct messages
- `mpim:history` - View messages in group direct messages

### 3. Install App to Workspace

1. In "OAuth & Permissions", click "Install to Workspace"
2. Authorize the app
3. Copy the "Bot User OAuth Token" (starts with `xoxb-`)

### 4. Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Slack Bot Token to `.env`:
   ```
   SLACK_BOT_TOKEN=xoxb-your-token-here
   ```

### 5. Start the Server

```bash
npm install
npm start
```

The server will start on port 8887 (or your configured port).

## Testing Your Setup

### Test Authentication
```bash
curl http://localhost:8887/slack/auth/test
```

### Send a Test Message
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

## Common Use Cases

### 1. Send a Formatted Message
```json
POST /slack/messages
{
  "channel": "C1234567890",
  "text": "Fallback text",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Bold* and _italic_ text"
      }
    }
  ]
}
```

### 2. Reply to a Thread
```json
POST /slack/messages
{
  "channel": "C1234567890",
  "thread_ts": "1234567890.123456",
  "text": "This is a reply in a thread"
}
```

### 3. Upload a File
```json
POST /slack/files/upload
{
  "channels": "C1234567890",
  "filename": "report.txt",
  "content": "This is the file content",
  "initial_comment": "Here's the report you requested!"
}
```

### 4. Get Channel History
```bash
GET /slack/conversations/history?channel=C1234567890&limit=50
```

### 5. Add a Reaction
```json
POST /slack/reactions/add
{
  "channel": "C1234567890",
  "timestamp": "1234567890.123456",
  "name": "thumbsup"
}
```

## Finding Channel and User IDs

### Channel IDs
- Right-click on a channel in Slack → "View channel details"
- Scroll down to find the Channel ID
- Or use: `GET /slack/conversations/list`

### User IDs
- Right-click on a user → "View profile"
- Click "More" (three dots) → "Copy member ID"
- Or use: `GET /slack/users/list`

### Message Timestamps
- Hover over a message → Click "More actions" (three dots)
- Click "Copy link"
- The timestamp is the number after the last `/` in the URL (format: p1234567890123456)
- Convert by removing 'p' and adding a decimal point before the last 6 digits: 1234567890.123456

## Troubleshooting

### "not_authed" or "invalid_auth" errors
- Check that your `SLACK_BOT_TOKEN` is correctly set in `.env`
- Ensure the token starts with `xoxb-`
- Try reinstalling the app to your workspace

### "channel_not_found" errors
- Verify the channel ID is correct
- Ensure the bot is invited to the channel (use `/invite @your-bot-name` in the channel)
- Check that you have the necessary scopes

### "missing_scope" errors
- Review the required scopes in "OAuth & Permissions"
- Add any missing scopes
- Reinstall the app to your workspace for changes to take effect

## Next Steps

- Explore the full [API Documentation](api-documentation.md)
- Check out [MCP Prompts](../prompts/) for common workflows
- Read the [Slack API Documentation](https://api.slack.com/methods) for advanced features

---

**Powered by [easy-mcp-server](https://github.com/easynet-world/7134-easy-mcp-server) framework**

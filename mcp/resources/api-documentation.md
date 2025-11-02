# Slack MCP Server API Documentation

## Overview
This MCP server provides comprehensive access to Slack's Web API, allowing AI agents to interact with Slack workspaces programmatically.

## Authentication
All endpoints require a valid Slack Bot Token set in the `SLACK_BOT_TOKEN` environment variable.

---

## Message Management

### POST /slack/messages
Send a message to a Slack channel.

**Request Body:**
```json
{
  "channel": "C1234567890",
  "text": "Hello, World!",
  "blocks": [],
  "thread_ts": "1234567890.123456",
  "as_user": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ts": "1234567890.123456",
    "channel": "C1234567890",
    "message": {}
  }
}
```

### POST /slack/messages/update
Update an existing message.

**Request Body:**
```json
{
  "channel": "C1234567890",
  "ts": "1234567890.123456",
  "text": "Updated message",
  "blocks": []
}
```

### POST /slack/messages/delete
Delete a message.

**Request Body:**
```json
{
  "channel": "C1234567890",
  "ts": "1234567890.123456"
}
```

---

## Conversation Management

### GET /slack/conversations/list
List all channels in the workspace.

**Query Parameters:**
- `types` - Comma-separated channel types (public_channel, private_channel, mpim, im)
- `exclude_archived` - Exclude archived channels (boolean)
- `limit` - Max number of channels (default: 100)
- `cursor` - Pagination cursor

**Response:**
```json
{
  "success": true,
  "data": {
    "channels": [],
    "response_metadata": {}
  }
}
```

### GET /slack/conversations/info
Get information about a specific channel.

**Query Parameters:**
- `channel` - Channel ID (required)
- `include_locale` - Include locale info (boolean)
- `include_num_members` - Include member count (boolean)

### POST /slack/conversations/create
Create a new channel.

**Request Body:**
```json
{
  "name": "new-channel",
  "is_private": false,
  "team_id": "T1234567890"
}
```

### GET /slack/conversations/history
Fetch message history from a channel.

**Query Parameters:**
- `channel` - Channel ID (required)
- `limit` - Number of messages (default: 100)
- `cursor` - Pagination cursor
- `latest` - End timestamp
- `oldest` - Start timestamp
- `inclusive` - Include boundary messages (boolean)

---

## User Management

### GET /slack/users/list
List all users in the workspace.

**Query Parameters:**
- `limit` - Max number of users
- `cursor` - Pagination cursor
- `include_locale` - Include locale info (boolean)
- `team_id` - Team ID (Enterprise Grid)

### GET /slack/users/info
Get information about a specific user.

**Query Parameters:**
- `user` - User ID (required)
- `include_locale` - Include locale info (boolean)

### GET /slack/users/profile
Get a user's profile information.

**Query Parameters:**
- `user` - User ID (optional, defaults to authed user)
- `include_labels` - Include label info (boolean)

---

## File Management

### POST /slack/files/upload
Upload a file to Slack.

**Request Body:**
```json
{
  "channels": "C1234567890,C9876543210",
  "content": "File content for text files",
  "file": "base64_encoded_binary_data",
  "filename": "document.pdf",
  "filetype": "pdf",
  "initial_comment": "Here's the file!",
  "title": "Important Document",
  "thread_ts": "1234567890.123456"
}
```

### GET /slack/files/list
List files in the workspace.

**Query Parameters:**
- `channel` - Filter by channel ID
- `user` - Filter by user ID
- `count` - Number of files (default: 100)
- `page` - Page number
- `ts_from` - Filter from timestamp
- `ts_to` - Filter to timestamp
- `types` - File types filter

### GET /slack/files/info
Get information about a specific file.

**Query Parameters:**
- `file` - File ID (required)
- `count` - Items per page
- `page` - Page number

---

## Reactions

### POST /slack/reactions/add
Add a reaction emoji to a message.

**Request Body:**
```json
{
  "channel": "C1234567890",
  "timestamp": "1234567890.123456",
  "name": "thumbsup"
}
```

### POST /slack/reactions/remove
Remove a reaction from a message.

**Request Body:**
```json
{
  "channel": "C1234567890",
  "timestamp": "1234567890.123456",
  "name": "thumbsup"
}
```

---

## Authentication

### GET /slack/auth/test
Test authentication and get workspace/bot information.

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://workspace.slack.com/",
    "team": "Workspace Name",
    "user": "bot_name",
    "team_id": "T1234567890",
    "user_id": "U1234567890",
    "bot_id": "B1234567890",
    "is_enterprise_install": false
  }
}
```

---

## Error Handling

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message",
  "details": {}
}
```

Common HTTP status codes:
- `400` - Bad Request (missing required parameters)
- `500` - Internal Server Error (Slack API errors)


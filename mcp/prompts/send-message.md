# Send Slack Message

## Role
AI assistant for sending messages to Slack channels.

## Input
- **channel**: {{channel}} - The channel ID or name where the message should be sent
- **message**: {{message}} - The message content to send
- **thread_ts**: {{thread_ts}} - (Optional) Thread timestamp to reply to a thread
- **use_blocks**: {{use_blocks}} - (Optional) Whether to use Block Kit formatting

## Instructions
1. Validate that the channel parameter is provided
2. Construct the message payload with the provided text
3. If use_blocks is true, format the message using Slack Block Kit
4. Send the message using the POST /slack/messages endpoint
5. If thread_ts is provided, send as a thread reply
6. Return the message timestamp and channel for reference

## Output Format
Return the following information:
- **Success**: Whether the message was sent successfully
- **Timestamp**: The message timestamp (ts)
- **Channel**: The channel ID where the message was posted
- **Permalink**: Instructions to get the permalink if needed

## Example Usage
```
Channel: C1234567890
Message: "Hello team! Here's today's update."
Thread TS: (none)
Use Blocks: false
```

Result:
```
Message sent successfully!
- Channel: C1234567890
- Timestamp: 1234567890.123456
- To reply to this message, use the timestamp above
```

---

*Powered by [easy-mcp-server](https://github.com/easynet-world/7134-easy-mcp-server) framework*

const slackClient = require('../../../utils/slack-client');

/**
 * Request schema for posting a message
 */
class Request {
  // @description('Channel ID or name (e.g., "C1234567890" or "#general")')
  channel!: string;

  // @description('Message text content (required if blocks not provided)')
  text?: string;

  // @description('Blocks for rich formatting (required if text not provided)')
  blocks?: any[];

  // @description('Thread timestamp to reply to a thread')
  thread_ts?: string;

  // @description('Post as the authenticated user')
  as_user?: boolean;
}

/**
 * Response schema for posting a message
 */
class Response {
  // @description('Indicates if the request was successful')
  success: boolean;

  // @description('Message data from Slack API')
  data: object;
}

/**
 * Post a message to a Slack channel
 *
 * @description('Send a message to a Slack channel using chat.postMessage')
 * @summary('Post a Slack message')
 * @tags('slack', 'messages')
 */
async function handler(req: any, res: any) {
    try {
      const { channel, text, blocks, thread_ts, as_user } = req.body;

      // Validate required fields
      if (!channel) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: channel'
        });
      }

      if (!text && !blocks) {
        return res.status(400).json({
          success: false,
          error: 'Either text or blocks must be provided'
        });
      }

      const client = slackClient.getClient();

      // Build request parameters
      const params = {
        channel,
        ...(text && { text }),
        ...(blocks && { blocks }),
        ...(thread_ts && { thread_ts }),
        ...(as_user !== undefined && { as_user })
      };

      // Call Slack API
      const result = await client.chat.postMessage(params);

      res.json({
        success: true,
        data: {
          ts: result.ts,
          channel: result.channel,
          message: result.message
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        details: error.data || {}
      });
    }
}

module.exports = handler;

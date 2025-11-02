const slackClient = require('../../../../utils/slack-client');

/**
 * Request schema for updating a message
 */
class Request {
  // @description('Channel ID where the message exists')
  channel!: string;

  // @description('Timestamp of the message to update')
  ts!: string;

  // @description('New message text content (required if blocks not provided)')
  text?: string;

  // @description('New blocks for rich formatting (required if text not provided)')
  blocks?: any[];

  // @description('Update as the authenticated user')
  as_user?: boolean;
}

/**
 * Response schema for updating a message
 */
class Response {
  // @description('Indicates if the request was successful')
  success: boolean;

  // @description('Updated message data from Slack API')
  data: object;
}

/**
 * Update a Slack message
 *
 * @description('Update an existing message using chat.update')
 * @summary('Update a Slack message')
 * @tags('slack', 'messages')
 */
async function handler(req: any, res: any) {
    try {
      const { channel, ts, text, blocks, as_user } = req.body;

      // Validate required fields
      if (!channel || !ts) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: channel and ts'
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
        ts,
        ...(text && { text }),
        ...(blocks && { blocks }),
        ...(as_user !== undefined && { as_user })
      };

      // Call Slack API
      const result = await client.chat.update(params);

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

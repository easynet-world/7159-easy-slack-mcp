const slackClient = require('../../../../utils/slack-client');

/**
 * Request schema for deleting a message
 */
class Request {
  // @description('Channel ID where the message exists')
  channel!: string;

  // @description('Timestamp of the message to delete')
  ts!: string;

  // @description('Delete as the authenticated user')
  as_user?: boolean;
}

/**
 * Response schema for deleting a message
 */
class Response {
  // @description('Indicates if the request was successful')
  success: boolean;

  // @description('Deletion confirmation data')
  data: object;
}

/**
 * Delete a Slack message
 *
 * @description('Delete a message using chat.delete')
 * @summary('Delete a Slack message')
 * @tags('slack', 'messages')
 */
async function handler(req: any, res: any) {
    try {
      const { channel, ts, as_user } = req.body;

      // Validate required fields
      if (!channel || !ts) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: channel and ts'
        });
      }

      const client = slackClient.getClient();

      // Build request parameters
      const params = {
        channel,
        ts,
        ...(as_user !== undefined && { as_user })
      };

      // Call Slack API
      const result = await client.chat.delete(params);

      res.json({
        success: true,
        data: {
          channel: result.channel,
          ts: result.ts
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

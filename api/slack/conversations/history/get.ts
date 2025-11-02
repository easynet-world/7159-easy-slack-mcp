const slackClient = require('../../../../utils/slack-client');

/**
 * Request schema for getting conversation history (query parameters)
 */
class Request {
  // @description('Channel ID to fetch history from')
  channel!: string;

  // @description('Number of messages to return (default: 100, max: 1000)')
  limit?: number;

  // @description('Pagination cursor')
  cursor?: string;

  // @description('End of time range (timestamp)')
  latest?: string;

  // @description('Start of time range (timestamp)')
  oldest?: string;

  // @description('Include messages with latest or oldest timestamp')
  inclusive?: boolean;
}

/**
 * Response schema for getting conversation history
 */
class Response {
  // @description('Indicates if the request was successful')
  success: boolean;

  // @description('Message history data')
  data: object;
}

/**
 * Get conversation history
 *
 * @description('Fetch messages from a channel using conversations.history')
 * @summary('Get conversation history')
 * @tags('slack', 'conversations')
 */
async function handler(req: any, res: any) {
    try {
      const { channel, limit, cursor, latest, oldest, inclusive } = req.query;

      // Validate required fields
      if (!channel) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameter: channel'
        });
      }

      const client = slackClient.getClient();

      // Build request parameters
      const params = {
        channel,
        ...(limit && { limit: parseInt(limit) }),
        ...(cursor && { cursor }),
        ...(latest && { latest }),
        ...(oldest && { oldest }),
        ...(inclusive !== undefined && { inclusive: inclusive === 'true' })
      };

      // Call Slack API
      const result = await client.conversations.history(params);

      res.json({
        success: true,
        data: {
          messages: result.messages,
          has_more: result.has_more,
          response_metadata: result.response_metadata
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

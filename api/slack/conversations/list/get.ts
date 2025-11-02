const slackClient = require('../../../../utils/slack-client');

/**
 * Request schema for listing conversations (query parameters)
 */
class Request {
  // @description('Comma-separated list of channel types (public_channel, private_channel, mpim, im)')
  types?: string;

  // @description('Exclude archived channels (default: false)')
  exclude_archived?: boolean;

  // @description('Maximum number of channels to return (default: 100, max: 1000)')
  limit?: number;

  // @description('Pagination cursor')
  cursor?: string;
}

/**
 * Response schema for listing conversations
 */
class Response {
  // @description('Indicates if the request was successful')
  success: boolean;

  // @description('Conversation list data')
  data: object;
}

/**
 * List Slack conversations/channels
 *
 * @description('List all channels in the workspace using conversations.list')
 * @summary('List conversations')
 * @tags('slack', 'conversations')
 */
async function handler(req: any, res: any) {
    try {
      const { types, exclude_archived, limit, cursor } = req.query;

      const client = slackClient.getClient();

      // Build request parameters
      const params = {
        ...(types && { types }),
        ...(exclude_archived !== undefined && { exclude_archived: exclude_archived === 'true' }),
        ...(limit && { limit: parseInt(limit) }),
        ...(cursor && { cursor })
      };

      // Call Slack API
      const result = await client.conversations.list(params);

      res.json({
        success: true,
        data: {
          channels: result.channels,
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

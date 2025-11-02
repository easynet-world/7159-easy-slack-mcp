const BaseAPI = require('easy-mcp-server/base-api');
const slackClient = require('../../../../utils/slack-client');

/**
 * Get conversation history
 *
 * @api {get} /slack/conversations/history Get conversation history
 * @apiName GetConversationHistory
 * @apiGroup Slack Conversations
 * @apiDescription Fetch messages from a channel using conversations.history
 *
 * @apiQuery {String} channel Channel ID to fetch history from
 * @apiQuery {Number} [limit] Number of messages to return (default: 100, max: 1000)
 * @apiQuery {String} [cursor] Pagination cursor
 * @apiQuery {String} [latest] End of time range (timestamp)
 * @apiQuery {String} [oldest] Start of time range (timestamp)
 * @apiQuery {Boolean} [inclusive] Include messages with latest or oldest timestamp
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object} data Message history data
 */
class GetConversationHistory extends BaseAPI {
  async process(req, res) {
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
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        details: error.data || {}
      });
    }
  }
}

module.exports = GetConversationHistory;

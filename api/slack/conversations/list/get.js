const BaseAPI = require('easy-mcp-server/base-api');
const slackClient = require('../../../../utils/slack-client');

/**
 * List Slack conversations/channels
 *
 * @api {get} /slack/conversations/list List conversations
 * @apiName ListConversations
 * @apiGroup Slack Conversations
 * @apiDescription List all channels in the workspace using conversations.list
 *
 * @apiQuery {String} [types] Comma-separated list of channel types (public_channel, private_channel, mpim, im)
 * @apiQuery {Boolean} [exclude_archived] Exclude archived channels (default: false)
 * @apiQuery {Number} [limit] Maximum number of channels to return (default: 100, max: 1000)
 * @apiQuery {String} [cursor] Pagination cursor
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object} data Conversation list data
 * @apiSuccess {Array} data.channels Array of channel objects
 */
class ListConversations extends BaseAPI {
  async process(req, res) {
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
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        details: error.data || {}
      });
    }
  }
}

module.exports = ListConversations;

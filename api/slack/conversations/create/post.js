const BaseAPI = require('easy-mcp-server/base-api');
const slackClient = require('../../../../utils/slack-client');

/**
 * Create a new Slack conversation/channel
 *
 * @api {post} /slack/conversations/create Create a conversation
 * @apiName CreateConversation
 * @apiGroup Slack Conversations
 * @apiDescription Create a new channel using conversations.create
 *
 * @apiBody {String} name Name of the channel to create
 * @apiBody {Boolean} [is_private] Create a private channel (default: false)
 * @apiBody {String} [team_id] Optional: Team ID (for Enterprise Grid)
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object} data Created channel information
 */
class CreateConversation extends BaseAPI {
  async process(req, res) {
    try {
      const { name, is_private, team_id } = req.body;

      // Validate required fields
      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: name'
        });
      }

      const client = slackClient.getClient();

      // Build request parameters
      const params = {
        name,
        ...(is_private !== undefined && { is_private }),
        ...(team_id && { team_id })
      };

      // Call Slack API
      const result = await client.conversations.create(params);

      res.json({
        success: true,
        data: {
          channel: result.channel
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

module.exports = CreateConversation;

const BaseAPI = require('easy-mcp-server/base-api');
const slackClient = require('../../../../utils/slack-client');

/**
 * Add a reaction to a message
 *
 * @api {post} /slack/reactions/add Add reaction
 * @apiName AddReaction
 * @apiGroup Slack Reactions
 * @apiDescription Add a reaction emoji to a message using reactions.add
 *
 * @apiBody {String} channel Channel ID where the message exists
 * @apiBody {String} timestamp Timestamp of the message
 * @apiBody {String} name Reaction emoji name (without :: colons)
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful
 */
class AddReaction extends BaseAPI {
  async process(req, res) {
    try {
      const { channel, timestamp, name } = req.body;

      // Validate required fields
      if (!channel || !timestamp || !name) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: channel, timestamp, and name'
        });
      }

      const client = slackClient.getClient();

      // Call Slack API
      await client.reactions.add({
        channel,
        timestamp,
        name
      });

      res.json({
        success: true,
        data: {
          message: 'Reaction added successfully'
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

module.exports = AddReaction;

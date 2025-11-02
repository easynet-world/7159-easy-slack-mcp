const BaseAPI = require('easy-mcp-server/base-api');
const slackClient = require('../../../../utils/slack-client');

/**
 * Update a Slack message
 *
 * @api {post} /slack/messages/update Update a message
 * @apiName UpdateMessage
 * @apiGroup Slack Messages
 * @apiDescription Update an existing message using chat.update
 *
 * @apiBody {String} channel Channel ID where the message exists
 * @apiBody {String} ts Timestamp of the message to update
 * @apiBody {String} text New message text content
 * @apiBody {Object} [blocks] Optional new blocks for rich formatting
 * @apiBody {Boolean} [as_user] Optional: Update as the authenticated user
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object} data Updated message data from Slack API
 */
class UpdateMessage extends BaseAPI {
  async process(req, res) {
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
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        details: error.data || {}
      });
    }
  }
}

module.exports = UpdateMessage;

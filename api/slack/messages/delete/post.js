const BaseAPI = require('easy-mcp-server/base-api');
const slackClient = require('../../../../utils/slack-client');

/**
 * Delete a Slack message
 *
 * @api {post} /slack/messages/delete Delete a message
 * @apiName DeleteMessage
 * @apiGroup Slack Messages
 * @apiDescription Delete a message using chat.delete
 *
 * @apiBody {String} channel Channel ID where the message exists
 * @apiBody {String} ts Timestamp of the message to delete
 * @apiBody {Boolean} [as_user] Optional: Delete as the authenticated user
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object} data Deletion confirmation data
 */
class DeleteMessage extends BaseAPI {
  async process(req, res) {
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
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        details: error.data || {}
      });
    }
  }
}

module.exports = DeleteMessage;

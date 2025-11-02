const BaseAPI = require('easy-mcp-server/base-api');
const slackClient = require('../../../utils/slack-client');

/**
 * Post a message to a Slack channel
 *
 * @api {post} /slack/messages Post a message
 * @apiName PostMessage
 * @apiGroup Slack Messages
 * @apiDescription Send a message to a Slack channel using chat.postMessage
 *
 * @apiBody {String} channel Channel ID or name (e.g., "C1234567890" or "#general")
 * @apiBody {String} text Message text content
 * @apiBody {Object} [blocks] Optional blocks for rich formatting
 * @apiBody {String} [thread_ts] Optional thread timestamp to reply to a thread
 * @apiBody {Boolean} [as_user] Optional: Post as the authenticated user
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object} data Message data from Slack API
 * @apiSuccess {String} data.ts Timestamp of the message
 * @apiSuccess {String} data.channel Channel ID where message was posted
 */
class PostMessage extends BaseAPI {
  async process(req, res) {
    try {
      const { channel, text, blocks, thread_ts, as_user } = req.body;

      // Validate required fields
      if (!channel) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: channel'
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
        ...(text && { text }),
        ...(blocks && { blocks }),
        ...(thread_ts && { thread_ts }),
        ...(as_user !== undefined && { as_user })
      };

      // Call Slack API
      const result = await client.chat.postMessage(params);

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

module.exports = PostMessage;

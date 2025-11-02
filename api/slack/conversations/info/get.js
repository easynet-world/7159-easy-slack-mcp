const BaseAPI = require('easy-mcp-server/base-api');
const slackClient = require('../../../../utils/slack-client');

/**
 * Get information about a Slack conversation/channel
 *
 * @api {get} /slack/conversations/info Get conversation info
 * @apiName GetConversationInfo
 * @apiGroup Slack Conversations
 * @apiDescription Get information about a channel using conversations.info
 *
 * @apiQuery {String} channel Channel ID to get information about
 * @apiQuery {Boolean} [include_locale] Include locale information
 * @apiQuery {Boolean} [include_num_members] Include member count
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object} data Channel information
 */
class GetConversationInfo extends BaseAPI {
  async process(req, res) {
    try {
      const { channel, include_locale, include_num_members } = req.query;

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
        ...(include_locale !== undefined && { include_locale: include_locale === 'true' }),
        ...(include_num_members !== undefined && { include_num_members: include_num_members === 'true' })
      };

      // Call Slack API
      const result = await client.conversations.info(params);

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

module.exports = GetConversationInfo;

const BaseAPI = require('easy-mcp-server/base-api');
const slackClient = require('../../../../utils/slack-client');

/**
 * Get information about a Slack user
 *
 * @api {get} /slack/users/info Get user info
 * @apiName GetUserInfo
 * @apiGroup Slack Users
 * @apiDescription Get information about a user using users.info
 *
 * @apiQuery {String} user User ID to get information about
 * @apiQuery {Boolean} [include_locale] Include locale information
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object} data User information
 */
class GetUserInfo extends BaseAPI {
  async process(req, res) {
    try {
      const { user, include_locale } = req.query;

      // Validate required fields
      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameter: user'
        });
      }

      const client = slackClient.getClient();

      // Build request parameters
      const params = {
        user,
        ...(include_locale !== undefined && { include_locale: include_locale === 'true' })
      };

      // Call Slack API
      const result = await client.users.info(params);

      res.json({
        success: true,
        data: {
          user: result.user
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

module.exports = GetUserInfo;

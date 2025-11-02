const BaseAPI = require('easy-mcp-server/base-api');
const slackClient = require('../../../../utils/slack-client');

/**
 * Get a user's profile
 *
 * @api {get} /slack/users/profile Get user profile
 * @apiName GetUserProfile
 * @apiGroup Slack Users
 * @apiDescription Get a user's profile using users.profile.get
 *
 * @apiQuery {String} [user] User ID (if not provided, returns authed user's profile)
 * @apiQuery {Boolean} [include_labels] Include label information
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object} data User profile information
 */
class GetUserProfile extends BaseAPI {
  async process(req, res) {
    try {
      const { user, include_labels } = req.query;

      const client = slackClient.getClient();

      // Build request parameters
      const params = {
        ...(user && { user }),
        ...(include_labels !== undefined && { include_labels: include_labels === 'true' })
      };

      // Call Slack API
      const result = await client.users.profile.get(params);

      res.json({
        success: true,
        data: {
          profile: result.profile
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

module.exports = GetUserProfile;

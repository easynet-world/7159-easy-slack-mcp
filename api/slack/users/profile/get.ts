const slackClient = require('../../../../utils/slack-client');

/**
 * Request schema for getting user profile (query parameters)
 */
class Request {
  // @description('User ID (if not provided, returns authed user profile)')
  user?: string;

  // @description('Include label information')
  include_labels?: boolean;
}

/**
 * Response schema for getting user profile
 */
class Response {
  // @description('Indicates if the request was successful')
  success: boolean;

  // @description('User profile information')
  data: object;
}

/**
 * Get a user's profile
 *
 * @description('Get a user profile using users.profile.get')
 * @summary('Get user profile')
 * @tags('slack', 'users')
 */
async function handler(req: any, res: any) {
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.data || {}
    });
  }
}

module.exports = handler;

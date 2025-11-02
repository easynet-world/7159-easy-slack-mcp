const slackClient = require('../../../../utils/slack-client');

/**
 * Request schema for listing users (query parameters)
 */
class Request {
  // @description('Maximum number of users to return (default: 0 for all)')
  limit?: number;

  // @description('Pagination cursor')
  cursor?: string;

  // @description('Include locale information')
  include_locale?: boolean;

  // @description('Team ID (for Enterprise Grid)')
  team_id?: string;
}

/**
 * Response schema for listing users
 */
class Response {
  // @description('Indicates if the request was successful')
  success: boolean;

  // @description('User list data')
  data: object;
}

/**
 * List Slack users
 *
 * @description('List all users in the workspace using users.list')
 * @summary('List users')
 * @tags('slack', 'users')
 */
async function handler(req: any, res: any) {
    try {
      const { limit, cursor, include_locale, team_id } = req.query;

      const client = slackClient.getClient();

      // Build request parameters
      const params = {
        ...(limit && { limit: parseInt(limit) }),
        ...(cursor && { cursor }),
        ...(include_locale !== undefined && { include_locale: include_locale === 'true' }),
        ...(team_id && { team_id })
      };

      // Call Slack API
      const result = await client.users.list(params);

      res.json({
        success: true,
        data: {
          members: result.members,
          cache_ts: result.cache_ts,
          response_metadata: result.response_metadata
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

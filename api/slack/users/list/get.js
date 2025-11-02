const BaseAPI = require('easy-mcp-server/base-api');
const slackClient = require('../../../../utils/slack-client');

/**
 * List Slack users
 *
 * @api {get} /slack/users/list List users
 * @apiName ListUsers
 * @apiGroup Slack Users
 * @apiDescription List all users in the workspace using users.list
 *
 * @apiQuery {Number} [limit] Maximum number of users to return (default: 0 for all)
 * @apiQuery {String} [cursor] Pagination cursor
 * @apiQuery {Boolean} [include_locale] Include locale information
 * @apiQuery {String} [team_id] Optional: Team ID (for Enterprise Grid)
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object} data User list data
 * @apiSuccess {Array} data.members Array of user objects
 */
class ListUsers extends BaseAPI {
  async process(req, res) {
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
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        details: error.data || {}
      });
    }
  }
}

module.exports = ListUsers;

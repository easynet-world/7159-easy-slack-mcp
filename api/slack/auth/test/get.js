const BaseAPI = require('easy-mcp-server/base-api');
const slackClient = require('../../../../utils/slack-client');

/**
 * Test authentication and get bot info
 *
 * @api {get} /slack/auth/test Test authentication
 * @apiName TestAuth
 * @apiGroup Slack Auth
 * @apiDescription Test authentication and get workspace/bot info using auth.test
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object} data Authentication information
 */
class TestAuth extends BaseAPI {
  async process(req, res) {
    try {
      const client = slackClient.getClient();

      // Call Slack API
      const result = await client.auth.test();

      res.json({
        success: true,
        data: {
          url: result.url,
          team: result.team,
          user: result.user,
          team_id: result.team_id,
          user_id: result.user_id,
          bot_id: result.bot_id,
          is_enterprise_install: result.is_enterprise_install
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

module.exports = TestAuth;

const slackClient = require('../../../../utils/slack-client');
/**
 * Request schema for testing authentication (GET request has no body, uses query params)
 */
class Request {
}
/**
 * Response schema for testing authentication
 */
class Response {
}
/**
 * Test authentication and get bot info
 *
 * @description('Test authentication and get workspace/bot info using auth.test')
 * @summary('Test Slack authentication')
 * @tags('slack', 'auth')
 */
async function handler(req, res) {
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            details: error.data || {}
        });
    }
}
module.exports = handler;

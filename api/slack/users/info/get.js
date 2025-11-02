const slackClient = require('../../../../utils/slack-client');
/**
 * Request schema for getting user info (query parameters)
 */
class Request {
}
/**
 * Response schema for getting user info
 */
class Response {
}
/**
 * Get information about a Slack user
 *
 * @description('Get information about a user using users.info')
 * @summary('Get user info')
 * @tags('slack', 'users')
 */
async function handler(req, res) {
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

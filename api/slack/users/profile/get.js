const slackClient = require('../../../../utils/slack-client');
/**
 * Request schema for getting user profile (query parameters)
 */
class Request {
}
/**
 * Response schema for getting user profile
 */
class Response {
}
/**
 * Get a user's profile
 *
 * @description('Get a user profile using users.profile.get')
 * @summary('Get user profile')
 * @tags('slack', 'users')
 */
async function handler(req, res) {
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

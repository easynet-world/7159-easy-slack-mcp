const slackClient = require('../../../../utils/slack-client');
/**
 * Request schema for getting conversation history (query parameters)
 */
class Request {
}
/**
 * Response schema for getting conversation history
 */
class Response {
}
/**
 * Get conversation history
 *
 * @description('Fetch messages from a channel using conversations.history')
 * @summary('Get conversation history')
 * @tags('slack', 'conversations')
 */
async function handler(req, res) {
    try {
        const { channel, limit, cursor, latest, oldest, inclusive } = req.query;
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
            ...(limit && { limit: parseInt(limit) }),
            ...(cursor && { cursor }),
            ...(latest && { latest }),
            ...(oldest && { oldest }),
            ...(inclusive !== undefined && { inclusive: inclusive === 'true' })
        };
        // Call Slack API
        const result = await client.conversations.history(params);
        res.json({
            success: true,
            data: {
                messages: result.messages,
                has_more: result.has_more,
                response_metadata: result.response_metadata
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

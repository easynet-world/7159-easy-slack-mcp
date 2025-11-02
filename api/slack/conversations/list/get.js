const slackClient = require('../../../../utils/slack-client');
/**
 * Request schema for listing conversations (query parameters)
 */
class Request {
}
/**
 * Response schema for listing conversations
 */
class Response {
}
/**
 * List Slack conversations/channels
 *
 * @description('List all channels in the workspace using conversations.list')
 * @summary('List conversations')
 * @tags('slack', 'conversations')
 */
async function handler(req, res) {
    try {
        const { types, exclude_archived, limit, cursor } = req.query;
        const client = slackClient.getClient();
        // Build request parameters
        const params = {
            ...(types && { types }),
            ...(exclude_archived !== undefined && { exclude_archived: exclude_archived === 'true' }),
            ...(limit && { limit: parseInt(limit) }),
            ...(cursor && { cursor })
        };
        // Call Slack API
        const result = await client.conversations.list(params);
        res.json({
            success: true,
            data: {
                channels: result.channels,
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

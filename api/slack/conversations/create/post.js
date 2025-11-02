const slackClient = require('../../../../utils/slack-client');
/**
 * Request schema for creating a conversation
 */
class Request {
}
/**
 * Response schema for creating a conversation
 */
class Response {
}
/**
 * Create a new Slack conversation/channel
 *
 * @description('Create a new channel using conversations.create')
 * @summary('Create a Slack conversation')
 * @tags('slack', 'conversations')
 */
async function handler(req, res) {
    try {
        const { name, is_private, team_id } = req.body;
        // Validate required fields
        if (!name) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: name'
            });
        }
        const client = slackClient.getClient();
        // Build request parameters
        const params = {
            name,
            ...(is_private !== undefined && { is_private }),
            ...(team_id && { team_id })
        };
        // Call Slack API
        const result = await client.conversations.create(params);
        res.json({
            success: true,
            data: {
                channel: result.channel
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

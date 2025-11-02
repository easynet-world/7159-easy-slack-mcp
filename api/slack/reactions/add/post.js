const slackClient = require('../../../../utils/slack-client');
/**
 * Request schema for adding a reaction
 */
class Request {
}
/**
 * Response schema for adding a reaction
 */
class Response {
}
/**
 * Add a reaction to a message
 *
 * @description('Add a reaction emoji to a message using reactions.add')
 * @summary('Add a reaction')
 * @tags('slack', 'reactions')
 */
async function handler(req, res) {
    try {
        const { channel, timestamp, name } = req.body;
        // Validate required fields
        if (!channel || !timestamp || !name) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: channel, timestamp, and name'
            });
        }
        const client = slackClient.getClient();
        // Call Slack API
        await client.reactions.add({
            channel,
            timestamp,
            name
        });
        res.json({
            success: true,
            data: {
                message: 'Reaction added successfully'
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

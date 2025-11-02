const slackClient = require('../../../../utils/slack-client');
/**
 * Request schema for removing a reaction
 */
class Request {
}
/**
 * Response schema for removing a reaction
 */
class Response {
}
/**
 * Remove a reaction from a message
 *
 * @description('Remove a reaction emoji from a message using reactions.remove')
 * @summary('Remove a reaction')
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
        await client.reactions.remove({
            channel,
            timestamp,
            name
        });
        res.json({
            success: true,
            data: {
                message: 'Reaction removed successfully'
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

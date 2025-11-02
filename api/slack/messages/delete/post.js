const slackClient = require('../../../../utils/slack-client');
/**
 * Request schema for deleting a message
 */
class Request {
}
/**
 * Response schema for deleting a message
 */
class Response {
}
/**
 * Delete a Slack message
 *
 * @description('Delete a message using chat.delete')
 * @summary('Delete a Slack message')
 * @tags('slack', 'messages')
 */
async function handler(req, res) {
    try {
        const { channel, ts, as_user } = req.body;
        // Validate required fields
        if (!channel || !ts) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: channel and ts'
            });
        }
        const client = slackClient.getClient();
        // Build request parameters
        const params = {
            channel,
            ts,
            ...(as_user !== undefined && { as_user })
        };
        // Call Slack API
        const result = await client.chat.delete(params);
        res.json({
            success: true,
            data: {
                channel: result.channel,
                ts: result.ts
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

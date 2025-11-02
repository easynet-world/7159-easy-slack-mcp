const slackClient = require('../../../../utils/slack-client');
/**
 * Request schema for listing files (query parameters)
 */
class Request {
}
/**
 * Response schema for listing files
 */
class Response {
}
/**
 * List files in Slack
 *
 * @description('List files using files.list')
 * @summary('List files')
 * @tags('slack', 'files')
 */
async function handler(req, res) {
    try {
        const { channel, user, count, page, ts_from, ts_to, types } = req.query;
        const client = slackClient.getClient();
        // Build request parameters
        const params = {
            ...(channel && { channel }),
            ...(user && { user }),
            ...(count && { count: parseInt(count) }),
            ...(page && { page: parseInt(page) }),
            ...(ts_from && { ts_from }),
            ...(ts_to && { ts_to }),
            ...(types && { types })
        };
        // Call Slack API
        const result = await client.files.list(params);
        res.json({
            success: true,
            data: {
                files: result.files,
                paging: result.paging
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

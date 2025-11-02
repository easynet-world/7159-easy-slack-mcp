const slackClient = require('../../../../utils/slack-client');
/**
 * Request schema for getting file info (query parameters)
 */
class Request {
}
/**
 * Response schema for getting file info
 */
class Response {
}
/**
 * Get information about a file
 *
 * @description('Get information about a file using files.info')
 * @summary('Get file info')
 * @tags('slack', 'files')
 */
async function handler(req, res) {
    try {
        const { file, count, page } = req.query;
        // Validate required fields
        if (!file) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameter: file'
            });
        }
        const client = slackClient.getClient();
        // Build request parameters
        const params = {
            file,
            ...(count && { count: parseInt(count) }),
            ...(page && { page: parseInt(page) })
        };
        // Call Slack API
        const result = await client.files.info(params);
        res.json({
            success: true,
            data: {
                file: result.file,
                comments: result.comments,
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

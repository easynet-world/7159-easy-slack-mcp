const slackClient = require('../../../../utils/slack-client');
/**
 * Request schema for uploading a file
 */
class Request {
}
/**
 * Response schema for uploading a file
 */
class Response {
}
/**
 * Upload a file to Slack
 *
 * @description('Upload or create a file using files.upload')
 * @summary('Upload a file to Slack')
 * @tags('slack', 'files')
 */
async function handler(req, res) {
    try {
        const { channels, content, file, filename, filetype, initial_comment, title, thread_ts } = req.body;
        // Validate that either content or file is provided
        if (!content && !file) {
            return res.status(400).json({
                success: false,
                error: 'Either content or file must be provided'
            });
        }
        const client = slackClient.getClient();
        // Build request parameters
        const params = {
            ...(channels && { channels }),
            ...(content && { content }),
            ...(file && { file: Buffer.from(file, 'base64') }),
            ...(filename && { filename }),
            ...(filetype && { filetype }),
            ...(initial_comment && { initial_comment }),
            ...(title && { title }),
            ...(thread_ts && { thread_ts })
        };
        // Call Slack API
        const result = await client.files.upload(params);
        res.json({
            success: true,
            data: {
                file: result.file
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

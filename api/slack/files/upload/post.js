const BaseAPI = require('easy-mcp-server/base-api');
const slackClient = require('../../../../utils/slack-client');

/**
 * Upload a file to Slack
 *
 * @api {post} /slack/files/upload Upload a file
 * @apiName UploadFile
 * @apiGroup Slack Files
 * @apiDescription Upload or create a file using files.upload
 *
 * @apiBody {String} [channels] Comma-separated list of channel IDs to share the file in
 * @apiBody {String} [content] File content (for text files)
 * @apiBody {String} [file] File binary data (base64 encoded)
 * @apiBody {String} [filename] Filename of the file
 * @apiBody {String} [filetype] File type identifier
 * @apiBody {String} [initial_comment] Initial comment to add
 * @apiBody {String} [title] Title of the file
 * @apiBody {String} [thread_ts] Thread timestamp to share in a thread
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object} data Uploaded file information
 */
class UploadFile extends BaseAPI {
  async process(req, res) {
    try {
      const {
        channels,
        content,
        file,
        filename,
        filetype,
        initial_comment,
        title,
        thread_ts
      } = req.body;

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
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        details: error.data || {}
      });
    }
  }
}

module.exports = UploadFile;

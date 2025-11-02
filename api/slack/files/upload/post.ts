const slackClient = require('../../../../utils/slack-client');

/**
 * Request schema for uploading a file
 */
class Request {
  // @description('Comma-separated list of channel IDs to share the file in')
  channels?: string;

  // @description('File content for text files (required if file not provided)')
  content?: string;

  // @description('File binary data base64 encoded (required if content not provided)')
  file?: string;

  // @description('Filename of the file')
  filename?: string;

  // @description('File type identifier')
  filetype?: string;

  // @description('Initial comment to add')
  initial_comment?: string;

  // @description('Title of the file')
  title?: string;

  // @description('Thread timestamp to share in a thread')
  thread_ts?: string;
}

/**
 * Response schema for uploading a file
 */
class Response {
  // @description('Indicates if the request was successful')
  success: boolean;

  // @description('Uploaded file information')
  data: object;
}

/**
 * Upload a file to Slack
 *
 * @description('Upload or create a file using files.upload')
 * @summary('Upload a file to Slack')
 * @tags('slack', 'files')
 */
async function handler(req: any, res: any) {
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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        details: error.data || {}
      });
    }
}

module.exports = handler;

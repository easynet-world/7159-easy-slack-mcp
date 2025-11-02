const BaseAPI = require('easy-mcp-server/base-api');
const slackClient = require('../../../../utils/slack-client');

/**
 * Get information about a file
 *
 * @api {get} /slack/files/info Get file info
 * @apiName GetFileInfo
 * @apiGroup Slack Files
 * @apiDescription Get information about a file using files.info
 *
 * @apiQuery {String} file File ID to get information about
 * @apiQuery {Number} [count] Number of items to return per page
 * @apiQuery {Number} [page] Page number of results
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object} data File information
 */
class GetFileInfo extends BaseAPI {
  async process(req, res) {
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
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        details: error.data || {}
      });
    }
  }
}

module.exports = GetFileInfo;

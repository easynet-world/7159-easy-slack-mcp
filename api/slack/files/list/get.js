const BaseAPI = require('easy-mcp-server/base-api');
const slackClient = require('../../../../utils/slack-client');

/**
 * List files in Slack
 *
 * @api {get} /slack/files/list List files
 * @apiName ListFiles
 * @apiGroup Slack Files
 * @apiDescription List files using files.list
 *
 * @apiQuery {String} [channel] Filter by channel ID
 * @apiQuery {String} [user] Filter by user ID
 * @apiQuery {Number} [count] Number of items to return (default: 100, max: 1000)
 * @apiQuery {Number} [page] Page number of results
 * @apiQuery {String} [ts_from] Filter files created after this timestamp
 * @apiQuery {String} [ts_to] Filter files created before this timestamp
 * @apiQuery {String} [types] Filter by file types (all, spaces, snippets, images, etc.)
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful
 * @apiSuccess {Object} data File list data
 */
class ListFiles extends BaseAPI {
  async process(req, res) {
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
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        details: error.data || {}
      });
    }
  }
}

module.exports = ListFiles;

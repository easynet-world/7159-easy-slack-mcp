const slackClient = require('../../../../utils/slack-client');

/**
 * Request schema for listing files (query parameters)
 */
class Request {
  // @description('Filter by channel ID')
  channel?: string;

  // @description('Filter by user ID')
  user?: string;

  // @description('Number of items to return (default: 100, max: 1000)')
  count?: number;

  // @description('Page number of results')
  page?: number;

  // @description('Filter files created after this timestamp')
  ts_from?: string;

  // @description('Filter files created before this timestamp')
  ts_to?: string;

  // @description('Filter by file types (all, spaces, snippets, images, etc.)')
  types?: string;
}

/**
 * Response schema for listing files
 */
class Response {
  // @description('Indicates if the request was successful')
  success: boolean;

  // @description('File list data')
  data: object;
}

/**
 * List files in Slack
 *
 * @description('List files using files.list')
 * @summary('List files')
 * @tags('slack', 'files')
 */
async function handler(req: any, res: any) {
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.data || {}
    });
  }
}

module.exports = handler;

const slackClient = require('../../../../utils/slack-client');

/**
 * Request schema for getting conversation info (query parameters)
 */
class Request {
  // @description('Channel ID to get information about')
  channel!: string;

  // @description('Include locale information')
  include_locale?: boolean;

  // @description('Include member count')
  include_num_members?: boolean;
}

/**
 * Response schema for getting conversation info
 */
class Response {
  // @description('Indicates if the request was successful')
  success: boolean;

  // @description('Channel information')
  data: object;
}

/**
 * Get information about a Slack conversation/channel
 *
 * @description('Get information about a channel using conversations.info')
 * @summary('Get conversation info')
 * @tags('slack', 'conversations')
 */
async function handler(req: any, res: any) {
    try {
      const { channel, include_locale, include_num_members } = req.query;

      // Validate required fields
      if (!channel) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameter: channel'
        });
      }

      const client = slackClient.getClient();

      // Build request parameters
      const params = {
        channel,
        ...(include_locale !== undefined && { include_locale: include_locale === 'true' }),
        ...(include_num_members !== undefined && { include_num_members: include_num_members === 'true' })
      };

      // Call Slack API
      const result = await client.conversations.info(params);

      res.json({
        success: true,
        data: {
          channel: result.channel
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

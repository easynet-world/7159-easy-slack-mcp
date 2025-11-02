const slackClient = require('../../../../utils/slack-client');

/**
 * Request schema for creating a conversation
 */
class Request {
  // @description('Name of the channel to create')
  name!: string;

  // @description('Create a private channel (default: false)')
  is_private?: boolean;

  // @description('Team ID (for Enterprise Grid)')
  team_id?: string;
}

/**
 * Response schema for creating a conversation
 */
class Response {
  // @description('Indicates if the request was successful')
  success: boolean;

  // @description('Created channel information')
  data: object;
}

/**
 * Create a new Slack conversation/channel
 *
 * @description('Create a new channel using conversations.create')
 * @summary('Create a Slack conversation')
 * @tags('slack', 'conversations')
 */
async function handler(req: any, res: any) {
    try {
      const { name, is_private, team_id } = req.body;

      // Validate required fields
      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: name'
        });
      }

      const client = slackClient.getClient();

      // Build request parameters
      const params = {
        name,
        ...(is_private !== undefined && { is_private }),
        ...(team_id && { team_id })
      };

      // Call Slack API
      const result = await client.conversations.create(params);

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

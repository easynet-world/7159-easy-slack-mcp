const slackClient = require('../../../../utils/slack-client');

/**
 * Request schema for adding a reaction
 */
class Request {
  // @description('Channel ID where the message exists')
  channel!: string;

  // @description('Timestamp of the message')
  timestamp!: string;

  // @description('Reaction emoji name (without colons)')
  name!: string;
}

/**
 * Response schema for adding a reaction
 */
class Response {
  // @description('Indicates if the request was successful')
  success: boolean;

  // @description('Reaction confirmation data')
  data: object;
}

/**
 * Add a reaction to a message
 *
 * @description('Add a reaction emoji to a message using reactions.add')
 * @summary('Add a reaction')
 * @tags('slack', 'reactions')
 */
async function handler(req: any, res: any) {
    try {
      const { channel, timestamp, name } = req.body;

      // Validate required fields
      if (!channel || !timestamp || !name) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: channel, timestamp, and name'
        });
      }

      const client = slackClient.getClient();

      // Call Slack API
      await client.reactions.add({
        channel,
        timestamp,
        name
      });

      res.json({
        success: true,
        data: {
          message: 'Reaction added successfully'
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

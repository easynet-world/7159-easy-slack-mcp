const { WebClient } = require('@slack/web-api');
require('dotenv').config();

/**
 * Slack Web API Client Singleton
 * Provides a shared instance of the Slack WebClient
 */
class SlackClientManager {
  constructor() {
    this.client = null;
  }

  /**
   * Get or create the Slack client instance
   * @returns {WebClient} Slack WebClient instance
   */
  getClient() {
    if (!this.client) {
      const token = process.env.SLACK_BOT_TOKEN;

      if (!token) {
        throw new Error('SLACK_BOT_TOKEN environment variable is not set. Please configure your .env file.');
      }

      this.client = new WebClient(token);
    }

    return this.client;
  }

  /**
   * Verify the token is valid by testing auth
   * @returns {Promise<Object>} Auth test result
   */
  async verifyAuth() {
    try {
      const client = this.getClient();
      const result = await client.auth.test();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
module.exports = new SlackClientManager();

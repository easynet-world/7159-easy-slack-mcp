/**
 * Request schema for example POST
 */
class Request {
  // @description('Example message')
  message!: string;
}

/**
 * Response schema for example POST
 */
class Response {
  // @description('Created data')
  data: object;
}

/**
 * Example POST API endpoint
 *
 * @description('Create example data')
 * @summary('Create example data')
 * @tags('example')
 */
function handler(req: any, res: any) {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: 'Message is required'
    });
  }

  res.status(201).json({
    data: {
      message: message,
      timestamp: Date.now(),
      id: Math.random().toString(36).substring(2, 11)
    }
  });
}

module.exports = handler;

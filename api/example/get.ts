/**
 * Request schema for example GET (no parameters needed)
 */
class Request {
  // No parameters needed
}

/**
 * Response schema for example GET
 */
class Response {
  // @description('Example data object')
  data: object;
}

/**
 * Example GET API endpoint
 *
 * @description('Get example data from the API')
 * @summary('Get example data')
 * @tags('example')
 */
function handler(req: any, res: any) {
  res.json({
    data: {
      message: 'This is an example API endpoint',
      timestamp: Date.now(),
      description: 'This endpoint was automatically generated when you ran easy-mcp-server init'
    }
  });
}

module.exports = handler;

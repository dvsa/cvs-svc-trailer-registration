import 'source-map-support/register';
import serverless from 'serverless-http';
import { Context, APIGatewayEvent, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { app } from './api';

const expressHandler = serverless(app);
console.log(`\nrunning version: ${process.env.API_VERSION} of API\n\n`);

const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  // Could be verbose, check with devs how we make it easy to debug, also we may want a logger
  console.log(`with event in Handler: ${JSON.stringify(event, null, 2)}`);
  console.log(`with context in Handler: ${JSON.stringify(context, null, 2)}`);

  return await expressHandler(event, context);
};

export { handler };

import 'source-map-support/register';
import serverless from 'serverless-http';
import { Context, APIGatewayEvent, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { app } from './infrastructure/api';
import { log } from './utils/logger';

const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  log.debug('event');
  log.debug(JSON.stringify(event.pathParameters, null, 2));
  log.debug(JSON.stringify(event.body, null, 2));
  return serverless(app)(event, context);
};

export { handler };

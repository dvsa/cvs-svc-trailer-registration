import 'source-map-support/register';
import serverless from 'serverless-http';
import { Context, APIGatewayEvent, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { app } from './infrastructure/api';

const { NODE_ENV, API_VERSION } = process.env;

console.log(`\nRunning version: '${API_VERSION}' of API in mode: ${NODE_ENV}\n\n`);

const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> =>
  await serverless(app)(event, context);


export { handler };

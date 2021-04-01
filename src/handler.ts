import 'source-map-support/register';
import serverless from 'serverless-http';
import { Context, APIGatewayEvent, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { app } from './infrastructure/api';
import { info, debug } from './utils/logger';

const {
  NODE_ENV, SERVICE, AWS_PROVIDER_REGION, AWS_PROVIDER_STAGE,
} = process.env;

info(
  `\nRunning Service:\n '${SERVICE}'\n mode: ${NODE_ENV}\n stage: '${AWS_PROVIDER_STAGE}'\n region: '${AWS_PROVIDER_REGION}'\n\n`,
);

const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  debug('event');
  debug(JSON.stringify(event.pathParameters, null, 2));
  debug(JSON.stringify(event.body, null, 2));
  return serverless(app)(event, context);
};

export { handler };

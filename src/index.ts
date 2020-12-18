import 'source-map-support/register';
import serverless from 'serverless-http';
import { Context, APIGatewayEvent, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { app } from './infrastructure/api';

const { NODE_ENV, SERVICE_VERSION, AWS_PROVIDER_REGION, AWS_PROVIDER_STAGE } = process.env;

console.log(
  `\nRunning Service\n version: '${SERVICE_VERSION}'\n mode: ${NODE_ENV}\n stage: '${AWS_PROVIDER_STAGE}'\n region: '${AWS_PROVIDER_REGION}'\n\n`,
);

const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> =>
  await serverless(app)(event, context);

export { handler };

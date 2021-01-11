import 'source-map-support/register';
import serverless from 'serverless-http';
import { Context, APIGatewayEvent, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { app } from './infrastructure/api';

const { NODE_ENV, API_VERSION, AWS_PROVIDER_REGION, AWS_PROVIDER_STAGE } = process.env;

console.log(
  `\nRunning Service\n version: '${API_VERSION}'\n mode: ${NODE_ENV}\n stage: '${AWS_PROVIDER_STAGE}'\n region: '${AWS_PROVIDER_REGION}'\n\n`,
);

const MAJOR_VERSION = `v${API_VERSION.split('.')[0]}`;

const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  console.log('event');
  console.log(JSON.stringify(event, null, 2));

  return await serverless(app, {
    /**
     * We proxy requests from / as <stage> is handled in APIG when we deploy.
     * With with serverless-offline we proxy requests from /v<x> from the client -
     * The package.json version as single source of truth to be the app basePath with stage
     * given at build time with .env files
     *
     * --noPrependStageInUrl flag could be used while running serverless offline if we wanted
     * to proxy from the stage instead of /.
     * The Open API specs specifies it should contain the version as /v<x> so we use
     *
     * We use express Router to proxy redirect requests from /v<x>/
     */
    // basePath: `${AWS_PROVIDER_STAGE}/${MAJOR_VERSION}`,
    basePath: `${MAJOR_VERSION}`,
  })(event, context);
};

export { handler };

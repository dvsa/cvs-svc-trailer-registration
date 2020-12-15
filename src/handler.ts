import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import 'source-map-support/register';

console.log(`\nrunning version: ${process.env.API_VERSION} of API\n\n`);

export async function hello(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {

  console.log(`with context in Handler: ${JSON.stringify(context, null, 2)}`);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!`,
        input: event,
      },
      null,
      2,
    ),
  };
};

import { APIGatewayEvent, APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from '../../src/handler';

describe('Application entry', () => {
  let event: APIGatewayProxyEvent;
  let context: Context;

  beforeEach(() => {
    event = {} as APIGatewayEvent;
    context = {} as Context;
  });

  afterEach(() => {
    jest.resetAllMocks().restoreAllMocks();
  });

  describe('Handler', () => {
    it('should initialize and call the correct route on express wrapper', async () => {
      const payload = {};
      event = ({
        httpMethod: 'POST',
        path: '/v1/trailers/',
        body: JSON.stringify(payload),
      } as unknown) as APIGatewayProxyEvent;

      const response = await handler(event, context);
      expect(response.statusCode).toEqual(400);
    });
  });
});

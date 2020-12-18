import { APIGatewayEvent, Context } from 'aws-lambda';
import { handler } from './';

describe('Entry', () => {
  describe('Handler', () => {
    it('should call the express wrapper', async () => {
      const event = { body: 'Test Body' } as APIGatewayEvent;
      const context = {} as Context;

      const response = await handler(event, context);

      expect(response.statusCode).toEqual(200);
      expect(typeof response.body).toBe('string');
    });
  });
});

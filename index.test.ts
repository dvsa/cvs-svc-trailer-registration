import { APIGatewayEvent, Context } from 'aws-lambda';

import { handler } from './src';

import * as Utils from './src/utils';

import DeleteTrailerId from './local/data/trailers-delete-id.json';
import DeleteTrailer from './local/data/trailers-delete.json';
import VersionTrailer from './local/data/version.json';

describe('Application entry', () => {
  let event, context, MAJOR_Mock, majorVersionNumber, basePath;

  beforeEach(() => {
    event = {} as APIGatewayEvent;
    context = {} as Context;
    MAJOR_Mock = jest.spyOn(Utils, 'createMajorVersionNumber').mockReturnValue('1');
    majorVersionNumber = MAJOR_Mock();
    basePath = Utils.createHandlerBasePath(MAJOR_Mock());
  });

  afterEach(() => {
    jest.resetAllMocks().restoreAllMocks();
  });

  describe('Handler', () => {
    it('should call the express wrapper', async () => {
      event = { body: 'Test Body' };

      const response = await handler(event, context);
      expect(response.statusCode).toEqual(200);
      expect(typeof response.body).toBe('string');
    });

    describe('when the service is running', () => {
      describe('without proxy', () => {
        it(`should return a body response when the handler has event with the '/' as path`, async () => {
          event = { httpMethod: 'GET', path: '/' };

          const response = await handler(event, context);
          const parsedBody = JSON.parse(response.body);

          expect(parsedBody.ok).toBe(true);
        });
      });
    });

    describe('with proxy', () => {
      describe(`on '<path>' or '<version>'`, () => {
        it(`should receive the version number from an environmental variable following semver convention`, () => {
          expect(process.env.API_VERSION).toMatch(/^(\d+\.)?(\d+\.)?(\*|\d+)$/);
        });

        it(`should have version number in the API shown as major`, () => {
          expect(majorVersionNumber).toMatch(/^(\d+)$/);
          expect(majorVersionNumber).not.toMatch(/^(\d+\.)$/);
        });

        it(`should call the service when the path contains the version: '/<v>'`, async () => {
          event = { httpMethod: 'POST', path: `/${basePath}/trailers` };
          const response = await handler(event, context);

          expect(response.statusCode).toEqual(200);
          expect(response.body).toBe('Hello World!');
        });

        it(`should not call the service when the version is not injected`, async () => {
          event = { httpMethod: 'POST', path: `/v10/trailers` };
          const response = await handler(event, context);

          expect(response.statusCode).toEqual(404);
        });

        it('should call when the path have also has a stage: /<stage>', async () => {
          event = { httpMethod: 'POST', path: `/some-stage/${basePath}/trailers` };
          const response = await handler(event, context);

          expect(response.statusCode).toEqual(200);
          expect(response.body).toBe('Hello World!');
        });

        it(`should not call the service/lambda when the path does not contain a valid endpoint with a version`, async () => {
          event = { httpMethod: 'POST', path: `/${basePath}/wrong-path/trailers` };
          const response = await handler(event, context);

          expect(response.statusCode).toEqual(404);
        });

        it(`should not call the service/lambda when the path does not have a correct '/v'`, async () => {
          event = { httpMethod: 'GET', path: 'local-stage/no-version/trailers' };

          const response = await handler(event, context);
          expect(response.statusCode).toEqual(404);
        });
      });

      describe(`on '/trailers' endpoint(s)`, () => {
        it(`should call the service/lambda when the path contains '/trailers/'`, async () => {
          event = {
            ...DeleteTrailer,
            path: `stage/${basePath}/trailers`,
          };

          const response = await handler(event, context);

          expect(response.statusCode).toEqual(200);
          expect(response.body).toBe('Hello World!');
        });

        it(`should call the service/lambda when the path contains '/trailers/:id/unregister'`, async () => {
          event = {
            ...DeleteTrailerId,
            path: `/stage/${basePath}/trailers/:id/unregister`,
          };

          const response = await handler(event, context);

          expect(response.statusCode).toEqual(200);
          expect(response.body).toBe('Bye World!');
        });
      });

      describe(`on '/version' endpoint(s)`, () => {
        it(`should call the service/lambda when the path contains '/version' and return the app version following the semver convention`, async () => {
          event = {
            ...VersionTrailer,
            path: `stage/${basePath}/version`,
          };

          const response = await handler(event, context);
          const parsedResponse = JSON.parse(response.body);
          // is given when we build the file as API_VERSION from package.json with $npm_package_version
          // TODO we follow semver for code versioning ATM and only use the major for the API endpoint as v1
          const { API_VERSION } = process.env;

          expect(response.statusCode).toEqual(200);
          expect(parsedResponse.version).toBe(API_VERSION);
        });
      });
    });
  });
});

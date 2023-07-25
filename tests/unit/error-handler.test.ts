import { Request } from 'jest-express/lib/request';
import { NextFunction } from 'jest-express/lib/next';
import { Response } from 'jest-express/lib/response';
import * as express from 'express';
import { HTTPError } from '../../src/domain/http-error';
import { errorHandler } from '../../src/interfaces/middlewares';
import { ERRORS } from '../../src/domain';

describe('Insert Trailer Controller', () => {
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = new Request();
    mockResponse = new Response();
    mockNext = jest.fn();
  });

  afterEach(() => {
    mockRequest.resetMocked();
    mockResponse.resetMocked();
    jest.resetAllMocks().restoreAllMocks();
  });

  describe('errorHandler', () => {
    test('should return internal server error for 500 status code', () => {
      const mockError = new HTTPError(500, 'something bad');

      errorHandler(
        mockError,
        (mockRequest as unknown) as express.Request,
        (mockResponse as unknown) as express.Response,
        mockNext,
      );
      expect(mockResponse.statusCode).toBe(500);
      expect(mockResponse.body).toEqual(ERRORS.INTERNAL_SERVER_ERROR);
    });

    test('should return body as passed if error code other than 500', () => {
      const errorMessage = 'a bad request';
      const mockError = new HTTPError(400, errorMessage);

      errorHandler(
        mockError,
        (mockRequest as unknown) as express.Request,
        (mockResponse as unknown) as express.Response,
        mockNext,
      );
      expect(mockResponse.statusCode).toBe(400);
      expect(mockResponse.body).toEqual(errorMessage);
    });
  });
});

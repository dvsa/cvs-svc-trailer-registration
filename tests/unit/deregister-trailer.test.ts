import * as express from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import * as domain from '../../src/domain';
import * as controllers from '../../src/interfaces/controllers';
import { DataAccess } from '../../src/utils/data-access';

// eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-return
jest.mock('express', () => require('jest-express'));
describe('Deregister Trailer Controller', () => {
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: express.NextFunction;
  let deregisterTrailer: controllers.DeregisterTrailer;
  let mockDAO: DataAccess;

  beforeEach(() => {
    mockRequest = new Request();
    mockResponse = new Response();
    mockNext = jest.fn();
    mockDAO = new DataAccess();
    deregisterTrailer = new controllers.DeregisterTrailer(mockDAO);
  });

  afterEach(() => {
    mockRequest.resetMocked();
    mockResponse.resetMocked();
    jest.resetAllMocks().restoreAllMocks();
  });

  describe('deregisterTrailer', () => {
    test('should update and call 200 status for valid payload and return the inserted object', async () => {
      const payload = {
        reasonForDeregistration: 'old registration',
        deregisterDate: '2021-01-01',
      };
      mockRequest.params = 'AB123AD';
      mockRequest.setBody(payload);

      const getByTrnSpy = jest.spyOn(mockDAO, 'getByTrn');

      const upsertTrailerRegistrationSpy = jest.spyOn(mockDAO, 'upsertTrailerRegistration');
      const expectedResult = {
        vinOrChassisWithMake: 'ABC1321234566big truck',
        vin: 'ABC1321234566',
        make: 'big truck',
        trn: 'AB123AD',
        certificateExpiryDate: '2021-12-12',
        certificateIssueDate: '2021-01-01',
      };
      getByTrnSpy.mockImplementation(() => Promise.resolve(([
        expectedResult,
      ] as unknown) as domain.TrailerRegistration[]));

      upsertTrailerRegistrationSpy.mockImplementation(() => Promise.resolve((expectedResult as unknown) as domain.TrailerRegistration));

      await deregisterTrailer.call(
        (mockRequest as unknown) as express.Request,
        (mockResponse as unknown) as express.Response,
        mockNext,
      );
      expect(mockResponse.statusCode).toBe(200);
      expect(mockResponse.body).toEqual(expectedResult);
    });

    test('if an existing trailer registration is not found it should return 200 status for valid payload', async () => {
      const payload = {
        reasonForDeregistration: 'old registration',
        deregisterDate: '2021-01-01',
      };
      mockRequest.params = 'AB123AD';
      mockRequest.setBody(payload);

      const getByTrnSpy = jest.spyOn(mockDAO, 'getByTrn');

      getByTrnSpy.mockReturnValue(null);

      await deregisterTrailer.call(
        (mockRequest as unknown) as express.Request,
        (mockResponse as unknown) as express.Response,
        mockNext,
      );
      expect(mockResponse.statusCode).toBe(204);
    });

    test('should call next if validation fails', async () => {
      const payload = {
        deregisterDate: '2021-01-01',
      };
      mockRequest.params = 'AB123AD';
      mockRequest.setBody(payload);

      await deregisterTrailer.call(
        (mockRequest as unknown) as express.Request,
        (mockResponse as unknown) as express.Response,
        mockNext,
      );
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new domain.HTTPError(400, '"reasonForDeregistration" is required'));
    });
  });
});

import * as express from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import * as domain from '../../src/domain';
import { TrailerRegistration } from '../../src/domain/trailer-registration';
import { GetTrailerRegistration } from '../../src/interfaces/controllers/get-trailer-registration';
import { DataAccess } from '../../src/utils/data-access';

// eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-return
jest.mock('express', () => require('jest-express'));
describe('Get Trailer Registration Controller', () => {
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: express.NextFunction;
  let mockDAO: DataAccess;
  let getRegistrationTrailer: GetTrailerRegistration;

  beforeEach(() => {
    mockRequest = new Request();
    mockResponse = new Response();
    mockDAO = new DataAccess();
    mockNext = jest.fn();
    getRegistrationTrailer = new GetTrailerRegistration(mockDAO);
  });

  afterEach(() => {
    mockRequest.resetMocked();
    mockResponse.resetMocked();
    jest.resetAllMocks().restoreAllMocks();
  });

  describe('getTrailerRegistration', () => {
    test('should return a status code 200 and a trailer registration when a valid 17 digit vin and make is provided', async () => {
      mockRequest.params = { vin: 'ABC13212345663DF5' };
      mockRequest.query = { make: 'some make' };

      const expectedResult = {
        vinOrChassisWithMake: 'ABC13212345663DF5',
        vin: 'ABC13212345663DF5',
        make: 'big truck',
        trn: 'AB123AD',
        certificateExpiryDate: '2021-12-12',
        certificateIssueDate: '2021-01-01',
      };
      const mockReturnValue = Promise.resolve(([{ ...expectedResult }] as unknown) as TrailerRegistration[]);

      const getByVinOrChassisWithMakeSpy = jest.spyOn(mockDAO, 'getByVinOrChassisWithMake');

      getByVinOrChassisWithMakeSpy.mockReturnValue(mockReturnValue);

      await getRegistrationTrailer.call(
        (mockRequest as unknown) as express.Request,
        (mockResponse as unknown) as express.Response,
        mockNext,
      );
      expect(mockResponse.statusCode).toBe(200);
      expect(mockResponse.body).toEqual(expectedResult);
    });
    test('should return a status code 200 and a trailer registration when a valid non 17 digit vin and make is provided', async () => {
      mockRequest.params = { vin: 'A1B2C3D4' };
      mockRequest.query = { make: 'some make' };

      const expectedResult = {
        vinOrChassisWithMake: 'A1B2C3D4some make',
        vin: 'A1B2C3D4',
        make: 'some make',
        trn: 'AB123AD',
        certificateExpiryDate: '2021-12-12',
        certificateIssueDate: '2021-01-01',
      };
      const mockReturnValue = Promise.resolve(([{ ...expectedResult }] as unknown) as TrailerRegistration[]);

      const getByVinOrChassisWithMakeSpy = jest.spyOn(mockDAO, 'getByVinOrChassisWithMake');

      getByVinOrChassisWithMakeSpy.mockReturnValue(mockReturnValue);

      await getRegistrationTrailer.call(
        (mockRequest as unknown) as express.Request,
        (mockResponse as unknown) as express.Response,
        mockNext,
      );
      expect(mockResponse.statusCode).toBe(200);
      expect(mockResponse.body).toEqual(expectedResult);
    });

    test('should return a status code 404 and a "No data found" message when a trailer registration for the vin and make is not found', async () => {
      mockRequest.params = { vin: 'ABC13212345663DF5' };
      mockRequest.query = { make: 'some make' };

      const getByVinOrChassisWithMakeSpy = jest.spyOn(mockDAO, 'getByVinOrChassisWithMake');

      getByVinOrChassisWithMakeSpy.mockReturnValue(null);

      await getRegistrationTrailer.call(
        (mockRequest as unknown) as express.Request,
        (mockResponse as unknown) as express.Response,
        mockNext,
      );
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining(new domain.HTTPError(404, domain.ERRORS.RECORD_NOT_FOUND)));
    });

    test('should return status code 400 and an error message when make is not passed in the query string', async () => {
      mockRequest.params = { vin: 'ABC13212345663DF5' };

      const expectedResult = '"make" is required';

      await getRegistrationTrailer.call(
        (mockRequest as unknown) as express.Request,
        (mockResponse as unknown) as express.Response,
        mockNext,
      );
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining(new domain.HTTPError(400, expectedResult)));
    });
  });
});

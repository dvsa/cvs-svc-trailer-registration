import * as express from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import * as domain from '../../src/domain';
import { InsertTrailerRegistration } from '../../src/interfaces/controllers/insert-trailer-registration';
import { DataAccess } from '../../src/utils/data-access';

// eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-return
jest.mock('express', () => require('jest-express'));
describe('Insert Trailer Controller', () => {
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: express.NextFunction;
  let mockDAO: DataAccess;
  let insertRegistrationTrailer: InsertTrailerRegistration;

  beforeEach(() => {
    mockRequest = new Request();
    mockResponse = new Response();
    mockDAO = new DataAccess();
    mockNext = jest.fn();
    insertRegistrationTrailer = new InsertTrailerRegistration(mockDAO);
  });

  afterEach(() => {
    mockRequest.resetMocked();
    mockResponse.resetMocked();
    jest.resetAllMocks().restoreAllMocks();
  });

  describe('insertTrailerRegistration', () => {
    test('should insert and call 200 status with valid payload', async () => {
      const payload = {
        vin: 'ABC1321234566',
        make: 'big truck',
        trn: 'AB123AD',
        certificateExpiryDate: '2021-12-12',
        certificateIssueDate: '2021-01-01',
      };
      mockRequest.setBody(payload);

      const getByVinOrChassisWithMakeSpy = jest.spyOn(mockDAO, 'getByVinOrChassisWithMake');

      const upsertTrailerRegistrationSpy = jest.spyOn(mockDAO, 'upsertTrailerRegistration');

      getByVinOrChassisWithMakeSpy.mockReturnValue(null);
      const expectedResult = {
        vinOrChassisWithMake: 'ABC1321234566big truck',
        vin: 'ABC1321234566',
        make: 'big truck',
        trn: 'AB123AD',
        certificateExpiryDate: '2021-12-12',
        certificateIssueDate: '2021-01-01',
      };
      upsertTrailerRegistrationSpy.mockImplementation(() => Promise.resolve((expectedResult as unknown) as domain.TrailerRegistration));

      await insertRegistrationTrailer.call(
        (mockRequest as unknown) as express.Request,
        (mockResponse as unknown) as express.Response,
        mockNext,
      );
      expect(mockResponse.statusCode).toBe(200);
      expect(mockResponse.body).toEqual(expectedResult);
    });

    test('should deregister if an existing registration is found and insert new and return 200 status for valid payload', async () => {
      const payload = {
        vin: 'ABC1321234566',
        make: 'big truck',
        trn: 'AB123AD',
        certificateExpiryDate: '2021-12-12',
        certificateIssueDate: '2021-01-01',
      };
      mockRequest.setBody(payload);

      const getByVinOrChassisWithMakeSpy = jest.spyOn(mockDAO, 'getByVinOrChassisWithMake');

      const upsertTrailerRegistrationSpy = jest.spyOn(mockDAO, 'upsertTrailerRegistration');

      getByVinOrChassisWithMakeSpy.mockImplementation(() => Promise.resolve(([
        {
          vinOrChassisWithMake: 'ABC1321234566big truck',
          vin: 'ABC1321234566',
          make: 'big truck',
          trn: 'AB123AD',
          certificateExpiryDate: '2021-12-12',
          certificateIssueDate: '2021-01-01',
        },
      ] as unknown) as domain.TrailerRegistration[]));
      const expectedResult = {
        vinOrChassisWithMake: 'ABC1321234566big truck',
        vin: 'ABC1321234566',
        make: 'big truck',
        trn: 'AB123AD',
        certificateExpiryDate: '2021-12-12',
        certificateIssueDate: '2021-01-01',
      };
      upsertTrailerRegistrationSpy.mockImplementation(() => Promise.resolve((expectedResult as unknown) as domain.TrailerRegistration));

      await insertRegistrationTrailer.call(
        (mockRequest as unknown) as express.Request,
        (mockResponse as unknown) as express.Response,
        mockNext,
      );
      expect(mockResponse.statusCode).toBe(200);
      expect(mockResponse.body).toEqual(expectedResult);
    });

    test('should call next if validation fails', async () => {
      const payload = {
        vin: 'ABC1321234566',
        make: 'big truck',
        certificateExpiryDate: '2021-12-12',
        certificateIssueDate: '2021-01-01',
      };
      mockRequest.setBody(payload);

      await insertRegistrationTrailer.call(
        (mockRequest as unknown) as express.Request,
        (mockResponse as unknown) as express.Response,
        mockNext,
      );
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining(new domain.HTTPError(400, '"trn" is required')));
    });
  });
});

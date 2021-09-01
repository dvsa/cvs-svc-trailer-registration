import supertest from 'supertest';
import { emptyDatabase, populateDatabase } from '../utils/dbUtil';
import * as domain from '../../src/domain';
import * as trailerRegistrations from '../resources/trailer-registration.json';

const url = 'http://localhost:3020/local';
const request = supertest(url);
const commonInsertPayload = {
  make: 'Some Industries',
  trn: 'EF127861',
  certificateExpiryDate: '2022-04-14T15:49:30.881Z',
  certificateIssueDate: '2021-04-14T15:49:30.881Z',
};

describe('insert trailer registration', () => {
  beforeAll(async () => {
    await emptyDatabase();
  });

  beforeEach(async () => {
    await populateDatabase();
  });

  afterEach(async () => {
    await emptyDatabase();
  });

  afterAll(async () => {
    await populateDatabase();
  });

  test('should return 200 status code and save a valid payload with a 17 digit vin as the key', async () => {
    const payload = {
      vin: 'EFG9020JJ00780464',
      ...commonInsertPayload,
    };
    const expectedResponse = { ...payload, vinOrChassisWithMake: payload.vin };
    const requestUrl = '/v1/trailers';
    const response = await request.post(requestUrl).send(payload);
    const insertedTrailer = response.body as domain.TrailerRegistration;
    expect(response.status).toEqual(200);
    expect(insertedTrailer.vin).toEqual(expectedResponse.vin);
    expect(insertedTrailer.vinOrChassisWithMake).toEqual(expectedResponse.vin);
  });

  test('should return 200 status code and save a valid payload with less than 17 digit vin with vin+make as key', async () => {
    const payload = {
      vin: 'PQR9020JJ007',
      ...commonInsertPayload,
    };
    const expectedResponse = { ...payload, vinOrChassisWithMake: payload.vin + payload.make };
    const requestUrl = '/v1/trailers';
    const response = await request.post(requestUrl).send(payload);
    const insertedTrailer = response.body as domain.TrailerRegistration;
    expect(response.status).toEqual(200);
    expect(insertedTrailer.vin).toEqual(expectedResponse.vin);
    expect(insertedTrailer.vinOrChassisWithMake).toEqual(expectedResponse.vinOrChassisWithMake);
  });

  test('should return 400 bad request when payload is invalid', async () => {
    const payload = {
      vin: 'GQR9020JJ007',
      ...commonInsertPayload,
    };
    delete payload.trn;
    const requestUrl = '/v1/trailers';
    const response = await request.post(requestUrl).send(payload);
    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"trn" is required');
  });

  test('should archive existing registration and return 200 for a valid payload for an existing vin', async () => {
    const {
      vinOrChassisWithMake,
      certificateIssueDate,
      vin,
      make,
      trn,
      certificateExpiryDate,
    } = trailerRegistrations[1];

    const payload = {
      vin,
      make,
      trn,
      certificateExpiryDate: '2022-12-14T15:49:30.881Z',
      certificateIssueDate,
    };

    const commonResponse = {
      vin,
      make,
      trn,
      certificateIssueDate,
    };

    const expectedResponse = {
      ...commonResponse,
      certificateExpiryDate: payload.certificateExpiryDate,
      vinOrChassisWithMake,
      archive: [
        {
          ...commonResponse,
          certificateExpiryDate,
          reasonForDeregistration: 'New certificate received.',
          deregisterDate: certificateIssueDate,
        },
      ],
    };
    const requestUrl = '/v1/trailers';
    const response = await request.post(requestUrl).send(payload);
    const insertedTrailer = response.body as domain.TrailerRegistration;
    expect(response.status).toEqual(200);
    expect(insertedTrailer.vinOrChassisWithMake).toEqual(expectedResponse.vin);
    expect(insertedTrailer.archive).toEqual(expectedResponse.archive);
  });
});

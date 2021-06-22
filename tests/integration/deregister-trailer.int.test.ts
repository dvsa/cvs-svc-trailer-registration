import supertest from 'supertest';
import { emptyDatabase, populateDatabase } from '../utils/dbUtil';
import * as domain from '../../src/domain';
import * as trailerRegistrations from '../resources/trailer-registration.json';

const url = 'http://localhost:3020/local';
const request = supertest(url);

describe('deregister trailer', () => {
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

  test('should return 200 status code and the updated trailer registration when TRN is found', async () => {
    const {
      vin,
      vinOrChassisWithMake,
      trn,
      make,
      certificateIssueDate,
      certificateExpiryDate,
    } = trailerRegistrations[2];
    const requestUrl = '/v1/trailers/deregister';
    const payload = {
      deregisterDate: '2020-06-29T15:10:01+0000',
      reasonForDeregistration: 'some changes',
    };
    const commonResponse = {
      vin,
      make,
      trn,
      certificateExpiryDate,
      certificateIssueDate,
    };

    const expectedResponse = {
      ...commonResponse,
      vinOrChassisWithMake,
      deregisterDate: payload.deregisterDate,
      reasonForDeregistration: payload.reasonForDeregistration,
    };

    const response = await request.put(`${requestUrl}/${trn}`).send(payload);
    const deRegistered = response.body as domain.TrailerRegistration;
    console.log('deregistered', deRegistered);
    expect(response.status).toEqual(200);
    expect(deRegistered.vinOrChassisWithMake).toEqual(expectedResponse.vinOrChassisWithMake);
    expect(deRegistered.reasonForDeregistration).toEqual(expectedResponse.reasonForDeregistration);
  });

  test('should return 200 status code and the updated trailer registration when an existing unregistered TRN is found', async () => {
    const {
      vin,
      vinOrChassisWithMake,
      trn,
      make,
      certificateIssueDate,
      certificateExpiryDate,
    } = trailerRegistrations[2];
    const requestUrl = '/v1/trailers/deregister';
    const payload = {
      deregisterDate: '2020-12-29T15:10:01+0000',
      reasonForDeregistration: 'some changes',
    };
    const commonResponse = {
      vin,
      make,
      trn,
      certificateExpiryDate,
      certificateIssueDate,
    };

    const expectedResponse = {
      ...commonResponse,
      vinOrChassisWithMake,
      deregisterDate: payload.deregisterDate,
      reasonForDeregistration: payload.reasonForDeregistration,
    };

    const response = await request.put(`${requestUrl}/${trn}`).send(payload);
    const deRegistered = response.body as domain.TrailerRegistration;
    console.log(deRegistered);
    expect(response.status).toEqual(200);
    expect(deRegistered.vinOrChassisWithMake).toEqual(expectedResponse.vinOrChassisWithMake);
    expect(deRegistered.reasonForDeregistration).toEqual(expectedResponse.reasonForDeregistration);
    expect(deRegistered.deregisterDate).toEqual(expectedResponse.deregisterDate);
  });

  test('should return status code 400 and error message/messages containing error details when the payload is invalid', async () => {
    const { trn } = trailerRegistrations[2];
    const requestUrl = '/v1/trailers/deregister';
    const payload = {
      deregisterDate: '2020-06-29T15:10:01+0000',
    };

    const response = await request.put(`${requestUrl}/${trn}`).send(payload);
    expect(response.status).toEqual(400);
    expect(response.text).toEqual('"reasonForDeregistration" is required');
  });

  test('should return 204 when payload is valid but trn is not found', async () => {
    const trn = 'XXXXXXX';
    const requestUrl = '/v1/trailers/deregister';
    const payload = {
      deregisterDate: '2020-06-29T15:10:01+0000',
      reasonForDeregistration: 'some changes',
    };

    const response = await request.put(`${requestUrl}/${trn}`).send(payload);
    expect(response.status).toEqual(204);
  });
});

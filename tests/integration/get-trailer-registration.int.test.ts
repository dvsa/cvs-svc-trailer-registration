import supertest from 'supertest';
import { emptyDatabase, populateDatabase } from '../utils/dbUtil';
import * as domain from '../../src/domain';
import * as trailerRegistrations from '../resources/trailer-registration.json';

const url = 'http://localhost:3020/local';
const request = supertest(url);
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

  test('should return 200 status code and a trailer registration response for a GET request to v1/trailers/{VIN}?make={make} with a 17 digit vin', async () => {
    const expectedResponse = trailerRegistrations[0];
    const requestUrl = `/v1/trailers/${expectedResponse.vin}?make=${expectedResponse.make}`;
    const response = await request.get(requestUrl);
    const trailerResult = response.body as domain.TrailerRegistration;
    expect(response.status).toEqual(200);
    expect(trailerResult.vin).toEqual(expectedResponse.vin);
    expect(trailerResult.vinOrChassisWithMake).toEqual(expectedResponse.vinOrChassisWithMake);
  });

  test('should return 200 status code and a trailer registration response for a GET request to v1/trailers/{VIN}?make={make} with a non 17 digit vin', async () => {
    const expectedResponse = trailerRegistrations[3];
    const requestUrl = `/v1/trailers/${expectedResponse.vin}?make=${expectedResponse.make}`;
    const response = await request.get(requestUrl);
    const trailerResult = response.body as domain.TrailerRegistration;
    expect(response.status).toEqual(200);
    expect(trailerResult.vinOrChassisWithMake).toEqual(expectedResponse.vin + expectedResponse.make);
  });

  test('should return status code 404 and response message "No data found" for a GET request to v1/trailers/{VIN}?make={make} with unregistered vin', async () => {
    const expectedResponse = domain.ERRORS.RECORD_NOT_FOUND;
    const requestUrl = '/v1/trailers/123?make=something';
    const response = await request.get(requestUrl);
    expect(response.status).toEqual(404);
    expect(response.text).toEqual(expectedResponse);
  });

  test('should return status code 400 and an error message for a GET request to v1/trailers/{VIN} without make in query string', async () => {
    const expectedResponse = '"make" is required';
    const requestUrl = '/v1/trailers/1234';
    const response = await request.get(requestUrl);
    expect(response.status).toEqual(400);
    expect(response.text).toEqual(expectedResponse);
  });
});

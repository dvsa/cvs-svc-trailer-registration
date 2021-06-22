import supertest from 'supertest';
import { app } from '../../src/infrastructure/api';

describe('API', () => {
  afterEach(() => {
    jest.resetAllMocks().restoreAllMocks();
  });

  describe('POST /', () => {
    test('should call the post route', async () => {
      const payload = {
        vin: 'ABC1321234566',
        make: 'big truck',
        certificateExpiryDate: '2021-12-12',
        certificateIssueDate: '2021-01-01',
      };

      const result = await supertest(app).post('/v1/trailers').send(payload);
      expect(result.status).toEqual(400);
      expect(result.text).toEqual('"trn" is required');
    });
  });

  describe('PUT /deregister/:trn', () => {
    test('should call the deregister route', async () => {
      const payload = {
        reasonForDeregistration: 'old registration',
      };

      const result = await supertest(app).put('/v1/trailers/deregister/ABC123').send(payload);
      expect(result.status).toEqual(400);
    });
  });
});

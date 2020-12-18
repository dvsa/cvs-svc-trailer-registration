import supertest from 'supertest';
import { app } from './';

// TODO Define Mock strategy
describe('API', () => {
  let request;
  beforeEach(() => {
    request = supertest(app);
  });

  describe('GET', () => {
    test(`should return 'Hello World!' when hitting '/' route`, (done) => {
      request.get('/').expect(200, (_, res) => {
        expect(res.text).toBe('Hello World!');
        done();
      });
    });
  });
  describe('POST', () => {
    test(`should return 'posted!' when hitting '/' route`, (done) => {
      request.post('/').expect(200, (_, res) => {
        expect(res.text).toBe('posted!');
        done();
      });
    });
  });
});

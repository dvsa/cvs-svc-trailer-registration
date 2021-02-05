import supertest from 'supertest';
import { app } from './';

// TODO Define Mock strategy
describe('API', () => {
  let request;
  beforeEach(() => {
    request = supertest(app);
  });

  afterEach(() => {
    jest.resetAllMocks().restoreAllMocks();
  });

  describe('GET', () => {
    test(`should return '{ok: true}' when hitting '/' route`, (done) => {
      request
        .get('/')
        .expect(200)
        .expect(({ ok }) => {
          expect(ok).toBe(true);
        })
        .end(done);
    });
  });

  describe('POST', () => {
    test(`should return 'Hello World!' when hitting '/trailers/:id/unregister' route`, (done) => {
      request
        .post('/trailers/:id/unregister')
        .expect(200)
        .expect(({ text }) => {
          expect(text).toBe('Bye World!');
          expect(text).toBe('Bye World!');
          expect(text).toBe('Bye World!');
        })
        .end(done);
    });

    test(`should return 'Hello World!' when hitting '/trailers' route`, (done) => {
      request
        .post('/trailers')
        .expect(200)
        .expect(({ text }) => {
          expect(text).toBe('Hello World!');
        })
        .end(done);
    });
  });
});

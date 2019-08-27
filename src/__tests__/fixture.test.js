const request = require('supertest');
const app = require('../app');

describe('The Take Me Home App', () => {

  jest.setTimeout(60000);

  it('can return some trips on request', (done) => {
    request(app)
      .get('/trips')
      .expect(200, done);
  });
});

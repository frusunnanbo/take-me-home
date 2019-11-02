const request = require('supertest');

const app = require('../app');

describe('The take-me-home app', () => {
  it('Responds to /', () => {
    return request(app)
      .get('/trips')
      .expect(200);
  })
});

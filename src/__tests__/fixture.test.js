const request = require('supertest');

const app = require('../app');

describe('The Take-me-home app', () => {

  it('returns some trips', () => {

    return request(app)
      .get('/trips')
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSnapshot();
      })
  }, 60000)
})

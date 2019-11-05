const request = require('supertest');
const app = require('../app');

describe('The Take-me-home app', () => {

  it('returns some trips', () => {
    return request(app)
      .get('/trips?startTime=2019-11-09T12:15')
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSnapshot();
      })
  })
})

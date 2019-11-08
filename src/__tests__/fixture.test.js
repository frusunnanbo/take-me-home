const request = require('supertest');
const nock = require('nock');

const app = require('../app');

describe('The Take-me-home app', () => {

  beforeEach(() => {
    nock('https://api.resrobot.se')
      .get(/.*/)
      .replyWithFile(200, 'resrobot.response.json');
  })

  it('returns some trips', () => {

    return request(app)
      .get('/trips?startTime=2019-11-09T12:15')
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSnapshot();
      })
  }, 60000)
})

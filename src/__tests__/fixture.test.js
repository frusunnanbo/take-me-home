const request = require('supertest');
const nock = require('nock')

const app = require('../app');

describe('The take-me-home app', () => {

  beforeEach(() => {

    nock('https://api.resrobot.se')
      .get(/.*/)
      .replyWithFile(200, 'resrobot.response.json');
  });

  it('Responds to /', () => {
    return request(app)
      .get('/trips?startTime=2019-11-09T11:31')
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSnapshot();
      });
  });
});

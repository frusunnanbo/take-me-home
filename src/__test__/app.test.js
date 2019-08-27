const request = require('supertest');
const nock = require('nock');
const fs = require('fs');
const app = require('../app');

describe('The Take-me-home app', () => {

  jest.setTimeout(60000);

  beforeAll(() => {
    nock('https://api.resrobot.se')
      .get(/\/v2\/trip/)
      .reply(200, JSON.parse(fs.readFileSync('resrobot-response.json')));
  });

  it('Returns some trips', (done) => {

    request(app)
      .get('/trips?startTime=2019-09-05T11:45')
      .expect(200)
      .end((err, res) => {
        expect(res.body).toMatchSnapshot();
        done();
      });

  });

});

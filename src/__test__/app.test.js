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
      .get('/?hereLat=56.4883233&hereLong=16.3842807&homeLat=59.2733699&homeLong=18.0183112&startTime=2019-08-04T19:02')
      .expect(200)
      .end((err, res) => {
        expect(res.body).toMatchSnapshot();
        done();
      });

  });

});

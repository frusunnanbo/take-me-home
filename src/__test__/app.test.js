const request = require('supertest');
const nock = require('nock');
const fs = require('fs');
const app = require('../app');

describe('The Take-me-home app', () => {

  jest.setTimeout(60000);

  beforeAll(() => {
    nock('https://api.resrobot.se')
      .get(/\/v2\/trip.*date=2019-08-04.*time=19.*/)
      .reply(200, JSON.parse(fs.readFileSync('response1.json')));

    nock('https://api.resrobot.se')
      .get(/\/v2\/trip.*time=05.*/)
      .reply(200, JSON.parse(fs.readFileSync('response2.json')));

    nock('https://api.resrobot.se')
      .get(/\/v2\/trip.*time=07.*/)
      .reply(200, JSON.parse(fs.readFileSync('response3.json')));

    nock('https://api.resrobot.se')
      .get(/\/v2\/trip.*time=10.*/)
      .reply(200, JSON.parse(fs.readFileSync('response4.json')));

    nock('https://api.resrobot.se')
      .get(/\/v2\/trip.*time=14.*/)
      .reply(200, JSON.parse(fs.readFileSync('response5.json')));

    nock('https://api.resrobot.se')
      .get(/\/v2\/trip.*date=2019-08-05.*time=19.*/)
      .reply(200, JSON.parse(fs.readFileSync('response6.json')));
  });

  it('Returns some trips', (done) => {

    request(app)
      .get('/?hereLat=56.4883233&hereLong=16.3842807&homeLat=59.2733699&homeLong=18.0183112')
      .expect(200)
      .end((err, res) => {
        expect(res.body).toMatchSnapshot();
        done();
      });

  });
});

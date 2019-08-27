const fs = require("fs");
const path = require("path");
const request = require('supertest');
const nock = require('nock');

const app = require('../app');

const HARD_CODED_RESROBOT_RESPONSE = JSON.parse(fs.readFileSync(path.resolve(__dirname, "__testdata__/resrobot.response.json")));

describe('The Take Me Home App', () => {

  beforeAll(() => {

    nock('https://api.resrobot.se')
      .get(/.*/)
      .reply(200, HARD_CODED_RESROBOT_RESPONSE);
  });

  it('can return some trips on request', async () => {
    return request(app)
      .get('/trips?startTime=2019-09-10T11:45')
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSnapshot();
      });
  });
});

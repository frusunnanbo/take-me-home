const request = require('supertest');
const app = require('../app');

describe('The Take-me-home app', () => {

  jest.setTimeout(60000);

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

const fs = require('fs');
const express = require('express');
const request = require('request-promise-native');

const app = express();
const port = 3000;

const key = ('' + fs.readFileSync('key.txt')).trim();

console.log(`Using API key ${key}`);

app.get('/', async (req, res) => {

  const options = {
    uri: 'https://api.resrobot.se/v2/location.nearbystops',
    qs: {
      key: key,
      originCoordLat: 56.4883233,
      originCoordLong: 16.3842807,
      r: 10000,
      format: 'json'
    },
    json: true
  };

  const response = await request(options);

  res.json(response);
});

app.listen(port, () => console.log(`Take-me-home app listening on port ${port}!`));

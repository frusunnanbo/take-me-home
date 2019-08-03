const fs = require('fs');
const express = require('express');
const request = require('request-promise-native');
const moment = require('moment');

const app = express();

const key = ('' + fs.readFileSync('key.txt')).trim();

console.log(`Using API key ${key}`);

app.get('/', async (req, res) => {

  let tripStops = [];
  let startTime = moment();
  const lastDepartureTime = moment().add(1, 'days');

  while (startTime.isBefore(lastDepartureTime)) {

    const options = {
      uri: 'https://api.resrobot.se/v2/trip',
      qs: {
        key: key,
        date: startTime.format(('YYYY-MM-DD')),
        time: startTime.format('HH:mm'),
        originCoordLat: req.query.hereLat,
        originCoordLong: req.query.hereLong,
        destCoordLat: req.query.homeLat,
        destCoordLong: req.query.homeLong,
        originWalk: '1,0,10000',
        destWalk: '1,0,10000',
        format: 'json'
      },
      json: true
    };

    console.log(`Looking for trips starting at ${startTime}`);
    const response = await request(options);

    const trips = response['Trip'];

    const lastTripFirstLegOrigin = trips[trips.length - 1]['LegList']['Leg'][1]['Origin'];
    const lastListedTimeString = lastTripFirstLegOrigin.date + 'T' + lastTripFirstLegOrigin.time;
    startTime = moment(lastListedTimeString);

    tripStops = tripStops.concat(trips.map((trip) => ({
      start: {
        date: trip['LegList']['Leg'][1]['Origin'].date,
        time: trip['LegList']['Leg'][1]['Origin'].time
      },
      stops: trip['LegList']['Leg']
        .slice(1)
        .flatMap((leg, index) => (leg['Stops'] || {'Stop' : []})['Stop']
          .slice(index ? 1 : 0)
          .map(stop => stop.name))
    })));
  }

  res.json(tripStops);
});

module.exports = app;

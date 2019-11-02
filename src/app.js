const fs = require('fs');
const express = require('express');
const expressHbs = require('express-handlebars');
const request = require('request-promise-native');
const moment = require('moment');

const { selectTrips } = require('./trips');

const app = express();

const key = ('' + fs.readFileSync('key.txt')).trim();

const API_URL = process.env.API_URL || 'https://api.resrobot.se/v2/trip';

const DEFAULT_HERE = {
  lat: 59.4652971,
  long: 18.2857936
};

const DEFAULT_HOME = {
  lat: 59.2733699,
  long: 18.0183165
};

app.engine('handlebars', expressHbs());
app.set('view engine', 'handlebars');
app.get('/', async (req, res) => {
  let startTime = req.query.startTime ? moment(req.query.startTime) : moment();
  res.render('trips',
    {
      layout: false,
      trips: await getTrips(startTime, req)
    });
});

app.get('/trips', async (req, res) => {

  let startTime = req.query.startTime ? moment(req.query.startTime) : moment();

  res.json(await getTrips(startTime, req));
});

function getDateAndTime(obj = trip['LegList']['Leg'][1]['Origin']) {
  return {
    date: obj.date,
    time: moment(obj.date + 'T' + obj.time).format('HH:mm')
  };
}

async function getTrips(startTime, req) {

  const lastDepartureTime = startTime.clone().add(1, 'days');
  let output = [];

  const options = {
    uri: API_URL,
    qs: {
      key: key,
      date: startTime.format(('YYYY-MM-DD')),
      time: startTime.format('HH:mm'),
      numF: 6,
      originCoordLat: req.query.hereLat || DEFAULT_HERE.lat,
      originCoordLong: req.query.hereLong || DEFAULT_HERE.long,
      destCoordLat: req.query.homeLat || DEFAULT_HOME.lat,
      destCoordLong: req.query.homeLong || DEFAULT_HOME.long,
      originWalk: '1,0,3000',
      destWalk: '1,0,500',
      format: 'json'
    },
    json: true
  };

  console.log(`Looking for trips starting at ${startTime}`);
  const response = await request(options);

  const trips = response['Trip'];

  output = output.concat(trips
    .filter((trip) => moment(trip['LegList']['Leg'][1]['Origin'].date + 'T' + trip['LegList']['Leg'][1]['Origin'].time)
      .isBefore(lastDepartureTime))
    .map((trip) => ({
        start: getDateAndTime(trip['LegList']['Leg'][1]['Origin']),
        duration: {
          hours: moment.duration(trip.duration).get('hours'),
          minutes: moment.duration(trip.duration).get('minutes')
        },
        legs: trip['LegList']['Leg']
          .filter((leg) => !(leg.type === 'WALK' || leg.type === 'TRSF'))
          .map((leg) => ({
            start: {
              ...getDateAndTime(leg.Origin),
              place: leg.Origin.name
            },
            end: leg.Destination.date + 'T' + leg.Destination.time,
            stops: (leg['Stops'] || {'Stop': []})['Stop']
              .map((stop) => stop.name),
            type: leg.type
          }))
      }
    )));

  return selectTrips(output);
}


module.exports = app;

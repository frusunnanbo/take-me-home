const fs = require('fs');
const express = require('express');
const expressHbs = require('express-handlebars');
const request = require('request-promise-native');
const moment = require('moment');

const app = express();

const key = ('' + fs.readFileSync('key.txt')).trim();

console.log(`Using API key ${key}`);

const DEFAULT_HERE = {
  lat: 57.7824913,
  long: 14.2579982
};

const DEFAULT_HOME = {
  lat: 59.2987134,
  long: 18.0568867
};

app.engine('handlebars', expressHbs());
app.set('view engine', 'handlebars');
app.get('/', async (req, res) => {
  res.render('trips',
    {
      layout: false,
      trips: await getTrips(moment(), req)
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

  while (startTime.isBefore(lastDepartureTime)) {

    const options = {
      uri: 'https://api.resrobot.se/v2/trip',
      qs: {
        key: key,
        date: startTime.format(('YYYY-MM-DD')),
        time: startTime.format('HH:mm'),
        originCoordLat: req.query.hereLat || DEFAULT_HERE.lat,
        originCoordLong: req.query.hereLong || DEFAULT_HERE.long,
        destCoordLat: req.query.homeLat || DEFAULT_HOME.lat,
        destCoordLong: req.query.homeLong || DEFAULT_HOME.long,
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

    output = output.concat(trips
      .filter((trip) => moment(trip['LegList']['Leg'][1]['Origin'].date + 'T' + trip['LegList']['Leg'][1]['Origin'].time)
        .isBefore(lastDepartureTime))
      .map((trip) => ({
          start: getDateAndTime(trip['LegList']['Leg'][1]['Origin']),
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
  }

  const groupedByStartTime = output.reduce((acc, curr) => {
    const currentStart = curr.start.date + 'T' + curr.start.time;
    if (!acc[currentStart]) {
      acc[currentStart] = [];
    }
    acc[currentStart].push(curr);
    return acc;
  }, {});

  return Object.values(groupedByStartTime)
    .map((trips) => {
      trips.sort((trip1, trip2) => moment.duration(trip1.duration).subtract(moment.duration(trip2.duration)));
      return trips[0];
    });
}


module.exports = app;

const fs = require('fs');
const express = require('express');
const expressHbs = require('express-handlebars');
const request = require('request-promise-native');
const moment = require('moment');

const app = express();

const key = ('' + fs.readFileSync('key.txt')).trim();

console.log(`Using API key ${key}`);


app.engine('handlebars', expressHbs());
app.set('view engine', 'handlebars');
app.get('/', async (req, res) => {
  res.render('trips',
    {
      layout: false,
      trips: await getTrips(moment(), req)
    });
});

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

    output = output.concat(trips
      .filter((trip) => moment(trip['LegList']['Leg'][1]['Origin'].date + 'T' + trip['LegList']['Leg'][1]['Origin'].time)
        .isBefore(lastDepartureTime))
      .map((trip) => ({
          start: {
            date: trip['LegList']['Leg'][1]['Origin'].date,
            time: trip['LegList']['Leg'][1]['Origin'].time
          },
          legs: trip['LegList']['Leg']
            .filter((leg) => !(leg.type === 'WALK' || leg.type === 'TRSF'))
            .map((leg) => ({
              start: {
                date: leg.Origin.date,
                time: leg.Origin.time,
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
      trips.sort((trip1, trip2) => trip1.legs.length - trip2.legs.length);
      return trips[0];
    });
}

app.get('/trips', async (req, res) => {

  let startTime = req.query.startTime ? moment(req.query.startTime) : moment();

  res.json(await getTrips(startTime, req));
});

module.exports = app;

const moment = require('moment');

const {selectAndSort} = require('../trips');

describe('The trip-selecting function', () => {

  it('returns an empty list unchanged', () => {
    expect(selectAndSort([])).toBeEmpty();
  });

  it('returns a single element unchanged', () => {
    const trip1 = trip({
      start: '08:30',
      duration: moment.duration(1, 'hour'),
      numberOfLegs: 1
    });

    expect(selectAndSort([trip1])).toEqual([trip1]);
  });

  it('returns two trips with different starttimes unchanged', () => {
    const trip1 = trip({
      start: '08:30',
      duration: moment.duration(1, 'hour'),
      numberOfLegs: 1
    });
    const trip2 = trip({
      start: '09:30',
      duration: moment.duration(1, 'hour'),
      numberOfLegs: 1
    });

    expect(selectAndSort([trip1, trip2])).toEqual([trip1, trip2]);
  });

  it('selects the shortest trip of two with equal starttimes', () => {
    const trip1 = trip({
      start: '08:30',
      duration: moment.duration(2, 'hours'),
      numberOfLegs: 1
    });
    const trip2 = trip({
      start: '08:30',
      duration: moment.duration(1, 'hour'),
      numberOfLegs: 1
    });

    expect(selectAndSort([trip1, trip2])).toEqual([trip2]);
  });

  it('sorts durations correctly with respect to minutes', () => {
    const trip1 = trip({
      start: '08:30',
      duration: moment.duration({hours: 1, minutes: 22}),
      numberOfLegs: 1
    });
    const trip2 = trip({
      start: '08:30',
      duration: moment.duration({hours: 1, minutes: 23}),
      numberOfLegs: 1
    });

    expect(selectAndSort([trip1, trip2])).toEqual([trip1]);
  });

 it('sorts durations correctly with respect to hours', () => {
    const trip1 = trip({
      start: '08:30',
      duration: moment.duration({hours: 2, minutes: 22}),
      numberOfLegs: 1
    });
    const trip2 = trip({
      start: '08:30',
      duration: moment.duration({hours: 1, minutes: 23}),
      numberOfLegs: 1
    });

    expect(selectAndSort([trip1, trip2])).toEqual([trip2]);
  });

  it('does not group a third trip with a different starttime', () => {
    const trip1 = trip({
      start: '08:30',
      duration: moment.duration(2, 'hours'),
      numberOfLegs: 1
    });
    const trip2 = trip({
      start: '08:30',
      duration: moment.duration(1, 'hour'),
      numberOfLegs: 1
    });
    const trip3 = trip({
      start: '09:30',
      duration: moment.duration(2, 'hours'),
      numberOfLegs: 1
    });


    expect(selectAndSort([trip1, trip2, trip3])).toEqual([trip2, trip3]);
  });

});

function trip(properties) {
  return {
    "start": {
      "date": "2019-08-28",
      "time": properties.start || '06:00'
    },
    "duration": {
      "hours": properties.duration ? properties.duration.get('hours') : 1,
      "minutes": properties.duration ? properties.duration.get('minutes') : 2
    },
    "legs": [
      {
        "start": {
          "date": "2019-08-28",
          "time": "12:49",
          "place": "Kungsporten (Jönköping kn)"
        },
        "end": "2019-08-28T13:10:00",
        "stops": [
          "Kungsporten (Jönköping kn)",
          "Kittendorffs gata (Jönköping kn)",
          "Kungsängen (Jönköping kn)",
          "Gullregnsbacken (Jönköping kn)",
          "Resedastigen (Jönköping kn)",
          "Jönköping Ekhagen centrum",
          "Rosenlundsskolan (Jönköping kn)",
          "Hermansplan (Jönköping kn)",
          "Rosenlunds Vårdcentrum (Jönköping kn)",
          "Starrgatan (Jönköping kn)",
          "Jönköping Kilallén",
          "Jönköping Cigarren",
          "Östra torget (Jönköping kn)",
          "Stadsbiblioteket (Jönköping kn)",
          "Jönköping Östra centrum",
          "Jönköping Rådhusparken",
          "Jönköping Juneporten"
        ],
        "type": "JNY"
      },
      {
        "start": {
          "date": "2019-08-28",
          "time": "13:20",
          "place": "Jönköping Centralstation"
        },
        "end": "2019-08-28T18:30:00",
        "stops": [
          "Jönköping Centralstation",
          "Linköping Fjärrbussterminal",
          "Norrköping busstation",
          "Stockholm Cityterminalen"
        ],
        "type": "JNY"
      },
      {
        "start": {
          "date": "2019-08-28",
          "time": "18:51",
          "place": "T-Centralen T-bana (Stockholm kn)"
        },
        "end": "2019-08-28T19:00:00",
        "stops": [
          "T-Centralen T-bana (Stockholm kn)",
          "Gamla Stan T-bana (Stockholm kn)",
          "Slussen T-bana (Stockholm kn)",
          "Medborgarplatsen T-bana (Stockholm kn)",
          "Skanstull T-bana (Stockholm kn)",
          "Gullmarsplan T-bana (Stockholm kn)"
        ],
        "type": "JNY"
      },
      {
        "start": {
          "date": "2019-08-28",
          "time": "19:08",
          "place": "Gullmarsplan T-bana (Stockholm kn)"
        },
        "end": "2019-08-28T19:11:00",
        "stops": [
          "Gullmarsplan T-bana (Stockholm kn)",
          "Sköntorpsplan (Stockholm kn)",
          "Ymsenvägen (Stockholm kn)",
          "Skagersvägen (Stockholm kn)",
          "Vättersvägen (Stockholm kn)",
          "Tämnarvägen (Stockholm kn)"
        ],
        "type": "JNY"
      }
    ]
  };
}

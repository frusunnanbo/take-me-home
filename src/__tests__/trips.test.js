const moment = require('moment');

const {selectAndSort} = require('../trips');

describe('The trip-selecting function', () => {

  it('returns an empty list unchanged', () => {
    expect(selectAndSort([])).toBeEmpty();
  });

  it('returns a single element unchanged', () => {
    const trip1 = trip({
      start: '08:30',
      duration: moment.duration(1, 'hour')
    });

    expect(selectAndSort([trip1])).toEqual([trip1]);
  });

  it('returns two trips with different starttimes unchanged', () => {
    const trip1 = trip({
      start: '08:30',
      duration: moment.duration(1, 'hour')
    });
    const trip2 = trip({
      start: '09:30',
      duration: moment.duration(1, 'hour')
    });

    expect(selectAndSort([trip1, trip2])).toEqual([trip1, trip2]);
  });

  it('selects the trip with least changes of two with equal starttimes', () => {
    const trip1 = trip({
      start: '08:30',
      duration: moment.duration(1, 'hours'),
      legs: [ leg(), leg()]
    });
    const trip2 = trip({
      start: '08:30',
      duration: moment.duration(2, 'hour'),
      legs: [ leg() ]
    });

    expect(selectAndSort([trip1, trip2])).toEqual([trip2]);
  });

  it('does not group a third trip with a different starttime', () => {
    const trip1 = trip({
      start: '08:30',
      duration: moment.duration(2, 'hours'),
      legs: [ leg() ]
    });
    const trip2 = trip({
      start: '08:30',
      duration: moment.duration(1, 'hour'),
      legs: []
    });
    const trip3 = trip({
      start: '09:30',
      duration: moment.duration(2, 'hours')
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
    "legs": properties.legs || []
  };
}

function leg() {
  return {
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
  };
}

const moment = require('moment');

function selectTrips(trips) {
  const groupedByStartTime = trips.reduce((acc, curr) => {
    const currentStart = curr.start.date + 'T' + curr.start.time
    if (!acc[currentStart]) {
      acc[currentStart] = []
    }
    acc[currentStart].push(curr)
    return acc
  }, {})

  return Object.values(groupedByStartTime)
    .map((trips) => {
      trips.sort((trip1, trip2) => moment.duration(trip1.duration).subtract(moment.duration(trip2.duration)))
      return trips[0]
    })
}

module.exports = {
  selectTrips
}

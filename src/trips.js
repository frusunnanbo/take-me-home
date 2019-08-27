const moment = require('moment');

function selectAndSort(trips) {
  const groupedByStartTime = trips.reduce((acc, curr) => {
    const currentStart = curr.start.date + 'T' + curr.start.time;
    if (!acc[currentStart]) {
      acc[currentStart] = [];
    }
    acc[currentStart].push(curr);
    return acc;
  }, {});

  return Object.values(groupedByStartTime)
    .map((withSameStartTime) => {
      withSameStartTime.sort((trip1, trip2) => trip1.legs.length - trip2.legs.length);
      return withSameStartTime[0];
    });
}

module.exports = {
  selectAndSort
};

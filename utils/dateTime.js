function minutesBetween(date1, date2) {
  let ms = date2 - date1;
  return Math.round(ms / 60000);
}

function nextGuideRefresh() {
  let now = new Date();
  let nextRefresh = new Date();

  if (now.getMinutes() < 30) {
    nextRefresh.setMinutes(30, 1, 0);
  } else {
    nextRefresh.setHours(nextRefresh.getHours() + 1, 0, 1, 0);
  }

  return secondsBetween(now, nextRefresh);
}

function secondsBetween(date1, date2) {
  let ms = date2 - date1;
  return Math.round(ms / 1000);
}

export {minutesBetween, nextGuideRefresh, secondsBetween};

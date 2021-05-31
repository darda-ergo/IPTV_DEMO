function formatTime(date) {
  if (date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    // let ampm = 'AM';

    // if (hours === 0) {
    //     hours = 12;
    // } else if (hours >= 12) {
    //     ampm = 'PM';
    //     if (hours > 12) {
    //         hours -= 12;
    //     }
    // }

    return `${hours}:${pad(minutes, 2, '0')}`;
  }

  return '';
}

function formatDateTime(date, t) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  if (date) {
    let weekDay = t(dayNames[date.getDay()]);
    let month = t(monthNames[date.getMonth()]);
    let day = date.getDate();
    let year = date.getYear() + 1900;

    let locale = navigator.language;

    if (locale === 'fr') {
      return `${weekDay} ${day} ${month} ${year} • ${formatTime(date)}`;
    }

    return `${weekDay}, ${month} ${day} ${year} • ${formatTime(date)}`;
  }

  return '';
}

function pad(value, size, padWith) {
  let s = value + '';
  while (s.length < size) {
    s = padWith + s;
  }

  return s;
}

export {formatTime, pad, formatDateTime};

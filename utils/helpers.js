function getURLParameter(parameter) {
  let url = new URL(window.location)

  let params = new URLSearchParams(url.search)

  return params.get(parameter)
}

function roundToNearest(number, roundTo) {
  return roundTo * Math.round(number / roundTo)
}

export { getURLParameter, roundToNearest }

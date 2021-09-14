export function milesecsToMinutes(milisecs) {
  const secondsT = milisecs / 1000;
  let minutes = Math.trunc(secondsT / 60);
  let seconds = Math.trunc(secondsT % 60);

  if (minutes < 10) {
    minutes = '0' + minutes
  }

  if (seconds < 10) {
    seconds = '0' + seconds
  }

  if (minutes === 0) {
    minutes = '00'
  }

  if (seconds === 0) {
    seconds = '00'
  }

  return minutes + ':' + seconds;
}
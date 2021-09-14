export const getFormattedFollowers = (totalFollowers = 0) => {

  if (!totalFollowers) {
    return '';
  }

  if (totalFollowers >= 100000000) {
    return '+' + ('' + totalFollowers).slice(0, 3) + 'M'
  }

  if (totalFollowers >= 10000000 && totalFollowers < 100000000) {
    return '+' + ('' + totalFollowers).slice(0, 2) + 'M'
  }

  if (totalFollowers >= 1000000 && totalFollowers < 10000000) {
    return '+' + ('' + totalFollowers).slice(0, 1) + 'M'
  }

  if (totalFollowers >= 100000 && totalFollowers < 1000000) {
    return '+' + ('' + totalFollowers).slice(0, 3) + 'K'
  }

  if (totalFollowers >= 10000 && totalFollowers < 100000) {
    return '+' + ('' + totalFollowers).slice(0, 2) + 'K'
  }

  if (totalFollowers >= 1000 && totalFollowers < 10000) {
    return '+' + ('' + totalFollowers).slice(0, 1) + 'K'
  }

  return totalFollowers;

}

export default { getFormattedFollowers }
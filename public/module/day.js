export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function formatDate(input) {
  if (input) {
    const date = new Date(input);
    const d = date.getDate();
    const m = date.getMonth() + 1; //Month from 0 to 11
    const y = date.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + String(y).substr(2, 2);
  }
  return '';
}

export function formatDateToString(input) {
  if (input) {
    const options = { month: 'long', day: 'numeric' };
    const date = new Date(input);
    return date.toLocaleDateString('en-US', options);
  }
  return '';
}

export function fullFormatDateToString(input) {
  if (input) {
    const date = new Date(input);
    const datestring = formatDateToString(input) + ', ' + date.getHours() + ':' + date.getMinutes();
    return datestring;
  }
  return '';
}

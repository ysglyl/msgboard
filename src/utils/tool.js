export function max(list, propId) {
  let max = 0;
  for (let data of list) {
    if (data[propId || 'rowId'] > max) {
      max = data[propId || 'rowId'];
    }
  }
  return max;
}

export function min(list, propId) {
  let min = 0;
  for (let data of list) {
    if (min === 0) {
      min = data[propId || 'rowId'];
    }
    if (data[propId || 'rowId'] < min) {
      min = data[propId || 'rowId'];
    }
  }
  return min;
}

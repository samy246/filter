export const padString = (s, length = 2) => {
  while (s.toString().length < length) {
    s = "0" + s;
  }
  return s;
};
export const getDateInFormat = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return padString(year) + padString(month) + day;
};

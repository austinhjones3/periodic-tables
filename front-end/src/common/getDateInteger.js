module.exports = function (date) {
  return Number(`${date.getFullYear()}${date.getDate()}${date.getMonth()}`);
};

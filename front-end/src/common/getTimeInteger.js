module.exports = function (dateObj) {
  return Number(`${dateObj.getUTCHours()}${dateObj.getUTCMinutes()}`);
};

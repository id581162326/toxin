const uniqid = require('uniqid');

module.exports = function (x) {
  return (`${x}-${uniqid()}`);
};
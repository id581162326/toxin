const uniqid = require('uniqid');

module.exports = function addUniqId(x) {
  return (`${x}-${uniqid()}`);
};
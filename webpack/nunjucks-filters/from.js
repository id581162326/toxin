module.exports = function (path) {
  return (require.context('../../src', true)(`./${path}`));
};
const pick = (obj, keys) => {
  return keys.reduce((acc, key) => {
    if (obj && obj[key]) {
      const keys = Object.keys(obj[key]);
      if (keys.length > 1) {
        acc[key] = obj[key];
      }
    }
    return acc;
  }, {});
};

module.exports = pick;

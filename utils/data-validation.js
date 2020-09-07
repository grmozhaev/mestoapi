const InvalidDataError = require('../errors/invalid-data-error');

// eslint-disable-next-line no-unused-vars
const urlValidation = (value, helpers) => {
  const urlRegex = /^((https?):\/\/)?(www\.)?([\w-]+\.){1,}\w+((\/[\w-]+)+)?(\.\w+)?$/g;

  if (!urlRegex.test(value)) {
    throw new InvalidDataError('url is invalid');
  }

  return value;
};

// eslint-disable-next-line no-unused-vars
const passwordValidation = (value, helpers) => {
  const valueSet = new Set(value);

  if (valueSet.size === 1 && valueSet.has(' ')) {
    throw new InvalidDataError('password cannot consist of whitespaces only');
  }

  return value;
};

module.exports = {
  urlValidation,
  passwordValidation,
};

module.exports = (value, helpers) => {
  const urlRegex = /^((https?):\/\/)?(www\.)?([\w-]+\.){1,}\w+((\/[\w-]+)+)?(\.\w+)?$/g;

  if (!urlRegex.test(value)) {
    return helpers.error('Invalid URL');
  }

  return value;
};

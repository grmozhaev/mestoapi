const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/authorization-error');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const { NODE_ENV, JWT_KEY } = process.env;

  let token;
  let payload;

  try {
    if (authorization && authorization.startsWith('Bearer ')) {
      token = authorization.replace('Bearer ', '');
    } else {
      throw new AuthorizationError('Необходима авторизация');
    }

    try {
      payload = jwt.verify(token, (NODE_ENV === 'production' ? JWT_KEY : 'dev-key'));
    } catch (err) {
      next(new AuthorizationError('Неверный токен'));
    }

    req.user = payload;
  } catch (err) {
    next(err);
  }

  next();
};

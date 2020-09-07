const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const NotFoundError = require('../errors/not-found-error');
const ConflictingRequestError = require('../errors/conflicting-request-error');
const DefaultError = require('../errors/default-error');

const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new DefaultError();
      }

      res.send({ data: users });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch(next);
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const entry = await User.findOne({ email });

    if (entry) {
      throw new ConflictingRequestError('Пользователь с таким email уже существует');
    } else {
      const hash = await bcrypt.hash(password, 10);

      const user = await User.create({
        name, about, avatar, email, password: hash,
      });

      res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.updateBio = async (req, res, next) => {
  let name;
  let about;

  try {
    const entry = await User.findById(req.user._id);
    if (entry) {
      name = entry.name;
      about = entry.about;
    } else {
      throw new NotFoundError('Пользователь с таким ID отсутствует');
    }

    const { name: newName = name, about: newAbout = about } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: newName, about: newAbout },
      { new: true, runValidators: true },
    );

    res.send({ data: user });
  } catch (err) {
    next(err);
  }
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('Пользователь с таким ID отсутствует');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_KEY } = process.env;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, (NODE_ENV === 'production' ? JWT_KEY : 'dev-key'), { expiresIn: '7d' });

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch(next);
};

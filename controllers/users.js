const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = async (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!password || password.match(/[\s]+/g)) {
    res.status(400).send({ message: 'Пароль не может быть пустым или состоять из пробелов' });
    return;
  }

  try {
    const entry = await User.findOne({ email });

    if (entry) {
      res.status(409).send({ message: 'Пользователь с таким email уже существует' });
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
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: err.message });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};

module.exports.updateBio = (req, res) => {
  const { about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({ message: 'Пользователь с таким ID отсутствует' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
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
        res.status(404).send({ message: 'Пользователь с таким ID отсутствует' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.login = (req, res) => {
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
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

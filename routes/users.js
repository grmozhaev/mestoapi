const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlValidation = require('../utils/url-validation');

const {
  getUserById, getUsers, updateAvatar, updateBio,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().required().length(24),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateBio);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(urlValidation, 'url validation'),
  }),
}), updateAvatar);

module.exports = router;

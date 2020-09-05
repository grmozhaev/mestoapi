const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserById, getUsers, updateAvatar, updateBio,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().required(),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    about: Joi.string().required(),
  }),
}), updateBio);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
}), updateAvatar);

module.exports = router;

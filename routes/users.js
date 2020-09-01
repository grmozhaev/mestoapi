const router = require('express').Router();
const {
  getUserById, getUsers, updateAvatar, updateBio,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateBio);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;

const router = require('express').Router();
const path = require('path');
const { getData } = require('../utils/getData');

const usersPath = path.join(__dirname, '../data/users.json');

router.get('/users', (req, res) => {
  getData(res, usersPath, (data) => {
    res.send(JSON.parse(data));
  });
});

router.get('/users/:id', (req, res) => {
  getData(res, usersPath, (data) => {
    const { id } = req.params;

    const user = JSON.parse(data).filter((item) => item._id === id);

    if (!user.length) {
      res.status(404).send({ message: 'Нет пользователя с таким id' });
      return;
    }

    res.status(200).send(user);
  });
});

module.exports = router;

const router = require('express').Router();
const path = require('path');
const { getData } = require('../utils/getData');

const cardsPath = path.join(__dirname, '../data/cards.json');

router.get('/cards', (req, res) => {
  getData(res, cardsPath, (data) => {
    res.send(JSON.parse(data));
  });
});

module.exports = router;

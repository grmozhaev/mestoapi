const router = require("express").Router();
const path = require("path");
const fs = require("fs");

const cardsPath = path.join(__dirname, "../data/cards.json");
const cards = JSON.parse(fs.readFileSync(cardsPath));

router.get("/cards", (req, res) => {
  res.send(cards);
});

module.exports = router;

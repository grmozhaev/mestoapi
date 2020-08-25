const router = require("express").Router();
const path = require("path");
const fs = require("fs");

const filePath = path.join(__dirname, "../data/users.json");
const users = JSON.parse(fs.readFileSync(filePath));

router.get("/users", (req, res) => {
  res.send(users);
});

router.get("/users/:id", (req, res) => {
  const { id } = req.params;

  const user = users.filter((item) => item._id === id);

  if (!user.length) {
    res.status(404).send({ message: "Нет пользователя с таким id" });
    return;
  }

  res.status(200).send(user);
});

module.exports = router;

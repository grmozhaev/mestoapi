const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const NotPermittedError = require('../errors/not-permitted-error');
const DefaultError = require('../errors/default-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new DefaultError();
      }

      res.send({ data: cards });
    })
    .catch(next);
  // .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(next);
  // .catch((err) => {
  //   if (err.name === 'ValidationError') {
  //     res.status(400).send({ message: err.message });
  //   } else {
  //     res.status(500).send({ message: err.message });
  //   }
  // });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.deleteOne({ _id: cardId })
    .then((card) => {
      if (card.owner === req.user._id) {
        if (card.n) {
          res.send({ data: card });
        } else {
          throw new NotFoundError('Карточка не найдена');
          // res.status(404).send({ message: 'Карточка не найдена' });
        }
      } else {
        throw new NotPermittedError('Недостаточно прав для совершения операции');
        // res.status(403).send({ message: 'Недостаточно прав для совершения операции' });
      }
    })
    .catch(next);
  // .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError('Карточка не найдена');
        // res.status(404).send({ message: 'Карточка не найдена' });
      }
    })
    .catch(next);
  // .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError('Карточка не найдена');
        // res.status(404).send({ message: 'Карточка не найдена' });
      }
    })
    .catch(next);
  // .catch((err) => res.status(500).send({ message: err.message }));
};

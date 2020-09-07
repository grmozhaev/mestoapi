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
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;

  let owner;

  try {
    const entry = await Card.findById(cardId);
    if (entry) {
      owner = entry.owner;
    } else {
      throw new NotFoundError('Карточка не найдена');
    }

    if (owner.toString() === req.user._id) {
      const card = await Card.deleteOne({ _id: cardId });
      res.send({ data: card });
    } else {
      throw new NotPermittedError('Недостаточно прав для совершения операции');
    }
  } catch (err) {
    next(err);
  }
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
      }
    })
    .catch(next);
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
      }
    })
    .catch(next);
};

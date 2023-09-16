const { Mongoose } = require('mongoose');
const Card = require('../models/card');
const Error400 = require('../errors/Error400');
const Error404 = require('../errors/Error404');
const Error403 = require('../errors/Error403');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send({ card });
    })
    .catch((err) => {
      if (err instanceof Mongoose.Error.ValidationError) {
        return next(new Error400('Некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  function deleteCard() {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        res.send({ card });
      })
      .catch((err) => next(err));
  }

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new Error404('Карточка не найдена'));
      } if (req.user._id === card.owner.toString()) {
        return deleteCard();
      }
      return next(new Error403('Недостаточно прав'));
    })
    .catch((err) => {
      if (err instanceof Mongoose.Error.CastError) {
        return next(new Error400('Некорректные данные'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ card });
      }
      return next(new Error404('Карточка не найдена'));
    })
    .catch((err) => {
      if (err instanceof Mongoose.Error.CastError) {
        return next(new Error400('Некорректные данные'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ card });
      }
      return next(new Error404('Карточка не найдена'));
    })
    .catch((err) => {
      if (err instanceof Mongoose.Error.CastError) {
        return next(new Error400('Некорректные данные'));
      }
      return next(err);
    });
};

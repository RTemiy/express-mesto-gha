const Card = require('../models/card');
const Error400 = require('../errors/Error400');
const Error500 = require('../errors/Error500');
const Error404 = require('../errors/Error404');
const Error403 = require('../errors/Error403');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error400('Некорректные данные'));
      } else {
        next(new Error500('На сервере произошла ошибка'));
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  function deleteCard() {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        res.send({ data: card });
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          next(new Error400('Некорректные данные'));
        } else {
          next(new Error500('На сервере произошла ошибка'));
        }
      });
  }

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new Error404('Карточка не найдена'));
      } if (req.user._id === card.owner.toString()) {
        return deleteCard();
      }
      return next(new Error403('Недостаточно прав'));
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
        res.send({ data: card });
      } else {
        next(new Error404('Карточка не найдена'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error400('Некорректные данные'));
      } else {
        next(new Error500('На сервере произошла ошибка'));
      }
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
        res.send({ data: card });
      } else {
        next(new Error404('Карточка не найдена'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error400('Некорректные данные'));
      } else {
        next(new Error500('На сервере произошла ошибка'));
      }
    });
};

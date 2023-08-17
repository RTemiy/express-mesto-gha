const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name,link } = req.body;
  Card.create({ name,link })
    .then(card => {
      return res.send({ data: card });
    })
    .catch((err) => {
      if(err.name === 'ValidationError'){
        res.status(400).send({message: 'Некорректные данные'})
      } else {
        res.status(500).send({message: err.message})
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.user._id)
    .then((card) => {
      card && res.send({data: card});
      !card && res.status(404).send({message : 'Карточка не найдена'})
    })
    .catch(err => res.status(500).send({message: err.message}));
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      card && res.send({data: card});
      !card && res.status(404).send({message : 'Карточка не найдена'})
    })
    .catch(err => res.status(500).send({message: err.message}));
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
  req.user._id,
  { $pull: { likes: req.user._id } },
  { new: true },
)
    .then((card) => {
      card && res.send({data: card});
      !card && res.status(404).send({message : 'Карточка не найдена'})
    })
    .catch(err => res.status(500).send({message: err.message}));
}
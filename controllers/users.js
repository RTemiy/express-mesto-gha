const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const User = require('../models/user');
const SECRET_KEY = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, password, email,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, password: hash, email,
      })
        .then((user) => res.send({
          name, about, avatar, email, _id: user._id,
        }))
        .catch((err) => {
          if (err.code === 11000) {
            res.status(409).send({ message: 'Уже существует' });
          } else if (err.name === 'ValidationError') {
            res.status(400).send({ message: 'Некорректные данные' });
          } else {
            res.status(500).send({ message: 'На сервере произошла ошибка' });
          }
        });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const { _id } = user;
      const token = sign(
        { _id },
        SECRET_KEY,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, { maxAge: 36000, httpOnly: true });
      return res.send({ _id: token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getMyself = (req, res) => {
  const { _id } = req.user;
  User.find({ _id })
    .then((user) => {
      if (user) {
        return res.send(...user);
      }
      return res.status(404).send({ message: 'Пользователь не найден' });
    });
};

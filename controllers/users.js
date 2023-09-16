const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { Mongoose } = require('mongoose');
const User = require('../models/user');
const Error409 = require('../errors/Error409');
const Error400 = require('../errors/Error400');
const Error404 = require('../errors/Error404');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      return next(new Error404('Пользователь не найден'));
    })
    .catch((err) => {
      if (err instanceof Mongoose.Error.CastError) {
        return next(new Error400('Некорректные данные'));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, password, email,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, password: hash, email,
      })
        .then((user) => res.status(201).send({
          name, about, avatar, email, _id: user._id,
        }))
        .catch((err) => {
          if (err.code === 11000) {
            return next(new Error409('Пользователь уже существует'));
          } if (err instanceof Mongoose.Error.ValidationError) {
            return next(new Error400('Некорректные данные'));
          }
          return next(err);
        });
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      return next(new Error404('Пользователь не найден'));
    })
    .catch((err) => {
      if (err instanceof Mongoose.Error.ValidationError) {
        return next(new Error400('Некорректные данные'));
      }
      return next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      return next(new Error404('Пользователь не найден'));
    })
    .catch((err) => {
      if (err instanceof Mongoose.Error.ValidationError) {
        return next(new Error400('Некорректные данные'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = sign(
        { _id: user._id },
        process.env.SECRET_KEY,
        { expiresIn: '7d' },
      );
      return res.send({ _id: token });
    })
    .catch((err) => next(err));
};

module.exports.getMyself = (req, res, next) => {
  const { _id } = req.user;
  User.find({ _id })
    .then((user) => {
      if (user) {
        return res.send(...user);
      }
      return next(new Error404('Пользователь не найден'));
    })
    .catch((err) => next(err));
};

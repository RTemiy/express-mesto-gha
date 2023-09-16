const mongoose = require('mongoose');
const checkEmail = require('validator/lib/isEmail');
const { compare } = require('bcrypt');
const { URL_REGEXP } = require('../utils/constants');
const Error401 = require('../errors/Error401');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => { URL_REGEXP.test(url); },
      message: 'Необходим валидный URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => { checkEmail(email); },
      message: 'Некорректный E-mail',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      return Promise.reject(new Error401('Неправильные почта или пароль'));
    }
    return compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return Promise.reject(new Error401('Неправильные почта или пароль'));
        }
        return user;
      });
  });
};

module.exports = mongoose.model('user', userSchema);

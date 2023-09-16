const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, updateUserInfo, updateUserAvatar, getMyself,
} = require('../controllers/users');
const { URL_REGEXP } = require('../utils/constants');

router.get('/', getUsers);

router.get('/me', getMyself);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string().required()
      .pattern(URL_REGEXP).required(),
  }),
}), updateUserAvatar);

module.exports = router;

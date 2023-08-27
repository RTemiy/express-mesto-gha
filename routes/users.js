const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, updateUserInfo, updateUserAvatar, getMyself,
} = require('../controllers/users');
const { AVATAR_REGEX } = require('../utils/constants');

router.get('/', getUsers);

router.get('/me', getMyself);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .pattern(AVATAR_REGEX),
  }),
}), updateUserAvatar);

module.exports = router;

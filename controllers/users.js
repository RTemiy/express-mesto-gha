const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name,about,avatar } = req.body;
  User.create({ name,about,avatar })
    .then(user => {
      return res.status(201).send({ data: user });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.updateUserInfo = (req, res) => {
  const { name,about } = req.body;
  User.findByIdAndUpdate(
    req.params._id,
    {name, about},
    {new: true, runValidators: true }
  )
    .then(user => {
      return res.status(201).send({ data: user });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.params._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then(user => {
      return res.status(201).send({ data: user });
    })
    .catch(err => res.status(500).send({ message: err.message }));
};
const express = require('express');
const { mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.post('/signin', login);
app.post('/signup', createUser);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Страница не существует' });
});

app.listen(PORT, () => {});

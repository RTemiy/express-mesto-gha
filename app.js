const express = require('express');
const {mongoose} = require('mongoose');
const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require('body-parser');


mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).catch(err => console.log(err));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133'
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log('Server`s listening');
});
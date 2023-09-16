const express = require('express');
const { mongoose } = require('mongoose');
require('cookie-parser');
require('helmet');
require('dotenv').config();

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {});

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
    _id: '64de08220015a4c4dcc50e9e'
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req,res)=>{
  res.status(404).send({message : 'Страница не существует'})
})

app.listen(PORT, () => {
  console.log('Server`s listening');
});
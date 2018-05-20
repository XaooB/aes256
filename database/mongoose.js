const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let connection = mongoose.connect('mongodb://xaoo:xaoo123@ds129540.mlab.com:29540/bskpassproject');

connection.then(() => {
  console.log('Connected to database');
}, (err) => {
  throw new Error('Problems during connecting to database!');
});

module.exports = {mongoose: mongoose};

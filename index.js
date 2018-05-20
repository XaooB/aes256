const express = require('express'),
      PORT = process.env.PORT || 3000,
      app = express(),
      path = require('path'),
      bodyParser = require('body-parser'),
      aes256 = require('./aes256gcm.js'),
      //database models
      mongoose = require('./database/mongoose'),
      { User } = require('./models/user');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req, res) => {
  // let string = 'qwerty123',
  //     encryptedString = aes256.encrypt(string, '542476@asd21'),
  //     decryptedString = aes256.decrypt(encryptedString, '542476@asd21')
  // res.json({
  //     toBeEncrypted: string,
  //     encryptedString: encryptedString,
  //     decryptedString: decryptedString
  // });
  res.sendFile(path.join(__dirname + '/index.html'));
});

//rejestracja
app.post('/register', (req, res) => {
  let login = req.body.login,
      password = String(req.body.pasword),
      encryptedPassword = aes256.encrypt(password, '542476@asd21');

   let  newUser = User({
        username: login,
        password: encryptedPassword
      }).save().then((data) => {
        console.log('User saved into database: \n', data);
      })
      res.send('Zarejestrowano pomyślnie!');
});


//logowanie
app.post('/login', (req, res) => {
  let username = req.body.login,
      password = String(req.body.password);

  User.findOne({
    username: username.toLowerCase().trim()
  }).then((user) => {
    console.log(user);
    let  decryptedPassword = aes256.decrypt(String(user.password), '542476@asd21');
    if(decryptedPassword === password) {
      res.json({
        "Success": "Użytkownik został zalogowany pomyślnie."
      })
    }
  }).catch((err) => {
    res.json({
      "Error:": "Brak użytkownika w bazie danych."
    })
  })
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});

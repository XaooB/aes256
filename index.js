const express = require('express');
const PORT = 3000 || process.env.PORT;
const app = express();

const aes256 = require('./aes256gcm.js');

app.get('/', (req, res) => {
  let string = 'password',
      encryptedString = aes256.encrypt(string, '542476@asd21'),
      decryptedString = aes256.decrypt(encryptedString, '542476@asd21')
  res.json({
      toBeEncrypted: string,
      encryptedString: encryptedString,
      decryptedString: decryptedString
  });
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});

const crypto = require('crypto');
module.exports = {
    encrypt: function (text, masterkey){
        const iv = crypto.randomBytes(16),
              salt = crypto.randomBytes(64),
              // derive key: 32 byte key length - in assumption the masterkey is a cryptographic and NOT a password there is no need for
              // a large number of iterations. It may can replaced by HKDF
              key = crypto.pbkdf2Sync(masterkey, salt, 2145, 32, 'sha512'),
              // AES 256 GCM Mode
              cipher = crypto.createCipheriv('aes-256-gcm', key, iv),
              // encrypt the given text
              encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]),
              // extract the auth tag
              tag = cipher.getAuthTag();

        return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
    },
    decrypt: function (data, masterkey){
        // base64 decoding
        const bData = Buffer.from(data, 'base64'),
        // convert data to buffers
              salt = bData.slice(0, 64),
              iv = bData.slice(64, 80),
              tag = bData.slice(80, 96),
              text = bData.slice(96),
              // derive key using; 32 byte key length
              key = crypto.pbkdf2Sync(masterkey, salt , 2145, 32, 'sha512'),
              // AES 256 GCM Mode and Tag
              decipher = crypto.createDecipheriv('aes-256-gcm', key, iv).setAuthTag(tag);

        // decrypt the given text
        return decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');
    }
};

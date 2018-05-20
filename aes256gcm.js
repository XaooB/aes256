const crypto = require('crypto');
module.exports = {
    encrypt: function (text, masterkey){
        const iv = crypto.randomBytes(16),
              salt = crypto.randomBytes(64),
              key = crypto.pbkdf2Sync(masterkey, salt, 2145, 32, 'sha512'),
              cipher = crypto.createCipheriv('aes-256-gcm', key, iv),
              encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]),
              tag = cipher.getAuthTag();

        return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
    },
    decrypt: function (data, masterkey) {
        const bData = Buffer.from(data, 'base64'),
              salt = bData.slice(0, 64),
              iv = bData.slice(64, 80),
              tag = bData.slice(80, 96),
              text = bData.slice(96),
              key = crypto.pbkdf2Sync(masterkey, salt , 2145, 32, 'sha512'),
              decipher = crypto.createDecipheriv('aes-256-gcm', key, iv).setAuthTag(tag);

        return decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');
    }
};

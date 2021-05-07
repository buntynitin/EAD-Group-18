const Cryptr = require('cryptr')
const cryptrSalt = new Cryptr(process.env.ENCRYPTION_KEY)

const decryption = (toBe) => cryptrSalt.decrypt(toBe);

module.exports.decryption = decryption;
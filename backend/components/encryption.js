const Cryptr = require('cryptr')
const cryptrSalt = new Cryptr(process.env.ENCRYPTION_KEY)

const encryption = (toBe) => cryptrSalt.encrypt(toBe);

module.exports.encryption = encryption;
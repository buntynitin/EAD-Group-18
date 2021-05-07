import Cryptr from 'cryptr'
const cryptr = new Cryptr('7388124525')

export const encryption = (toBe) => cryptr.encrypt(toBe)
export const decryption = (toBe) => cryptr.decrypt(toBe)
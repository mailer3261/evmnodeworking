const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey()
console.log('Private Key:- ',toHex(privateKey))

const publicKey = secp.getPublicKey(privateKey)
console.log('Public Key:- ',toHex(publicKey))

const address = keccak256(publicKey.slice(1)).slice(-20);
console.log('address:-', '0x'+toHex(address))

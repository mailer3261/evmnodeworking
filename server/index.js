const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "0xd9d48043724101e3324435d24456d7e5d7366882": 100,
  "0x65996395ff789b7118b4930738fb94413a8599e4": 50,
  "0x51fc264a88a68c8f13beec4c7513b2edfdf2ae07": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount,txSignature,hashedData,recoveryBit } = req.body;
  const pubkey =  secp.recoverPublicKey(hashedData,txSignature,recoveryBit)
  console.log(secp.utils.bytesToHex(keccak256(pubkey.slice(1)).slice(-20)))
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

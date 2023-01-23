import { useState } from "react";
import server from "./server";
import {sign} from "ethereum-cryptography/secp256k1"
import {keccak256} from "ethereum-cryptography/keccak"
import {toHex,utf8ToBytes} from "ethereum-cryptography/utils"


function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const PRIVATE_KEY = "edc0702eedc22db1e097ace67164d889e283ef7201a804dceb340aa1a7ed0ac0";

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const hashedData =  keccak256(utf8ToBytes(`receiver: ${recipient}, value: ${sendAmount}`))
    console.log((hashedData))
    const txSignature=  await sign(hashedData,PRIVATE_KEY,{ recovered: true })
    console.log(toHex(txSignature[0]))
    try {
      
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        txSignature:toHex(txSignature[0]),
        recoveryBit: txSignature[1],
        hashedData: toHex(hashedData)
      });
     
      
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>
      <label>
        Private Key
        <input
          placeholder="Type Your Private Key"
          value={privateKey}
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

    

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

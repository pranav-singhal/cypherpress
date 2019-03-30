import axios from "axios";
let url = "http://localhost:5000";

// Updated according to new flask server
/*
    Function to generate Key Pairs from PyUmbral Library
    @return {object} : obj = {
                                alicePrivateKey,
                                alicePublicKey,
                                aliceSigningKey,
                                aliceVerifyingKey,
                                aliceSigner
                           }
 */
async function generateKeyPairs(_username, _password) {
  if (_password.length < 16) {
    console.log("Password should be more than 16 characters");
    return null;
  }

  let content = await axios.post(url + "/generateKeys", {
    username: _username,
    password: _password
  });

  content = content.data;
  return {
    aliceKey: content.alice,
    bobKey: content.bob
  };
}

// Updated according to new flask server
/*
    Function to encrypt ipfs hash using pyUmbral
    @param {string} _hash : ipfs hash of the data uploaded
    @param {string} _alicePublicKey
    @return {object} : obj = {
                                cipherText,
                                capsule
                                }
 */
async function encryptData(_username, _password, _hash, _aliceKey, _label) {
  let content = await axios.post(url + "/encryptData", {
    username: _username,
    password: _password,
    hash: _hash,
    alice: _aliceKey,
    label: _label
  });
  content = content.data;
  return {
    messageKit: content.message,
    label: content.label,
    policyPubKey: content.policy_public_key,
    aliceSigKey: content.alice_sig_pubkey,
    dataSource: content.data_source
  };
}

// Updated according to new flask server
/*
    Function to create a new Policy using pyUmbral
    @param {string} _alicePrivateKey
    @param {string} _aliceSigner
    @param {string} _bobPublicKey
    @return {string} policyId of the delegation
*/
async function createPolicy(_password, _bobName, _aliceKeys, _label) {
  let content = await axios.post(url + "/createPolicy", {
    password: _password,
    bob: _bobName,
    alice: _aliceKeys,
    label: _label
  });
  console.log("content:", content);
  return {
    done: true
  };
}

export async function getContractAddress(dappName) {
  let contractAddress = await axios.post(url + "/getContractAddress", {
    dappName: dappName
  });
  return contractAddress.data;
}
export async function setClientJson(dappName, clientJson) {
  await axios.post(url + "/setClientJson", {
    dappName: dappName,
    clientJson: JSON.stringify(clientJson)
  });
}
export async function getClientJson(dappName) {
  const res = await axios.post(url + "/getClientJson", {
    dappName: dappName
  });
  console.log("Res", res);
  return res.data;
}

// Updated according to new flask server
/*
    Function to decrypt uploaded Document
    @param {string} _cipherText
    @param {string} _capsule
    @param {string} _alicePrivateKey
    @return {string} hash : ipfs hash of the document to be fetched
 */
async function decryptDocument(
  _bobKeys,
  _policyPubKey,
  _aliceSigKey,
  _label,
  _messageKit,
  _data_source
) {
  let content = await axios.post(url + "/decryptDelegated", {
    bobKeys: _bobKeys,
    policy_public_key: _policyPubKey,
    alice_sig_pubkey: _aliceSigKey,
    label: _label,
    message: _messageKit,
    data_source: _data_source
  });
  return {
    hash: content.data
  };
}

/*
    Function to decrypt deligated document
    @param {string} _alicePublicKey
    @param {string} _aliceVerifyKey
    @param {string} _bobPublicKey
    @param {string} _bobPrivateKey
    @param {string} _capsule
    @param {string} _cipherText
    @param {string} _policyId
    @return {string} hash : ipfs hash of the document to be fetched
 */
/*
async function decryptDeligatedDocument(
  _alicePublicKey,
  _aliceVerifyKey,
  _bobPublicKey,
  _bobPrivateKey,
  _capsule,
  _cipherText,
  _policyId
) {
  let content = await axios.post(url + "/decryptDelegated", {
    alices_public_key: _alicePublicKey,
    alices_verifying_key: _aliceVerifyKey,
    bobs_public_key: _bobPublicKey,
    bobs_private_key: _bobPrivateKey,
    capsule: _capsule,
    cipherText: _cipherText,
    policyId: _policyId - 1 + 1
  });
  // content = content.data;
  return {
    hash: content.data
  };
}
*/
// async function testing() {
//     console.log(await encryptData('hello 1111', 'A9/F09ny8rzKFP5vutqJgddo83M0rqsZST4hd+D9cTXA'));
//     console.log(await createPolicy('XzCwNou8Q0oS3ZyO84UUcYfeEnFECqYRR0nLFfZ9ei8=', 'WKcxN1Jh/Lu42hDN70tm4Qq/vtxiajaGAbc4vJvOF34=', 'Ak70lJFy656wf0SY9ddAKqdn4acxaDODYSrHVrqRxLLs'))
//     console.log(await decryptDeligatedDocument('A9/F09ny8rzKFP5vutqJgddo83M0rqsZST4hd+D9cTXA',
//         'A7rnudBcIBl25BGZP2xQusHIzLnS8qWHN0/HHKIa+ru7',
//         'Ak70lJFy656wf0SY9ddAKqdn4acxaDODYSrHVrqRxLLs',
//         'xLF5mpOfyhH1Sy8HbX0Bfl5oUN6oUTwNwH8hpNWWgxo=',
//         'A9eVFHE1Q/PEJbgpu4jfZ50x1tmaIjlPZvibTI5zleZlAg7b/v4aYp8NuoQLD859UfLoXzNG/ki/pYoYsmY4glGeWXB++UWEGRgEoUj6mSlS4KT+TS9ce7Pld8EknHe5NZs=',
//         'jfvOMVOGDZgV46csFEoCfa4th10wjA5QGWPpLf1MTCYMliYnbg==',
//         0))
// }
//
// testing();

export { generateKeyPairs, encryptData, decryptDocument, createPolicy };

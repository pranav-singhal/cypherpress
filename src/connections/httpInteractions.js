import axios from "axios";
let url = "http://172.16.4.90:5000";
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
async function generateKeyPairs() {
  let content = await axios.get(url + "/generateKeys");
  content = content.data;
  return {
    alicePrivateKey: content.alicePrivate,
    alicePublicKey: content.alicePublic,
    aliceSigningKey: content.aliceSigning,
    aliceVerifyingKey: content.aliceVerifying
  };
}

/*
    Function to encrypt ipfs hash using pyUmbral
    @param {string} _hash : ipfs hash of the data uploaded
    @param {string} _alicePublicKey
    @return {object} : obj = {
                                cipherText,
                                capsule
                                }
 */
async function encryptData(_hash, _alicePublicKey) {
  let content = await axios.post(url + "/encryptData", {
    alices_public_key: _alicePublicKey,
    hash: _hash
  });
  content = content.data;
  return {
    cipherText: content.cipherText,
    capsule: content.capsule
  };
}

/*
    Function to create a new Policy using pyUmbral
    @param {string} _alicePrivateKey
    @param {string} _aliceSigner
    @param {string} _bobPublicKey
    @return {string} policyId of the delegation
*/
async function createPolicy(_alicePrivateKey, _aliceSigningKey, _bobPublicKey) {
  let content = await axios.post(url + "/createPolicy", {
    alices_private_key: _alicePrivateKey,
    alices_signing_key: _aliceSigningKey,
    bobs_public_key: _bobPublicKey
  });
  return {
    policyId: content.data
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
/*
    Function to decrypt uploaded Document
    @param {string} _cipherText
    @param {string} _capsule
    @param {string} _alicePrivateKey
    @return {string} hash : ipfs hash of the document to be fetched
 */
async function decryptUploadedDocument(
  _cipherText,
  _capsule,
  _alicePrivateKey
) {
  let content = await axios.post(url + "/decryptUploaded", {
    alices_private_key: _alicePrivateKey,
    capsule: _capsule,
    cipherText: _cipherText
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
    policyId: _policyId
  });
  // content = content.data;
  return {
    hash: content.data
  };
}

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

export {
  generateKeyPairs,
  encryptData,
  decryptDeligatedDocument,
  decryptUploadedDocument,
  createPolicy
};

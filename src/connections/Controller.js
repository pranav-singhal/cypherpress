import {
  createPolicy,
  decryptDeligatedDocument,
  decryptDocument,
  decryptUploadedDocument,
  encryptData,
  generateKeyPairs
} from "./httpInteractions";
import {
  checkUsernameWeb3,
  connectToContract,
  deligateDocument,
  getDelegateePublicKey,
  getDeligatedDocumentIds,
  getDeligatedDocumentInfo,
  getUploadedDocumentIds,
  getUploadedDocumentInfo,
  signInUser,
  uploadADocument,
  isDeligatee,
  getNumberOfDeligatee,
  getDelegteeUsername,
  getDocumentInfo
} from "./web3Interactions";
import {
  connectNode,
  getData,
  getMessageKit,
  handleUpload,
  uploadMessageKit
} from "./ipfsInteractions";

export async function doConnections(_contractAddress) {
  console.log("inside doConnections");
  console.log("contract address:", _contractAddress);
  await connectToContract(_contractAddress);
  console.log("middle of doConnections");
  await connectNode();
  console.log("end of doConnections");
}

// TODO Updated to be Checked
export async function checkUsernameAvailability(_username) {
  return await checkUsernameWeb3(_username);
}

// TODO Written To Be Checked
export async function signUpAndGetNucypherKeys(
  _username,
  _aliceEthereumPrivateKey,
  _password,
  _callingObject
) {
  /* let rv = await generateKeyPairs();
  await signInUser(
    _username,
    _aliceEthereumPrivateKey,
    rv.alicePublicKey,
    _callingObject
  );
  return rv;*/

  // Generating keys for nucypher
  let rv = await generateKeyPairs(_username, _password);

  // Storing username to contract
  await signInUser(_username, _aliceEthereumPrivateKey, _callingObject);

  return rv;
}

// TODO Updated To be Checked
export async function uploadDocument(
  _array,
  _uploader,
  _password,
  _aliceKey,
  _label,
  _ethereumPrivateKey,
  _callingObject
) {
  /*
  // Uploading the array of data to ipfs and fetch the hash
  let hash = await handleUpload(_array);

  // Now send this hash to be encrypted using pyUmbral
  let { cipherText, capsule } = await encryptData(hash, _alicePublicKey);

  // Send a transaction to contract to store all the information
  await uploadADocument(
    cipherText,
    capsule,
    _aliceVerifyKey,
    _alicePublicKey,
    _uploader,
    _aliceEthereumPrivateKey,
    _callingObject
  );
*/

  // Encrypting data using Nucypher Devnet

  let {
    messageKit,
    label,
    policyPubKey,
    aliceSigKey,
    dataSource
  } = await encryptData(_uploader, _password, _aliceKey, _label, _array);

  // Store message kit to ipfs

  let path = await uploadMessageKit(messageKit);

  // Store ipfs hash and everything to contract

  await uploadADocument(
    path,
    dataSource,
    _label,
    policyPubKey,
    aliceSigKey,
    _uploader,
    _ethereumPrivateKey,
    _callingObject
  );
}

//TODO Updated to be Checked
export async function grantDocumentAccess(
  _password,
  _bobName,
  _aliceName,
  _aliceKeys,
  _label,
  _documentId,
  _aliceEthereumPrivateKey,
  _callingObject
) {
  /*// Fetch Bob's Public Key
  let bobPublicKey = await getDelegateePublicKey(_deligatee);

  // Generate a policy on the nucypherNetwork
  let policyId = await createPolicy(
    _alicePrivateKey,
    _aliceSigningKey,
    bobPublicKey
  );

  // Update the contract regarding delegation
  await deligateDocument(
    _documentId,
    policyId,
    _deligatee,
    _uploader,
    _aliceEthereumPrivateKey,
    _callingObject
  );
  */

  // Add bob to the policy on nucypher
  await createPolicy(_password, _bobName, _aliceKeys, _label);

  // Update contract for Document deligated
  deligateDocument(
    _documentId,
    _bobName,
    _aliceName,
    _aliceEthereumPrivateKey,
    _callingObject
  );
}

// TODO to be done later...
export async function fetchUploadedDocuments(
  _uploader,
  _aliceEthereumPrivateKey,
  _alicePrivateKey,
  _requestedObject,
  _documentUploadedCallback
) {
  // Fetch the list of documents uploaded by the _uploader
//   console.log("inside fetchUploadedDocuments");
//   let arr = await getUploadedDocumentIds(_uploader, _aliceEthereumPrivateKey);
//   console.log("arr", arr);
//   for (let i = 0; i < arr.length; i++) {
//     // Fetch information regarding the document
//     let {
//       cipherText,
//       capsule,
//       verifyKey,
//       publicKey
//     } = await getUploadedDocumentInfo(arr[i], _aliceEthereumPrivateKey);
//
//     // Use this info to generate the ipfs hash
//     let ipfsHash = await decryptUploadedDocument(
//       cipherText,
//       capsule,
//       _alicePrivateKey
//     );
//     console.log("ipfshash", ipfsHash);
//
//     // Fetch data using generated ipfs hash
//     let dataArray = await getData(ipfsHash, _requestedObject);
//     console.log(dataArray);
//     _documentUploadedCallback(dataArray, arr[i]);
//   }
 }

// TODO Updated to be checked
export async function fetchDelegatedDouments(
  _deligatee,
  _aliceEthereumPrivateKey,
  _bobKeys,
  _requestedObject,
  _documentUploadedCallback
) {
  // Fetch the list of documents deligated to the _deligatee
  console.log("inside fetchDelegatedDouments");
  let arr = await getDeligatedDocumentIds(_deligatee, _aliceEthereumPrivateKey);
  console.log("arr:", arr);
  for (let i = 0; i < arr.length; i++) {
    /*
    // Fetch information regarding the document

    let {
      cipherText,
      capsule,
      verifyKey,
      publicKey,
      policyId
    } = await getDeligatedDocumentInfo(
      arr[i],
      _deligatee,
      _aliceEthereumPrivateKey
    );

    // Use this info to generate the ipfs hash
    let ipfsHash = await decryptDeligatedDocument(
      publicKey,
      verifyKey,
      _alicePublicKey,
      _alicePrivateKey,
      capsule,
      cipherText,
      policyId
    );
    console.log("ipfs sfd", ipfsHash);
    // Fetch data using generated ipfs hash
    let dataArray = await getData(ipfsHash, _requestedObject);
    console.log("dataArray is awesome", dataArray);
    _documentUploadedCallback(dataArray);*/

    let currentDocumentId = arr[i];
    let {
      ipfsPath,
      dataSource,
      label,
      aliceSigKey,
      policyPubKey,
      alice
    } = await getDocumentInfo(currentDocumentId, _aliceEthereumPrivateKey);

    let messageKit = await getMessageKit(ipfsPath);

    let obj = await decryptDocument(
      _bobKeys,
      policyPubKey,
      aliceSigKey,
      label,
      messageKit,
      dataSource,
      _requestedObject
    );

    _documentUploadedCallback(obj);
  }
}

export async function getDelegatees() {
  let usernames = [];
  let number = await getNumberOfDeligatee();
  for (let i = 0; i < number; i++) {
    let username = await getDelegteeUsername(i);
    usernames.push(username);
  }
  return usernames;
}

export async function isDelegatee(_documentId, _delegatee) {
  return await isDeligatee(_documentId, _delegatee);
}

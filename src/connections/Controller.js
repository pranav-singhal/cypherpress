import {
  createPolicy,
  decryptDeligatedDocument,
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
  uploadADocument
} from "./web3Interactions";
import { connectNode, getData, handleUpload } from "./ipfsInteractions";

export async function doConnections(_contractAddress) {
  await connectToContract(_contractAddress);
  await connectNode();
}

export async function checkUsernameAvailability(_username) {
  return await checkUsernameWeb3(_username);
}

export async function signUpAndGetNucypherKeys(
  _username,
  _aliceEthereumPrivateKey,
  _callingObject
) {
  let rv = await generateKeyPairs();
  await signInUser(
    _username,
    _aliceEthereumPrivateKey,
    rv.alicePublicKey,
    _callingObject
  );
  return rv;
}

async function uploadDocument(
  _array,
  _privateKey,
  _uploader,
  _alicePublicKey,
  _aliceEthereumPrivateKey,
  _aliceVerifyKey,
  _callingObject
) {
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
}

async function grantDocumentAccess(
  _documentId,
  _alicePrivateKey,
  _aliceSigningKey,
  _deligatee,
  _uploader,
  _aliceEthereumPrivateKey,
  _callingObject
) {
  // Fetch Bob's Public Key
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
}

async function fetchUploadedDocuments(
  _uploader,
  _aliceEthereumPrivateKey,
  _alicePrivateKey,
  _requestedObject,
  _documentUploadedCallback
) {
  // Fetch the list of documents uploaded by the _uploader
  let arr = await getUploadedDocumentIds(_uploader, _aliceEthereumPrivateKey);

  for (let i = 0; i < arr.length; i++) {
    // Fetch information regarding the document
    let {
      cipherText,
      capsule,
      verifyKey,
      publicKey
    } = await getUploadedDocumentInfo(arr[i], _aliceEthereumPrivateKey);

    // Use this info to generate the ipfs hash
    let ipfsHash = await decryptUploadedDocument(
      cipherText,
      capsule,
      _alicePrivateKey
    );

    // Fetch data using generated ipfs hash
    let dataArray = await getData(ipfsHash, _requestedObject);
    _documentUploadedCallback(dataArray);
  }
}

async function fetchDelegatedDouments(
  _deligatee,
  _aliceEthereumPrivateKey,
  _alicePublicKey,
  _alicePrivateKey,
  _requestedObject,
  _documentUploadedCallback
) {
  // Fetch the list of documents deligated to the _deligatee
  let arr = await getDeligatedDocumentIds(_deligatee, _aliceEthereumPrivateKey);

  for (let i = 0; i < arr.length; i++) {
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

    // Fetch data using generated ipfs hash
    let dataArray = await getData(ipfsHash, _requestedObject);
    _documentUploadedCallback(dataArray);
  }
}

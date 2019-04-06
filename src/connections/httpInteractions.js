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
async function encryptData(_username, _password, _aliceKey, _label, _array) {
  let form = new FormData();
  let files = 0;
  let texts = 0;
  let fileNames = {};
  let textFields = {};
  for (let i = 0; i < _array.length; i++) {
    let element = _array[i];
    console.log(element);
    if (element.isFile === true) {
      let fileBuffer = element.value;

      form.append(files.toString(), fileBuffer);
      // console.log(fileBuffer)
      fileNames[files.toString()] = element.name;
      files++;
    } else {
      textFields[element.name] = element.value;
      texts++;
    }
  }
  console.log(fileNames);
  console.log("textFields", textFields);

  form.append("fileFieldCount", files.toString());
  form.append("textFieldCount", texts.toString());
  form.append("fileNames", JSON.stringify(fileNames));
  form.append("textFields", JSON.stringify(textFields));
  form.append("username", _username);
  form.append("password", _password);
  form.append("alice", _aliceKey);
  form.append("label", _label);
  console.log(form);

  let content = await axios.post(url + "/encryptData", form, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
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
  _data_source,
  _requestedObject
) {
  // creating Request Object
  let numFiles = 0;
  let fileNames = [];
  let numText = 0;
  let textNames = [];
  for (let i = 0; i < _requestedObject.length; i++) {
    let curr = _requestedObject[i];
    if (curr.isFile) {
      numFiles++;
      fileNames.push(curr.name);
    } else {
      numText++;
      textNames.push(curr.name);
    }
  }

  let content = await axios.post(url + "/decryptDelegated", {
    bobKeys: _bobKeys,
    policy_public_key: _policyPubKey,
    alice_sig_pubkey: _aliceSigKey,
    label: _label,
    message: _messageKit,
    data_source: _data_source,
    fileFieldCount: numFiles,
    textFieldCount: numText,
    filesKeys: fileNames,
    textkeys: textNames
  });
  content = content.data;
  let dataArrayToBeReturned = [];
  for (let i = 0; i < _requestedObject.length; i++) {
    if (_requestedObject[i].isFile === true) {
      let url = content.files[_requestedObject[i].name];
      let objToBePushed = {
        isFile: true,
        name: _requestedObject[i].name,
        value: url
      };
      dataArrayToBeReturned.push(objToBePushed);
    } else {
      let objToBePushed = {
        isFile: false,
        name: _requestedObject[i].name,
        value: content.textFields[_requestedObject[i].name]
      };
      dataArrayToBeReturned.push(objToBePushed);
    }
  }

  return dataArrayToBeReturned;
}

async function decryptUploaded(_label, _requestedObject) {
  let content = await axios.get(url + `/fetchUploadedDocument?label=${_label}`);
  let dataArrayToBeReturned = [];
  console.log("content", content);
  content = content.data;
  for (let i = 0; i < _requestedObject.length; i++) {
    if (_requestedObject[i].isFile === true) {
      let url = content.files[_requestedObject[i].name];
      let objToBePushed = {
        isFile: true,
        name: _requestedObject[i].name,
        value: url
      };
      dataArrayToBeReturned.push(objToBePushed);
    } else {
      let objToBePushed = {
        isFile: false,
        name: _requestedObject[i].name,
        value: content.textFields[_requestedObject[i].name]
      };
      dataArrayToBeReturned.push(objToBePushed);
    }
  }
  console.log("dataArraytobe ruet", dataArrayToBeReturned);
  return dataArrayToBeReturned;
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

// Authentication Functions

export async function register(username, password) {
  let { data } = await axios.post(url + "/register", {
    username: username,
    password: password
  });
  console.log(data);
  return data.bool;
}

export async function login(username, password) {
  let { data } = await axios.post(url + "/login", {
    username: username,
    password: password
  });
  console.log(data);
  return data.bool;
}

export async function addProject(username, project_name) {
  let { data } = await axios.post(url + "/addProject", {
    username: username,
    projectName: project_name
  });
  console.log(data);
  return data.bool;
}

export async function getProjects(username) {
  let { data } = await axios.post(url + "/getProject", {
    username: username
  });
  console.log(data);
  return data.projects;
}

export {
  generateKeyPairs,
  encryptData,
  decryptDocument,
  createPolicy,
  decryptUploaded
};

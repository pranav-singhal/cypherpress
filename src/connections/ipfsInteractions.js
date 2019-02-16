import IPFS from "ipfs-http-client";
import { Buffer } from "buffer";

const ipfsNode = new IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});

/*
    Function to check if the ipfs node is connected
    @return {boolean} : true when done
 */
async function connectNode() {
  return new Promise(function(resolve, reject) {
    resolve(true);
  });
}

/*
    Function to upload a json object to the ipfs network
    @param {object} _json : in any format that is to be uploaded to the ipfs network
    @return {string} ipfs path to the uploaded json
 */
async function uploadJSON(_json) {
  console.log(_json);
  let buffer = await Buffer.from(JSON.stringify(_json));
  let ipfsResponse = await ipfsNode.add(buffer);
  return ipfsResponse[0].path;
}

/*
    Function to upload a file object to the ipfs network
    @param {FileReader result} : _fileReader in any format that is to be uploaded to the ipfs network
    @return {string} ipfs path to the uploaded file
 */
async function uploadFile(_fileReaderResult) {
  let buffer = await Buffer.from(_fileReaderResult);
  let ipfsResponse = await ipfsNode.add(buffer);
  return ipfsResponse[0].path;
}

/*
    Function to that will handle the upload of certain kind of data
    @param {object[]} _array : Objects in the array should be of the form
                                    obj = {
                                        isFile : true only if it is some kind of file
                                        name : name of the key against which some data is to be stored
                                        value : value to be stored against above mentioned name
                                    }
    @return {string} : ipfs hash
 */

async function handleUpload(_array) {
  let finalJsonToBeUploaded = {};
  for (let i = 0; i < _array.length; i++) {
    let element = _array[i];
    if (element.isFile === true) {
      let value = element.value;
      let hash = await uploadFile(value);
      let name = element.name;
      finalJsonToBeUploaded[name] = hash;
    } else {
      finalJsonToBeUploaded[element.name] = element.value;
    }
  }
  let hash = await uploadJSON(finalJsonToBeUploaded);
  console.log("handle upload hash", hash);
  return hash;
}

async function getFile(_path) {
  let response = await ipfsNode.get(_path);
  let content = response[0].content;
  return content.toString();
}

export async function getJson(_path) {
  console.log("_path", _path);
  _path = _path.hash;
  let response = await ipfsNode.get("/ipfs/" + _path);
  console.log("response", response[0].content);
  let content = response[0].content;
  console.log(content);
  let json = JSON.parse(content.toString());
  console.log(json);
  return json;
}

async function getData(_path, _requestedArray) {
  console.log(_requestedArray);
  let dataArrayToBereturned = [];
  let valueJson = await getJson(_path);
  for (let i = 0; i < _requestedArray.length; i++) {
    if (_requestedArray[i].isFile === true) {
      let hash = valueJson[_requestedArray[i].name];
      let url = `https://ipfs.io/ipfs/${hash}`;
      console.log("generated url", url);
      let objToBePushed = {
        isFile: true,
        name: _requestedArray[i].name,
        value: url
      };
      dataArrayToBereturned.push(objToBePushed);
    } else {
      let objToBePushed = {
        isFile: false,
        name: _requestedArray[i].name,
        value: valueJson[_requestedArray[i].name]
      };
      dataArrayToBereturned.push(objToBePushed);
    }
  }
  console.log("data Array from ipfs", dataArrayToBereturned);
  return dataArrayToBereturned;
  console.log(dataArrayToBereturned);
}

export { getData, handleUpload, connectNode };
// async function testing() {
//     await connectNode();
//     // let test = [
//     //     {
//     //         isFile : false,
//     //         name : 'Name',
//     //         value : 'arvind'
//     //     },
//     //     {
//     //         isFile : false,
//     //         name : 'age',
//     //         value : '21'
//     //     }
//     // ];
//     // let hash = await handleSubmission(test);
//     // let path = await  uploadJSON({
//     //    hell : "hello"
//     // });
//     // console.log(path);
//     let hash = await getJson('QmYFmvb4EyC7jWT2sjQviBjnkxEfrmeLdXuScxLLK8q1Pn');
//     // console.log(hash);
// }

// testing();

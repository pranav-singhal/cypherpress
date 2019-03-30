import Web3 from "web3";

const web3 = new Web3(
  new Web3.providers.HttpProvider("http://127.0.0.1:8545  ")
);

const contractAbi = [
  {
    constant: true,
    inputs: [
      {
        name: "_documentId",
        type: "uint256"
      },
      {
        name: "_delegatee",
        type: "string"
      }
    ],
    name: "isDeligatee",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_username",
        type: "string"
      }
    ],
    name: "addDeligateeAccounts",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_uploader",
        type: "string"
      }
    ],
    name: "getUploadedDocumentsNumber",
    outputs: [
      {
        name: "",
        type: "uint256[]"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_messageKit",
        type: "string"
      },
      {
        name: "_dataSource",
        type: "string"
      },
      {
        name: "_label",
        type: "string"
      },
      {
        name: "_policyPubKey",
        type: "string"
      },
      {
        name: "_aliceSigKey",
        type: "string"
      },
      {
        name: "_uploader",
        type: "string"
      }
    ],
    name: "uploadADocument",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_deligatee",
        type: "string"
      }
    ],
    name: "getDeligatedDocumentsNumber",
    outputs: [
      {
        name: "",
        type: "uint256[]"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_documentId",
        type: "uint256"
      }
    ],
    name: "getDocumentInfo",
    outputs: [
      {
        name: "",
        type: "string"
      },
      {
        name: "",
        type: "string"
      },
      {
        name: "",
        type: "string"
      },
      {
        name: "",
        type: "string"
      },
      {
        name: "",
        type: "string"
      },
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_index",
        type: "uint256"
      }
    ],
    name: "getDelegteeUsername",
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_username",
        type: "string"
      }
    ],
    name: "usernameAvailability",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_documentId",
        type: "uint256"
      },
      {
        name: "_deligatee",
        type: "string"
      },
      {
        name: "_uploader",
        type: "string"
      }
    ],
    name: "deligateDocument",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_username",
        type: "string"
      }
    ],
    name: "signUpUsername",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getNumberOfDeligatee",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  }
];
let contract;
let contractAddress;

// TODO OK Tested
/*
    Function to Connect Contract with the contract address
    @param {address} _contractAddress
    @return {boolean}
 */
async function connectToContract(_contractAddress) {
  contract = new web3.eth.Contract(contractAbi, _contractAddress);
  contractAddress = _contractAddress;
  return true;
}

// Updated, according to new contract
async function isDeligatee(_documentId, _delegatee) {
  return new Promise(function(resolve, reject) {
    contract.methods
      .isDeligatee(_documentId, _delegatee)
      .call()
      .then(function(_boolean) {
        console.log("from checkUsernameAvailability", _boolean);
        if (_boolean) {
          resolve(_boolean);
        } else {
          resolve(_boolean);
        }
      });
  });
}

// Updated, according to new contract
async function getNumberOfDeligatee() {
  return new Promise(function(resolve, reject) {
    contract.methods
      .getNumberOfDeligatee()
      .call()
      .then(function(_num) {
        resolve(_num);
      });
  });
}

// Updated, according to new contract
async function getDelegteeUsername(_idx) {
  return new Promise(function(resolve, reject) {
    contract.methods
      .getDelegteeUsername(_idx)
      .call()
      .then(function(_name) {
        resolve(_name);
      });
  });
}

// Updated, according to new contract
/*
    Function to check if a certain username is available for use
    @param {string} _username
    @return {boolean} true if available and vice versa
 */
async function checkUsernameWeb3(_username) {
  return new Promise(function(resolve, reject) {
    contract.methods
      .usernameAvailability(_username)
      .call()
      .then(function(_boolean) {
        console.log("from checkUsernameAvailability", _boolean);
        if (_boolean) {
          resolve(_boolean);
        } else {
          resolve(_boolean);
        }
      });
  });
}

// Updated, according to new contract
/*
    Function to signInUser to the contract to store his username to contract
    @param {string} _username : Username of user to be added
    @param {string} _privateKey : Ethereum Private Key of the Signer
    @param {object} _callingObject : an Object to be used as events while execution

    _callingObject : {

            verifyTransaction : function(transaction, gasInEth, transactionName, callback){
                transaction {object} : for the transaction information
                gasInEth {string} : for showing gas in eth to user
                transactionName {string} : name of the transaction
                callback {function} : function to be called if you want the transaction to be mined
            },

            transactionMining : function(hash){
                hash {string} : hash of the transaction being mined to be used for etherscan link
            },

            insufficientFunds : function(eth){
                eth {string} : eth which is required for this transaction
            }

        }

 */
async function signInUser(_username, _privateKey, _callingObject) {
  return new Promise(function(resolve, reject) {
    let address = web3.eth.accounts.privateKeyToAccount(_privateKey).address;
    contract.methods
      .signUpUsername(_username)
      .estimateGas({
        from: address
      })
      .then(async function(gasAmount) {
        web3.eth.getGasPrice().then(function(gasPrice) {
          let gasValue = gasPrice * gasAmount;

          let transaction = {
            from: web3.utils.toChecksumAddress(address),
            to: web3.utils.toChecksumAddress(contractAddress),
            gas: gasAmount + 10,
            data: contract.methods.signUpUsername(_username).encodeABI()
          };

          web3.eth.getBalance(address).then(bal => {
            let requiredEth = gasValue;
            let gasInEth = web3.utils.fromWei(requiredEth.toString());
            // console.log(typeof requiredEth);
            if (bal > requiredEth) {
              _callingObject.verifyTransaction(
                transaction,
                gasInEth,
                "SignIn User to Contract",
                function() {
                  let signPromise = web3.eth.accounts.signTransaction(
                    transaction,
                    _privateKey
                  );
                  // console.log(signPromise);
                  signPromise
                    .then(signedTx => {
                      // console.log(signedTx);
                      const sentTx = web3.eth.sendSignedTransaction(
                        signedTx.raw || signedTx.rawTransaction
                      );
                      sentTx.on("receipt", receipt => {
                        resolve(true);
                      });
                      sentTx.on("transactionHash", function(hash) {
                        _callingObject.transactionMining(hash);
                        // console.log("Allowance hash =", hash);
                      });
                      sentTx.on("error", err => {
                        resolve(err);
                      });
                    })
                    .catch(err => {
                      console.error(err);
                    });
                }
              );
            } else {
              _callingObject.insufficientFunds(gasInEth);
            }
          });
        });
      });
  });
}

// Not Required with devnet
//
// async function getDelegateePublicKey(_delegatee) {
//   return new Promise(function(resolve, reject) {
//     contract.methods
//       .getNucypherPublicKey(_delegatee)
//       .call()
//       .then(function(_bobPublicKey) {
//         resolve(_bobPublicKey);
//       });
//   });
// }

// Updated, according to new contract
/*
    Function to upload a document to the network without setting any deligatee
    @param {string} _messageKit : cipher text from pyUmbral
    @param {string} _capsule : capsule from pyUmbral
    @param {string} _aliceVerifyKey : alice's verifying key
    @param {string} _alicePublicKey : alice's public key
    @param {string} _uploader : username of uploader of the document
    @param {string} _privateKey : private key of the signer
    @param {object} _callingObject : an Object to be used as events while execution

    @return {number} documentId : this is the unique document id returned from the contract

    _callingObject : {

            verifyTransaction : function(transaction, gasInEth, transactionName, callback){
                transaction {object} : for the transaction information
                gasInEth {string} : for showing gas in eth to user
                transactionName {string} : name of the transaction
                callback {function} : function to be called if you want the transaction to be mined
            },

            transactionMining : function(hash){
                hash {string} : hash of the transaction being mined to be used for etherscan link
            },

            insufficientFunds : function(eth){
                eth {string} : eth which is required for this transaction
            }

        }
 */
async function uploadADocument(
  _messageKit,
  _dataSource,
  _label,
  _policyPubKey,
  _aliceSigKey,
  _alice,
  _privateKey,
  _callingObject
) {
  console.log("inside uploadDocument");
  console.log("_messageKit", _messageKit);
  console.log("_dataSource", _dataSource);
  console.log("_label", _label);
  console.log("_policyPubKey", _policyPubKey);
  console.log("_aliceSigKey", _aliceSigKey);
  console.log("_privateKey", _privateKey);
  console.log("_alice", _alice);

  return new Promise(function(resolve, reject) {
    console.log("inside upload document");
    let address = web3.eth.accounts.privateKeyToAccount(_privateKey).address;
    contract.methods
      .uploadADocument(
        _messageKit,
        _dataSource,
        _label,
        _policyPubKey,
        _aliceSigKey,
        _alice
      )
      .estimateGas({
        from: address
      })
      .then(async function(gasAmount) {
        console.log("gasAmount", gasAmount);
        web3.eth.getGasPrice().then(function(gasPrice) {
          let gasValue = gasPrice * gasAmount;

          let transaction = {
            from: web3.utils.toChecksumAddress(address),
            to: web3.utils.toChecksumAddress(contractAddress),
            gas: gasAmount + 1000,
            data: contract.methods
              .uploadADocument(
                _messageKit,
                _dataSource,
                _label,
                _policyPubKey,
                _aliceSigKey,
                _alice
              )
              .encodeABI()
          };

          web3.eth.getBalance(address).then(bal => {
            let requiredEth = gasValue + 1000;
            let gasInEth = web3.utils.fromWei(requiredEth.toString());
            console.log(typeof requiredEth);
            if (bal > requiredEth) {
              _callingObject.verifyTransaction(
                transaction,
                gasInEth,
                "Upload Document to Contract",
                function() {
                  let signPromise = web3.eth.accounts.signTransaction(
                    transaction,
                    _privateKey
                  );
                  console.log(signPromise);
                  signPromise
                    .then(signedTx => {
                      console.log(signedTx);
                      const sentTx = web3.eth.sendSignedTransaction(
                        signedTx.raw || signedTx.rawTransaction
                      );
                      sentTx.on("receipt", async receipt => {
                        console.log(receipt);
                        resolve(receipt);
                      });
                      sentTx.on("transactionHash", function(hash) {
                        _callingObject.transactionMining(hash);
                        console.log("Allowance hash =", hash);
                      });
                      sentTx.on("error", err => {
                        console.error(err);
                        resolve(false);
                      });
                    })
                    .catch(err => {
                      console.error(err);
                    });
                }
              );
            } else {
              _callingObject.insufficientFunds(gasInEth);
            }
          });
        });
      });
  });
}

// Updated, according to new contract
/*
    Function to deligate a document to someone
    @param {string} _documentId : unique document id returned by contract
    @param {string} _policyId   : policy id from nucypher network
    @param {string} _deligatee  : username of the deligatee who gets access
    @param {string} _uploader   : username of the uploader
    @param {string} _privateKey : private key of the signer
    @param {object} _callingObject : an Object to be used as events while execution

    @return {number} documentId : this is the unique document id returned from the contract

    _callingObject : {

            verifyTransaction : function(transaction, gasInEth, transactionName, callback){
                transaction {object} : for the transaction information
                gasInEth {string} : for showing gas in eth to user
                transactionName {string} : name of the transaction
                callback {function} : function to be called if you want the transaction to be mined
            },

            transactionMining : function(hash){
                hash {string} : hash of the transaction being mined to be used for etherscan link
            },

            insufficientFunds : function(eth){
                eth {string} : eth which is required for this transaction
            }

        }
 */
async function deligateDocument(
  _documentId,
  _deligatee,
  _uploader,
  _privateKey,
  _callingObject
) {
  return new Promise(function(resolve, reject) {
    console.log(_documentId);
    console.log(_deligatee);
    console.log(_uploader);
    console.log(_privateKey);
    console.log(_callingObject);
    let address = web3.eth.accounts.privateKeyToAccount(_privateKey).address;
    contract.methods
      .deligateDocument(_documentId, _deligatee, _uploader)
      .estimateGas({
        from: address
      })
      .then(async function(gasAmount) {
        web3.eth.getGasPrice().then(function(gasPrice) {
          let gasValue = gasPrice * gasAmount;

          let transaction = {
            from: web3.utils.toChecksumAddress(address),
            to: web3.utils.toChecksumAddress(contractAddress),
            gas: gasAmount + 1000,
            data: contract.methods
              .deligateDocument(_documentId, _deligatee, _uploader)
              .encodeABI()
          };

          web3.eth.getBalance(address).then(bal => {
            let requiredEth = gasValue + 1000;
            let gasInEth = web3.utils.fromWei(requiredEth.toString());
            console.log(typeof requiredEth);
            if (bal > requiredEth) {
              _callingObject.verifyTransaction(
                transaction,
                gasInEth,
                "Upload Document to Contract",
                function() {
                  let signPromise = web3.eth.accounts.signTransaction(
                    transaction,
                    _privateKey
                  );
                  console.log(signPromise);
                  signPromise
                    .then(signedTx => {
                      console.log(signedTx);
                      const sentTx = web3.eth.sendSignedTransaction(
                        signedTx.raw || signedTx.rawTransaction
                      );
                      sentTx.on("receipt", receipt => {
                        console.log(receipt);
                        resolve(receipt);
                      });
                      sentTx.on("transactionHash", function(hash) {
                        _callingObject.transactionMining(hash);
                        console.log("Allowance hash =", hash);
                      });
                      sentTx.on("error", err => {
                        resolve(false);
                      });
                    })
                    .catch(err => {
                      console.error(err);
                    });
                }
              );
            } else {
              _callingObject.insufficientFunds(gasInEth);
            }
          });
        });
      });
  });
}

// Updated, according to new contract
/*
    Function to get the list of documents uploaded by a particular username in the form of document ids
    @param {string} _uploader : username of the uploader of the document
    @param {string} _privateKey : privateKey of the uploader
    @return {number[]} : array of all the document ids uploaded by the _uploader
 */
async function getUploadedDocumentIds(_uploader, _privateKey) {
  return new Promise(function(resolve, reject) {
    let address = web3.eth.accounts.privateKeyToAccount(_privateKey).address;
    contract.methods
      .getUploadedDocumentsNumber(_uploader)
      .call({
        from: address
      })
      .then(function(array) {
        let rv = array.map(ele => ele - 1 + 1);
        resolve(rv);
      });
  });
}

// Updated, according to new contract
/*
    Function to get the list of documents deligated to the user
    @param {string} _deligatee : username of the deligatee of the document
    @param {string} _privateKey : privateKey of the deligatee
    @return {number[]} : array of all the document ids deligated to the deligatee
 */
async function getDeligatedDocumentIds(_deligatee, _privateKey) {
  return new Promise(function(resolve, reject) {
    let address = web3.eth.accounts.privateKeyToAccount(_privateKey).address;
    contract.methods
      .getDeligatedDocumentsNumber(_deligatee)
      .call({
        from: address
      })
      .then(function(array) {
        let rv = array.map(ele => ele - 1 + 1);
        resolve(rv);
      });
  });
}

// TODO Ok Tested
/*
    Function to fetch the information regarding an uploaded document using a document id
    @param {string} _documentId : unique Id of the document to be fetched
    @param {string} _privateKey : privateKey of the uploader of the document
    @return {object} : Example {
                                    cipherText,
                                    capsule,
                                    verifyKey,
                                    publicKey
                                }
 */
/*
async function getUploadedDocumentInfo(_documentId, _privateKey) {
  return new Promise(function(resolve, reject) {
    let address = web3.eth.accounts.privateKeyToAccount(_privateKey).address;
    contract.methods
      .getUploadedDocumentInfo(_documentId)
      .call({
        from: address
      })
      .then(function(response) {
        let rv = {
          cipherText: response["0"],
          capsule: response["1"],
          verifyKey: response["2"],
          publicKey: response["3"]
        };
        resolve(rv);
      });
  });
}
*/

// Updated, according to new contract
/*
    Function to fetch the information regarding a deligated document
    @param {string} _documentId : unique Id of the document to be fetched
    @param {string} _deligatee : username of the deligatee
    @param {string} _privateKey : privateKey of the deligatee of the document
    @return {object} : Example {
                                    cipherText,
                                    capsule,
                                    verifyKey,
                                    publicKey,
                                    policyId
                                }
 */
async function getDocumentInfo(_documentId, _privateKey) {
  return new Promise(function(resolve, reject) {
    let address = web3.eth.accounts.privateKeyToAccount(_privateKey).address;
    contract.methods
      .getDeligatedDocumentInfo(_documentId)
      .call({
        from: address
      })
      .then(function(response) {
        let rv = {
          messageKit: response["0"],
          dataSource: response["1"],
          label: response["2"],
          aliceSigKey: response["3"],
          policyPubKey: response["4"],
          alice: response["5"]
        };
        resolve(rv);
      });
  });
}

export {
  getDeligatedDocumentIds,
  getUploadedDocumentIds,
  deligateDocument,
  uploadADocument,
  signInUser,
  checkUsernameWeb3,
  connectToContract,
  isDeligatee,
  getNumberOfDeligatee,
  getDelegteeUsername,
  getDocumentInfo
};

/*
For Testing the functions
async function testing() {
    await connectToContract('0x522d62c67b4da04fb55467a8071b0f7cff94b149');
    // let bool = await uploadADocument('cipherText',
    //     'capsule',
    //     'verifykey',
    //     'publicKey',
    //     'arvind',
    //     '0x36B298BE4646D2044F02ADCD1AF39A9069EF798CA4EF6F439553AA05935AAE47',
    //     {
    //         verifyTransaction: function (transaction, gasInEth, transactionName, callback) {
    //             callback();
    //         },
    //         transactionMining: function (hash) {
    //         },
    //         insufficientFunds: function (eth) {
    //         }
    //     });
    // console.log(bool, "confirmation");
    // let ans = await web3.eth.getTransactionReceipt('0x8780aea43ec5b54b95cf7dca6c503d6af7a77c4cdbce64f4ad95ed0d87be63ab');
    // let list = await getUploadedDocumentIds('arvind', '0x36B298BE4646D2044F02ADCD1AF39A9069EF798CA4EF6F439553AA05935AAE47');
    let list = await getDeligatedDocumentInfo(1, 'kalra','0x36B298BE4646D2044F02ADCD1AF39A9069EF798CA4EF6F439553AA05935AAE47');
    console.log(list);

}

testing();
 */

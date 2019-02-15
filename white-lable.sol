pragma solidity >=0.4.22 <0.6.0;

contract white_label {

    uint currentId = 1;
    address owner;

    // Struct to store information regarding each document uploaded
    struct Document{
        string uploader;
        string cipherText;
        string capsule;
        string aliceVerifyingKey;
        string alicePublicKey;
        mapping(string => string) deligateeToPolicyId;
    }

    struct DeligatedDocument {
        uint documentId;
        string policyId;
    }

    constructor() public{
        owner = msg.sender;
    }

    // Mapping to provide a unique id to each Document uploaded
    mapping(uint => Document) documentList;

    // Mapping to store username to account
    mapping(string => address) usernameToAddress;
    mapping(string => string) usernameToNucypher;

    // Mapping to store documents ids uploaded by a certain username
    mapping(string => uint[]) usernameToUploadedDocuments;

    // Mapping to store documents ids deligated to a certain username
    mapping(string => uint[]) usernameToDeligatedDocuments;

    //UTILS
    function equal(string _a, string _b)  private pure returns (bool){
        return compare(_a, _b) == 0;
    }

    function compare(string _a, string _b) private pure returns (int) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        uint minLength = a.length;
        if (b.length < minLength) minLength = b.length;
        //@todo unroll the loop into increments of 32 and do full 32 byte comparisons
        for (uint i = 0; i < minLength; i ++)
            if (a[i] < b[i])
                return -1;
            else if (a[i] > b[i])
                return 1;
        if (a.length < b.length)
            return -1;
        else if (a.length > b.length)
            return 1;
        else
            return 0;
    }


    //UTILS END

    function addDeligateeAccounts(string _username, address _deligatee) public{
        require(msg.sender == owner);
        usernameToAddress[_username] = _deligatee;
    }

    function usernameAvailability(string _username) public view returns(bool){
        if(usernameToAddress[_username] != 0){
            return false;
        }else{
            return true;
        }
    }

    function signUpUsername(string _username, string _nucypherPublic) public{
        require(usernameToAddress[_username] == 0);
        usernameToAddress[_username] = msg.sender;
        usernameToNucypher[_username] = _nucypherPublic;
    }

    function getNucypherPublicKey(string _username) public view returns(string){
        return( usernameToNucypher[_username]);
    }

    function uploadADocument(string _cipherText, string _capsule, string _aliceVerifyingKey, string _alicePublicKey, string _uploader) public {
        require(usernameToAddress[_uploader] == msg.sender);
        documentList[currentId].uploader = _uploader;
        documentList[currentId].cipherText = _cipherText;
        documentList[currentId].capsule = _capsule;
        documentList[currentId].aliceVerifyingKey = _aliceVerifyingKey;
        documentList[currentId].alicePublicKey = _alicePublicKey;
        documentList[currentId].uploader = _uploader;
        usernameToUploadedDocuments[_uploader].push(currentId);
        currentId++;
    }

    function deligateDocument(uint _documentId, string _policyId, string _deligatee, string _uploader) public{
        require(usernameToAddress[_uploader] == msg.sender);
        require(equal(documentList[_documentId].uploader, _uploader));
        usernameToDeligatedDocuments[_deligatee].push(_documentId);
        documentList[_documentId].deligateeToPolicyId[_deligatee] = _policyId;
    }

    function getUploadedDocuments(string _uploader) public view returns(uint []){
        require(usernameToAddress[_uploader] == msg.sender);
        return(usernameToUploadedDocuments[_uploader]);
    }

    function getDeligatedDocument(string _deligatee) public view returns(uint []){
        require(usernameToAddress[_deligatee] == msg.sender);
        return(usernameToDeligatedDocuments[_deligatee]);
    }

    function getUploadedDocumentInfo(uint _documentId) public view returns(string, string, string, string){
        Document memory currentDoc = documentList[_documentId];
        return(currentDoc.cipherText, currentDoc.capsule, currentDoc.aliceVerifyingKey, currentDoc.alicePublicKey);
    }

    function getDeligatedDocumentInfo(uint _documentId, string _deligatee) public view returns(string, string, string, string, string){
        Document memory currentDoc = documentList[_documentId];
        string memory policyId = documentList[_documentId].deligateeToPolicyId[_deligatee];
        return(currentDoc.cipherText, currentDoc.capsule, currentDoc.aliceVerifyingKey, currentDoc.alicePublicKey, policyId);
    }
}

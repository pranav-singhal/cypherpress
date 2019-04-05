pragma solidity >=0.4.22 <0.6.0;

contract white_label {

    uint currentId = 1;
    address owner;

    // Struct to store information regarding each document uploaded
    struct Document{
        string alice;
        string messageKit;
        string dataSource;
        string label;
        string policyPubKey;
        string aliceSigKey;
        mapping(string => bool) bobArray;
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
    string[] delegatees;


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

    function addDeligateeAccounts(string _username) public{
        require(msg.sender == owner);
        delegatees.push(_username);
    }

    function getNumberOfDeligatee() public view returns(uint){
        return delegatees.length;
    }

    function getDelegteeUsername(uint _index) public view returns(string){
        return delegatees[_index];
    }

    function usernameAvailability(string _username) public view returns(bool){
        if(usernameToAddress[_username] != 0){
            return false;
        }else{
            return true;
        }
    }

    function signUpUsername(string _username) public{
        require(usernameToAddress[_username] == 0);
        usernameToAddress[_username] = msg.sender;
    }

    function uploadADocument(string _messageKit, string _dataSource, string _label, string _policyPubKey, string _aliceSigKey, string _uploader) public {
        require(usernameToAddress[_uploader] == msg.sender);
        documentList[currentId].alice = _uploader;
        documentList[currentId].messageKit = _messageKit;
        documentList[currentId].dataSource = _dataSource;
        documentList[currentId].label = _label;
        documentList[currentId].policyPubKey = _policyPubKey;
        documentList[currentId].aliceSigKey = _aliceSigKey;
        usernameToUploadedDocuments[_uploader].push(currentId);
        currentId++;
    }

    function deligateDocument(uint _documentId, string _deligatee, string _uploader) public{
        require(usernameToAddress[_uploader] == msg.sender);
        require(equal(documentList[_documentId].alice, _uploader));
        usernameToDeligatedDocuments[_deligatee].push(_documentId);
        documentList[_documentId].bobArray[_deligatee] = true;
    }

    function isDeligatee(uint _documentId, string _delegatee) public view returns(bool){
        if(documentList[_documentId].bobArray[_delegatee] == false){
            return false;
        }else{
            return true;
        }
    }

    function getUploadedDocumentsNumber(string _uploader) public view returns(uint []){
        require(usernameToAddress[_uploader] == msg.sender);
        return(usernameToUploadedDocuments[_uploader]);
    }

    function getDeligatedDocumentsNumber(string _deligatee) public view returns(uint []){
        require(usernameToAddress[_deligatee] == msg.sender);
        return(usernameToDeligatedDocuments[_deligatee]);
    }

    function getDocumentInfo(uint _documentId) public view returns(string, string, string, string, string, string){
        Document memory currentDoc = documentList[_documentId];
        return(currentDoc.messageKit, currentDoc.dataSource, currentDoc.label, currentDoc.aliceSigKey, currentDoc.policyPubKey, currentDoc.alice);
    }
}
from flask import Flask,jsonify,request, Response
from flask_cors import CORS
from umbral import pre, keys, signing, params
import json
import base64
from umbral import  config as uconfig
from umbral.curve import SECP256K1
# our encoding
kfrags_array = []
contractAddressList ={}
clientJsons = {}
def bytes_to_string(b):
    encoded = base64.b64encode(b)
    return encoded.decode('utf-8')

def string_to_bytes(s):
    sd = s.encode('utf-8')
    return base64.b64decode(sd)
uconfig.set_default_curve()
app = Flask(__name__)
CORS(app)

@app.route("/generateKeys",methods=['GET'])
def generateKeys():
    alices_private_key = keys.UmbralPrivateKey.gen_key()
    alices_public_key = alices_private_key.get_pubkey()
    alices_signing_key = keys.UmbralPrivateKey.gen_key()
    alices_verifying_key = alices_signing_key.get_pubkey()
    data = {}
    data['alicePrivate'] = bytes_to_string(alices_private_key.to_bytes())
    data['alicePublic'] = bytes_to_string(alices_public_key.to_bytes())
    data['aliceSigning'] = bytes_to_string(alices_signing_key.to_bytes())
    data['aliceVerifying'] = bytes_to_string(alices_verifying_key.to_bytes())
    return jsonify(data)

@app.route('/encryptData',methods=['POST'])
def encryptData():
    print('data')
    print(request.data.decode('utf-8'))
    print('data')
    json_data = json.loads(request.data.decode('utf-8'))
    hash = json_data['hash']
    alices_public_key = json_data['alices_public_key']
    alices_public_key = string_to_bytes(alices_public_key)
    alices_public_key = keys.UmbralPublicKey.from_bytes(alices_public_key)
    # hash = input.get('hash').encode('utf-8')
    hash = hash.encode('utf-8')
    ciphertext, capsule = pre.encrypt(alices_public_key, hash)
    data = {}
    data['cipherText'] = bytes_to_string(ciphertext)
    data['capsule'] = bytes_to_string(capsule.to_bytes())
    return jsonify(data)

@app.route('/decryptUploaded', methods=['POST'])
def decryptUploaded():
    json_data = json.loads(request.data.decode('utf-8'))
    capsule = json_data['capsule']
    cipherText = json_data['cipherText']
    alices_private_key = json_data['alices_private_key']
    ciphertext = string_to_bytes(cipherText)
    capsule = string_to_bytes(capsule)
    capsule = pre.Capsule.from_bytes(capsule, params.UmbralParameters(SECP256K1))
    alices_private_key = keys.UmbralPrivateKey.from_bytes(string_to_bytes(alices_private_key))
    cleartext = pre.decrypt(ciphertext=ciphertext,
                            capsule=capsule,
                            decrypting_key=alices_private_key)
    json_my_list = json.dumps(cleartext.decode('utf-8'))
    return json_my_list


@app.route('/createPolicy', methods=['POST'])
def createPolicy():
    json_data = json.loads(request.data.decode('utf-8'))
    alices_private_key = json_data['alices_private_key']
    alices_signing_key = json_data['alices_signing_key']
    bobs_public_key = json_data['bobs_public_key']
    alices_private_key = keys.UmbralPrivateKey.from_bytes(string_to_bytes(alices_private_key))
    bobs_public_key = keys.UmbralPublicKey.from_bytes(string_to_bytes(bobs_public_key))
    alices_signing_key = keys.UmbralPrivateKey.from_bytes(string_to_bytes(alices_signing_key))
    alices_signer = signing.Signer(private_key=alices_signing_key)
    kfrags = pre.generate_kfrags(delegating_privkey=alices_private_key,
                                 signer=alices_signer,
                                 receiving_pubkey=bobs_public_key,
                                 threshold=3,
                                 N=5)
    kfrags_array.append(kfrags)
    print(kfrags_array)
    return jsonify(len(kfrags_array)-1)

@app.route('/decryptDelegated', methods=['POST'])
def decryptDelegated():
    json_data = json.loads(request.data.decode('utf-8'))
    alices_public_key = json_data['alices_public_key']
    alices_verifying_key = json_data['alices_verifying_key']
    bobs_public_key = json_data['bobs_public_key']
    bobs_private_key = json_data['bobs_private_key']
    capsule = json_data['capsule']
    cipherText = json_data['cipherText']
    policyId = json_data['policyId']
    alices_public_key = string_to_bytes(alices_public_key)
    alices_public_key = keys.UmbralPublicKey.from_bytes(alices_public_key)
    alices_verifying_key = string_to_bytes(alices_verifying_key)
    alices_verifying_key = keys.UmbralPublicKey.from_bytes(alices_verifying_key)
    bobs_public_key = string_to_bytes(bobs_public_key)
    bobs_public_key = keys.UmbralPublicKey.from_bytes(bobs_public_key)
    bobs_private_key = keys.UmbralPrivateKey.from_bytes(string_to_bytes(bobs_private_key))
    capsule = string_to_bytes(capsule)
    capsule = pre.Capsule.from_bytes(capsule, params.UmbralParameters(SECP256K1))
    kfrags = kfrags_array[policyId]
    ciphertext = string_to_bytes(cipherText)
    capsule.set_correctness_keys(delegating=alices_public_key,
                                 receiving=bobs_public_key,
                                 verifying=alices_verifying_key)
    cfrags = list()

    for fragment in kfrags[:3]:
      cfrag = pre.reencrypt(fragment, capsule=capsule)
      cfrags.append(cfrag)
    for cfrag in cfrags:
      capsule.attach_cfrag(cfrag)
    bob_cleartext = pre.decrypt(ciphertext=ciphertext,
                            capsule=capsule,
                            decrypting_key=bobs_private_key)
    json_my_list = json.dumps(bob_cleartext.decode('utf-8'))
    return json_my_list

@app.route('/setContractAddress', methods=['POST'])
def setContractAddress():
    json_data = json.loads(request.data.decode('utf-8'))
    contractAddress = json_data['contractAddress']
    dappName = json_data['dappName']
    contractAddressList[dappName] = contractAddress
    return contractAddress

@app.route('/getContractAddress', methods=['POST'])
def getContractAddress():
    json_data = json.loads(request.data.decode('utf-8'))

    dappName = json_data['dappName']
    contractAddress = contractAddressList[dappName]

    return contractAddress

@app.route('/setClientJson', methods=['POST'])
def setClientJson():
    json_data = json.loads(request.data.decode('utf-8'))
    dappName = json_data['dappName']
    clientJson = json_data['clientJson']
    clientJsons[dappName] = clientJson
    return jsonify(clientJsons)

@app.route('/getClientJson', methods=['POST'])
def getClientJson():
    json_data = json.loads(request.data.decode('utf-8'))
    print('json_data:', json_data)
    dappName = json_data['dappName']
    clientJson = clientJsons[dappName]
    return clientJson

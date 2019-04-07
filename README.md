# CypherPress

A WYSIWYG for creating decentralised databases using IPFS and NuCypher

## USPs

✅ No knowledge of NuCypher or IPFS required to create decentralised databases

✅ Applications you create will allow your users complete control over who has access to data that they share

✅ Works on Ethereum Smart-Contracts - which means no 'single-point-of-failure'
## Use Cases

- Create a secret sharing app for your friends
- Build a medical record file system for your hospital where patients can choose which doctors to share their reports with
- Create a academic record file system for your university where students can share their academic transcripts with professors or employers

### Installation

1. Run a local fleet of Ursulas

   ```bash
    git clone https://github.com/nucypher/nucypher.git
    cd nucypher
    sh scripts/local_fleet/run_local_fleet.sh

   ```

2. Install Ganache-Cli (A Local Ethereum Blockchain)<br>
   You can install ganache-cli by running the following command

   ```bash
   npm intall -g ganache-cli
   ```

   Then it can be initiated using `ganache-cli`<br>
   This will provide a list of 10 account addresses and private keys.<br>
   Make sure that only these Private Keys are to be used in the webapp, just for the
   sake of fast transaction confirmations.

3. Clone The repo

   ```bash
   git clone https://github.com/pranav-singhal/cypherpress.git
   cd cypherpress
   npm install #install dependencies

   ```

4. Start the python server

   ```bash
    cd umbral
    export FLASK_APP=app.py
    flask run

   ```

5. Run the WebApp

   ```bash
      cd ..  #go to the root directory of the repo
      yarn start
   ```

6. Move to the `http://localhost:3000` to view the app

## Example Use Case (Medical Record File System)

- Cypherpress can be used to build a data sharing platform where patients can share their medical records with doctors.

- A hospital that might need such an application can use CypherPress. An administrator can use CypherPress to build such an app without learning about nucypher or IPFS.
- The administrator can decide what data patients can share and which doctors they can share it with - all with the help of a simple Google-Form like UI


- A similar application can be built by any school's administration, where students upload their
    performance reports and grant access to their teachers and future employers.    
    
## Demo Video
https://drive.google.com/file/d/1fk6DllrvmuKrE69Y6My2w1p6h4Mzppof/view

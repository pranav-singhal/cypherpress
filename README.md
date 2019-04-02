# CypherPress

A WYSIWYG for creating decentralised databases using IPFS and NuCypher

### USPs

✅ No knowledge of NuCypher or IPFS required to create decentralised databases

✅ Applications you create will allow your users complete control over who has access to data that they share

### Use Cases

* Create a secret sharing app for your friends
* Build a medical record file system for your hospital where patients can choose which doctors to share their reports with
* Create a academic record file system for your university where students can share their academic transcripts with professors or employers


## Installation

1. Run a local fleet of Ursulas
   ```bash
    git clone https://github.com/nucypher/nucypher.git
    cd nucypher
    sh scripts/local_fleet/run_local_fleet.sh
 
   ```

2. Clone The repo 

   ```bash
   git clone https://github.com/pranav-singhal/cypherpress.git

   ```
   
3. Start the python server
   
   ```bash
    cd cypherpress/umbral
    export FLASK_APP=app.py
    flask run 

   ```
4. Run the WebApp

    ```bash
       cd ..  #go to the root directory
       yarn start
    ```





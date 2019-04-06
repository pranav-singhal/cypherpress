# CypherPress

A WYSIWYG for creating decentralised databases using IPFS and NuCypher

## USPs

✅ No knowledge of NuCypher or IPFS required to create decentralised databases

✅ Applications you create will allow your users complete control over who has access to data that they share

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
      cd ..  #go to the root directory
      yarn start
   ```

6. Move to the `http://localhost:2000` to view the app

## Example Use Case (Medical Record File System)

- Consider a scenario where a hospital wants to build a system where the patient's data (like name, age, height etc)
    and his previous medical record is to be stored privately by the patient itself. And the 
    patient has the sole right to decide who will have the access to his data (it can be doctors
    in this case).
- Clearly, Nucypher's proxy re-encryption can be used in this scenario, the hospital will have
    to hire a developer who will build an application handling this use case.
- **Cypherpress** will be there to rescue in this situation, an admin who has no knowledge about how to 
    use Nucypher, can create an account on Nucypher as an administrator.
- He will make the fields such as Name, Blood Group, X-Ray Report which can be filled by the users
    of his application and give a name to his application, and then click render app.
     **_This is where Magic Happens_**
- An application that has all the fields as made by the admin will be created. Now any patient
    of the hospital can use this app built by Cypherpress to upload his data, and this app will
    use proxy re-encryption by Nucypher and give the right to the uploader to decide which doctor
    can access his data. (**Caution:** Admin will have to decide who will be those who can be granted
    access by the patients (Doctors in this case) just to make sure patients don't use this app
    to share data amongst their friends).
- A similar application can be built by any school's administration, where students upload their
    performance reports and grant access to their teachers and future employers.    
    

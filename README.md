## Novia - No Violence App Report

<img src="http://34.101.116.82/image/favicon.png" align="left"
width="50">

Novia is a friendly reporting app for any inappropriate acts to woman and child.
<br/>
It uses chatbot system to collect report from victims or reporters.

## Screenshots
<img src="https://storage.googleapis.com/novia-files/screenshots/novia-admin.jpeg" align="center" width="500">
<br/>

## Description
Building API using Node.js to get report data from Cloud Firestore and display it to the administrator website and get an API key from the News API Website and put it into REST API running in Google Compute Engine to get the news data.

## REST API
Local environment:
1. npm install (node module)
2. Get News API Key https://newsapi.org/
3. vocabulary.json from machine learning model
   ```python
   import json
   json.dumps(tokenizer.word_index)
   ```
4. Download service-account.json from Google Cloud Platform
   - In the Cloud Console, go to the Service Accounts page. https://console.cloud.google.com/iam-admin/serviceaccounts
   - Select a project.
   - If you don't have any service accounts, click "Create Service Account"
   - Click the email address of the service account that you want to create a key for. 
   - Click the Keys tab.
   - Click the Add key drop-down menu, then select Create new key.
   - Select JSON as the Key type and click Create.
   - Rename file to "service-account.json"










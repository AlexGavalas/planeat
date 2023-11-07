import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Load service account credentials from GitHub secret
creds_json = os.environ.get('SERVICE_ACCOUNT_CREDS')
creds = json.loads(creds_json)

# Create a service account credentials object
sa_credentials = service_account.Credentials.from_service_account_info(creds)

# Build the API client
api_service_name = 'your_api_service_name'
api_version = 'v1'
api_client = build(api_service_name, api_version, credentials=sa_credentials)

redirectUris = ['https://planeat-git-alexgavalas92-pla-63-testing-pipeline-alexgavalas.vercel.app/api/auth/callback/google']
clientId = '450640222561-m0s261nc3edr7l62fr9trqac8lo19b39.apps.googleusercontent.com'

api_client.projects().oauthIdp().updateClient(clientId=clientId, body={'redirectUris': [redirectUris]}).execute()

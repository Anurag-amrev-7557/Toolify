import os
import requests
from dotenv import load_dotenv

load_dotenv()

adobe_client_id = os.getenv('ADOBE_CLIENT_ID')
adobe_client_secret = os.getenv('ADOBE_CLIENT_SECRET')

print(f"Client ID: {adobe_client_id[:10]}..." if adobe_client_id else "Client ID: Not set")
print(f"Client Secret: {adobe_client_secret[:10]}..." if adobe_client_secret else "Client Secret: Not set")

if adobe_client_id and adobe_client_secret:
    try:
        print("\nTesting Adobe API authentication...")
        auth_response = requests.post(
            'https://pdf-services.adobe.io/token',
            data={
                'client_id': adobe_client_id,
                'client_secret': adobe_client_secret
            }
        )
        
        if auth_response.status_code == 200:
            print("✓ Adobe API authentication successful!")
            print(f"Access token received: {auth_response.json()['access_token'][:20]}...")
        else:
            print(f"✗ Adobe API authentication failed!")
            print(f"Status: {auth_response.status_code}")
            print(f"Response: {auth_response.text}")
    except Exception as e:
        print(f"✗ Error: {e}")
else:
    print("\n✗ Adobe credentials not configured in .env file")

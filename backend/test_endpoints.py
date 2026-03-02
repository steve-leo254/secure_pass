import requests
import json

# Test backend endpoints
BASE_URL = "http://localhost:8000"

def test_endpoint(endpoint, description):
    try:
        response = requests.get(f"{BASE_URL}{endpoint}")
        print(f"\n=== {description} ===")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Data: {json.dumps(data, indent=2)}")
            print(f"Count: {len(data) if isinstance(data, list) else 'N/A'}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Failed to connect: {e}")

# Test all system admin endpoints
print("Testing System Admin Backend Endpoints...")

test_endpoint("/system/users", "System Users")
test_endpoint("/system/packages", "Packages")
test_endpoint("/system/subscriptions", "Subscriptions")
test_endpoint("/system/reminders", "Reminders")
test_endpoint("/system/coin-packages", "Coin Packages")
test_endpoint("/system/coin-transactions", "Coin Transactions")

print("\n=== Summary ===")
print("If all endpoints return 200 status, the backend is working correctly.")
print("If you see errors, the backend may have issues.")

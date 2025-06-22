import requests
import json
import time

# Configuration
BASE_URL = "https://api.mazalbot.com/api/v1"
ACCESS_TOKEN = "ifj9ov1rh20fslfp"
USER_ID = 2138564172  # Replace with your actual user ID

# Headers for all requests
headers = {
    "Authorization": f"Bearer {ACCESS_TOKEN}",
    "Content-Type": "application/json"
}

def test_get_all_stones():
    """Test the GET /get_all_stones endpoint"""
    print("\n=== Testing GET /get_all_stones ===")
    
    url = f"{BASE_URL}/get_all_stones"
    params = {"user_id": USER_ID}
    
    print(f"Request URL: {url}")
    print(f"Request params: {params}")
    print(f"Request headers: {headers}")
    
    try:
        response = requests.get(url, headers=headers, params=params)
        print(f"Status Code: {response.status_code}")
        print(f"Response headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"Success! Found {len(data)} diamonds")
                if data and len(data) > 0:
                    print(f"First diamond: {json.dumps(data[0], indent=2)[:500]}...")
            except json.JSONDecodeError:
                print(f"Error: Could not parse JSON response")
                print(f"Raw response: {response.text[:1000]}...")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {str(e)}")

def test_delete_endpoints():
    """Test both delete endpoints to see which one works"""
    # First, get a diamond to delete
    print("\n=== Getting a diamond to test deletion ===")
    url = f"{BASE_URL}/get_all_stones"
    params = {"user_id": USER_ID}
    
    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            diamonds = response.json()
            if not diamonds or len(diamonds) == 0:
                print("No diamonds found to test deletion")
                return
            
            test_diamond = diamonds[0]
            diamond_id = test_diamond.get("id")
            stock_number = test_diamond.get("stock_number")
            
            print(f"Found diamond with ID: {diamond_id} and Stock Number: {stock_number}")
            
            # Test the first delete endpoint (using stock number)
            print("\n=== Testing DELETE /delete_stone/{stock_number} ===")
            url1 = f"{BASE_URL}/delete_stone/{stock_number}"
            params1 = {"user_id": USER_ID}
            
            try:
                response1 = requests.delete(url1, headers=headers, params=params1)
                print(f"Status Code: {response1.status_code}")
                print(f"Response: {response1.text}")
            except Exception as e:
                print(f"Exception: {str(e)}")
            
            # Test the second delete endpoint (using diamond_id)
            print("\n=== Testing DELETE /delete_diamond?diamond_id={diamond_id} ===")
            url2 = f"{BASE_URL}/delete_diamond"
            params2 = {"diamond_id": diamond_id, "user_id": USER_ID}
            
            try:
                response2 = requests.delete(url2, headers=headers, params=params2)
                print(f"Status Code: {response2.status_code}")
                print(f"Response: {response2.text}")
            except Exception as e:
                print(f"Exception: {str(e)}")
        else:
            print(f"Error getting diamonds: {response.text}")
    except Exception as e:
        print(f"Exception: {str(e)}")

def test_upload_inventory():
    """Test the POST /upload-inventory endpoint"""
    print("\n=== Testing POST /upload-inventory ===")
    
    url = f"{BASE_URL}/upload-inventory"
    data = {
        "user_id": USER_ID,
        "diamonds": [
            {
                "shape": "Round",
                "weight": 1.25,
                "color": "D",
                "clarity": "VVS1",
                "price_per_carat": 10000,
                "stock_number": f"TEST-{int(time.time())}"
            }
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Exception: {str(e)}")

if __name__ == "__main__":
    import time
    
    print("=== Mazalbot API Endpoint Test ===")
    print(f"Base URL: {BASE_URL}")
    print(f"User ID: {USER_ID}")
    
    # Test endpoints
    test_get_all_stones()
    test_delete_endpoints()
    # Uncomment to test adding a diamond
    # test_upload_inventory()
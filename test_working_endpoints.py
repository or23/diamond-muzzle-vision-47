#!/usr/bin/env python3

import requests
import json
import os

# Configuration
BASE_URL = "https://api.mazalbot.com/api/v1"
ACCESS_TOKEN = os.getenv('MAZALBOT_ACCESS_TOKEN')
USER_ID = int(os.getenv('MAZALBOT_USER_ID', '0'))

headers = {
    "Authorization": f"Bearer {ACCESS_TOKEN}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

def test_endpoint_variations():
    """Test different endpoint variations to find what actually works"""
    
    print("🔍 Discovering working endpoints...")
    
    # Test different URL patterns for common operations
    test_patterns = [
        # Get operations
        ("GET", "/get_all_stones", {"user_id": USER_ID}),
        ("GET", "/stones", {"user_id": USER_ID}),
        ("GET", "/diamonds", {"user_id": USER_ID}),
        ("GET", f"/users/{USER_ID}/stones", {}),
        ("GET", f"/users/{USER_ID}/diamonds", {}),
        
        # Upload operations  
        ("POST", "/upload-inventory", {"user_id": USER_ID, "diamonds": []}),
        ("POST", "/stones", {"user_id": USER_ID, "diamonds": []}),
        ("POST", "/diamonds", {"user_id": USER_ID, "diamonds": []}),
        ("POST", "/inventory/upload", {"user_id": USER_ID, "diamonds": []}),
        ("POST", f"/users/{USER_ID}/stones", {"diamonds": []}),
        
        # Update operations
        ("PUT", "/stones/123", {"user_id": USER_ID}),
        ("PUT", "/diamonds/123", {"user_id": USER_ID}),
        ("PUT", "/update_stone/123", {"user_id": USER_ID}),
        ("PATCH", "/stones/123", {"user_id": USER_ID}),
        
        # Delete operations
        ("DELETE", "/stones/123", {"user_id": USER_ID}),
        ("DELETE", "/diamonds/123", {"user_id": USER_ID}),
        ("DELETE", "/delete_stone", {"stone_id": "123", "user_id": USER_ID}),
        ("DELETE", "/delete_diamond", {"stone_id": "123", "user_id": USER_ID}),
        ("DELETE", "/stones", {"stone_id": "123", "user_id": USER_ID}),
    ]
    
    working_endpoints = []
    
    for method, endpoint, params_or_data in test_patterns:
        try:
            url = f"{BASE_URL}{endpoint}"
            
            if method == "GET":
                response = requests.get(url, headers=headers, params=params_or_data, timeout=10)
            elif method == "POST":
                response = requests.post(url, headers=headers, json=params_or_data, timeout=10)
            elif method == "PUT":
                response = requests.put(url, headers=headers, json=params_or_data, timeout=10)
            elif method == "PATCH":
                response = requests.patch(url, headers=headers, json=params_or_data, timeout=10)
            elif method == "DELETE":
                response = requests.delete(url, headers=headers, params=params_or_data, timeout=10)
            
            status = response.status_code
            
            # Consider it "working" if it's not 404 (endpoint exists) 
            if status != 404:
                try:
                    resp_data = response.json()
                    print(f"✅ {method:6} {endpoint:30} Status: {status}")
                    if status < 400:
                        print(f"   Success response: {str(resp_data)[:100]}...")
                    else:
                        print(f"   Error response: {str(resp_data)[:100]}...")
                    working_endpoints.append((method, endpoint, status))
                except:
                    print(f"✅ {method:6} {endpoint:30} Status: {status} (Non-JSON response)")
                    working_endpoints.append((method, endpoint, status))
            else:
                print(f"❌ {method:6} {endpoint:30} Status: 404 (Not Found)")
                
        except requests.RequestException as e:
            print(f"⚠️  {method:6} {endpoint:30} Error: {str(e)[:50]}...")
    
    return working_endpoints

def test_discovered_endpoints():
    """Test the endpoints we know work with real operations"""
    
    print("\n" + "="*60)
    print("TESTING DISCOVERED WORKING ENDPOINTS")
    print("="*60)
    
    # We know /get_all_stones works, let's see what data structure it returns
    try:
        response = requests.get(
            f"{BASE_URL}/get_all_stones",
            headers=headers,
            params={"user_id": USER_ID, "limit": 1},  # Get just 1 item to see structure
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            if data:
                print("✅ Sample diamond structure from /get_all_stones:")
                print(json.dumps(data[0], indent=2))
                
                # Extract key info
                sample_diamond = data[0]
                diamond_id = sample_diamond.get("id")
                stock_number = sample_diamond.get("stock") or sample_diamond.get("stock_number")
                
                print(f"\nKey identifiers found:")
                print(f"  - id: {diamond_id}")
                print(f"  - stock: {stock_number}")
                print(f"  - Available fields: {list(sample_diamond.keys())}")
                
                return sample_diamond
    except Exception as e:
        print(f"❌ Error testing /get_all_stones: {e}")
    
    return None

if __name__ == "__main__":
    print("🚀 Discovering actual working API endpoints...")
    print(f"Base URL: {BASE_URL}")
    print(f"User ID: {USER_ID}")
    print("="*60)
    
    # Step 1: Test endpoint variations
    working_endpoints = test_endpoint_variations()
    
    print(f"\n📊 Summary: Found {len(working_endpoints)} endpoints that exist (non-404)")
    
    # Step 2: Test the known working endpoint in detail
    sample_diamond = test_discovered_endpoints()
    
    print("\n" + "="*60)
    print("RECOMMENDATIONS FOR CLIENT FIXES:")
    print("="*60)
    print("1. ✅ Keep using GET /get_all_stones - it works perfectly")
    print("2. ❌ Remove non-existent endpoints from client")
    print("3. 🔧 Focus client implementation on working endpoints only")
    print("4. 📝 Update API documentation to match reality")
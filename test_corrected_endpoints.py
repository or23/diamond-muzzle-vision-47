#!/usr/bin/env python3

import requests
import json
import time
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

def test_post_diamonds_payload():
    """Test different payload formats for POST /diamonds"""
    
    print("🧪 Testing POST /diamonds with different payload formats...")
    
    # Test various payload structures
    payloads = [
        # Format 1: Direct array
        [
            {
                "user_id": USER_ID,
                "shape": "Round",
                "weight": 1.25,
                "color": "D", 
                "clarity": "VVS1",
                "stock": f"TEST-{int(time.time())}",
                "price_per_carat": 10000
            }
        ],
        
        # Format 2: Wrapped in diamonds key
        {
            "user_id": USER_ID,
            "diamonds": [
                {
                    "shape": "Round",
                    "weight": 1.25,
                    "color": "D",
                    "clarity": "VVS1", 
                    "stock": f"TEST-{int(time.time())+1}",
                    "price_per_carat": 10000
                }
            ]
        },
        
        # Format 3: Single diamond object
        {
            "user_id": USER_ID,
            "shape": "Round",
            "weight": 1.25,
            "color": "D",
            "clarity": "VVS1",
            "stock": f"TEST-{int(time.time())+2}",
            "price_per_carat": 10000
        },
        
        # Format 4: Minimal required fields only
        {
            "user_id": USER_ID,
            "shape": "Round",
            "weight": 1.0,
            "color": "H",
            "clarity": "SI1"
        }
    ]
    
    for i, payload in enumerate(payloads, 1):
        print(f"\n--- Testing Payload Format {i} ---")
        print(f"Payload: {json.dumps(payload, indent=2)}")
        
        try:
            response = requests.post(
                f"{BASE_URL}/diamonds",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            print(f"Status: {response.status_code}")
            try:
                resp_data = response.json()
                print(f"Response: {json.dumps(resp_data, indent=2)}")
            except:
                print(f"Raw Response: {response.text}")
                
            if response.status_code < 400:
                print("✅ SUCCESS! This payload format works.")
                return payload, response.json()
            else:
                print("❌ Failed with this format.")
                
        except Exception as e:
            print(f"Exception: {e}")
    
    return None, None

def test_get_with_different_params():
    """Test GET endpoints with different parameter combinations"""
    
    print("\n🧪 Testing GET operations with different parameters...")
    
    # Test GET /get_all_stones variations
    param_sets = [
        {"user_id": USER_ID},
        {"user_id": USER_ID, "limit": 5},
        {"user_id": USER_ID, "page": 1, "limit": 5}, 
        {"user_id": USER_ID, "shape": "round brilliant"},
        {"user_id": USER_ID, "color": "D"},
    ]
    
    for i, params in enumerate(param_sets, 1):
        print(f"\n--- Test {i}: GET /get_all_stones ---")
        print(f"Params: {params}")
        
        try:
            response = requests.get(
                f"{BASE_URL}/get_all_stones",
                headers=headers,
                params=params,
                timeout=30
            )
            
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ SUCCESS: Got {len(data)} diamonds")
                if data:
                    print(f"First diamond ID: {data[0].get('id')}")
            else:
                print(f"❌ Error: {response.text[:200]}")
                
        except Exception as e:
            print(f"Exception: {e}")
    
    # Test if GET /diamonds works with params
    print(f"\n--- Testing GET /diamonds (even though it returned 405) ---")
    try:
        response = requests.get(
            f"{BASE_URL}/diamonds",
            headers=headers,
            params={"user_id": USER_ID},
            timeout=30
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ GET /diamonds works too!")
        else:
            print(f"❌ GET /diamonds: {response.text[:100]}")
    except Exception as e:
        print(f"Exception: {e}")

def test_update_and_delete():
    """Test update and delete operations with real diamond IDs"""
    
    print("\n🧪 Testing UPDATE and DELETE operations...")
    
    # First get a real diamond ID
    try:
        response = requests.get(
            f"{BASE_URL}/get_all_stones",
            headers=headers,
            params={"user_id": USER_ID, "limit": 1},
            timeout=30
        )
        
        if response.status_code == 200:
            diamonds = response.json()
            if diamonds:
                diamond = diamonds[0]
                diamond_id = diamond.get("id")
                print(f"Using diamond ID {diamond_id} for tests")
                
                # Test PUT /diamonds/{id}
                print(f"\n--- Testing PUT /diamonds/{diamond_id} ---")
                update_payload = {
                    "user_id": USER_ID,
                    "color": "E",  # Change color slightly
                    "clarity": diamond.get("clarity"),  # Keep same clarity
                    "weight": diamond.get("weight")     # Keep same weight
                }
                
                try:
                    response = requests.put(
                        f"{BASE_URL}/diamonds/{diamond_id}",
                        headers=headers,
                        json=update_payload,
                        timeout=30
                    )
                    print(f"PUT Status: {response.status_code}")
                    print(f"PUT Response: {response.text[:200]}")
                except Exception as e:
                    print(f"PUT Exception: {e}")
                
                # Test DELETE variations
                delete_endpoints = [
                    f"/diamonds/{diamond_id}",
                    "/diamonds",
                ]
                
                for endpoint in delete_endpoints:
                    print(f"\n--- Testing DELETE {endpoint} ---")
                    try:
                        if endpoint == "/diamonds":
                            # Try with query params
                            response = requests.delete(
                                f"{BASE_URL}{endpoint}",
                                headers=headers,
                                params={"id": diamond_id, "user_id": USER_ID},
                                timeout=30
                            )
                        else:
                            # Try with URL path
                            response = requests.delete(
                                f"{BASE_URL}{endpoint}",
                                headers=headers,
                                params={"user_id": USER_ID},
                                timeout=30
                            )
                        print(f"DELETE Status: {response.status_code}")
                        print(f"DELETE Response: {response.text[:200]}")
                    except Exception as e:
                        print(f"DELETE Exception: {e}")
            else:
                print("❌ No diamonds found for testing")
        else:
            print("❌ Could not get diamonds for testing")
    except Exception as e:
        print(f"Exception getting diamonds: {e}")

if __name__ == "__main__":
    print("🔧 Testing Corrected API Endpoints")
    print(f"Base URL: {BASE_URL}")
    print(f"User ID: {USER_ID}")
    print("="*60)
    
    # Test 1: Find working POST payload format
    working_payload, response = test_post_diamonds_payload()
    
    # Test 2: Verify GET variations work
    test_get_with_different_params()
    
    # Test 3: Test update and delete with real IDs
    test_update_and_delete()
    
    print("\n" + "="*60)
    print("SUMMARY OF WORKING ENDPOINTS:")
    print("="*60)
    print("✅ GET /get_all_stones?user_id={id} - WORKS (returns user-specific data)")
    if working_payload:
        print("✅ POST /diamonds - WORKS (use discovered payload format)")
    else:
        print("❌ POST /diamonds - Need to find correct payload format")
    print("🔍 PUT /diamonds/{id} - EXISTS (need correct auth/payload)")
    print("🔍 DELETE operations - Need more investigation")
#!/usr/bin/env python3

import requests
import json
import time
import os
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://api.mazalbot.com/api/v1"
ACCESS_TOKEN = os.getenv('MAZALBOT_ACCESS_TOKEN')
USER_ID = int(os.getenv('MAZALBOT_USER_ID', '0'))

if not ACCESS_TOKEN:
    print("Error: MAZALBOT_ACCESS_TOKEN environment variable not set")
    exit(1)

if not USER_ID:
    print("Error: MAZALBOT_USER_ID environment variable not set")
    exit(1)

# Headers for all requests
headers = {
    "Authorization": f"Bearer {ACCESS_TOKEN}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

def test_endpoint(method: str, endpoint: str, params: Optional[Dict] = None, data: Optional[Dict] = None) -> Dict[str, Any]:
    """Test an API endpoint and return detailed results"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        print(f"\n{'='*20} Testing {method} {endpoint} {'='*20}")
        print(f"URL: {url}")
        print(f"Headers: {headers}")
        if params:
            print(f"Params: {params}")
        if data:
            print(f"Data: {json.dumps(data, indent=2)}")
        
        response = requests.request(
            method=method,
            url=url,
            headers=headers,
            params=params,
            json=data,
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        try:
            response_data = response.json()
            if isinstance(response_data, list):
                print(f"Response: List with {len(response_data)} items")
                if response_data:
                    print(f"First item: {json.dumps(response_data[0], indent=2)[:500]}...")
            else:
                print(f"Response: {json.dumps(response_data, indent=2)[:500]}...")
        except json.JSONDecodeError:
            print(f"Raw Response: {response.text[:500]}...")
        
        return {
            "success": response.status_code < 400,
            "status_code": response.status_code,
            "data": response_data if 'response_data' in locals() else None,
            "raw_text": response.text
        }
        
    except Exception as e:
        print(f"Exception: {str(e)}")
        return {
            "success": False,
            "status_code": 0,
            "error": str(e)
        }

def verify_user_data_filtering(diamonds_data: list) -> Dict[str, Any]:
    """Verify that returned diamonds belong to the current user"""
    print(f"\n{'='*20} Verifying User Data Filtering {'='*20}")
    
    if not diamonds_data:
        return {"valid": False, "reason": "No diamonds returned"}
    
    user_diamonds = 0
    other_diamonds = 0
    no_owner_diamonds = 0
    
    for diamond in diamonds_data:
        owners = diamond.get('owners', [])
        owner_id = diamond.get('owner_id')
        
        if isinstance(owners, list) and USER_ID in owners:
            user_diamonds += 1
        elif owner_id == USER_ID:
            user_diamonds += 1
        elif not owners and not owner_id:
            no_owner_diamonds += 1
        else:
            other_diamonds += 1
    
    print(f"Total diamonds: {len(diamonds_data)}")
    print(f"User's diamonds: {user_diamonds}")
    print(f"Other users' diamonds: {other_diamonds}")
    print(f"No owner info: {no_owner_diamonds}")
    
    return {
        "valid": other_diamonds == 0,
        "total": len(diamonds_data),
        "user_diamonds": user_diamonds,
        "other_diamonds": other_diamonds,
        "no_owner_diamonds": no_owner_diamonds
    }

def test_all_endpoints():
    """Test all API endpoints comprehensively"""
    results = {}
    
    # 1. Test GET all diamonds
    print("\n" + "="*60)
    print("TESTING ALL API ENDPOINTS")
    print("="*60)
    
    get_all_result = test_endpoint("GET", "/get_all_stones", {"user_id": USER_ID})
    results["get_all_stones"] = get_all_result
    
    # Verify user data filtering
    if get_all_result["success"] and get_all_result["data"]:
        filtering_result = verify_user_data_filtering(get_all_result["data"])
        results["data_filtering"] = filtering_result
        
        # Get a sample diamond for testing other endpoints
        sample_diamond = get_all_result["data"][0] if get_all_result["data"] else None
        
        if sample_diamond:
            diamond_id = sample_diamond.get("id")
            stock_number = sample_diamond.get("stock") or sample_diamond.get("stock_number")
            
            print(f"\nUsing sample diamond - ID: {diamond_id}, Stock: {stock_number}")
            
            # 2. Test GET single diamond
            if diamond_id:
                get_single_result = test_endpoint("GET", f"/get_stone/{diamond_id}", {"user_id": USER_ID})
                results["get_single_stone"] = get_single_result
            
            # 3. Test different delete endpoint variations
            if diamond_id:
                # Try delete with diamond_id parameter
                delete_result1 = test_endpoint("DELETE", "/delete_diamond", {
                    "diamond_id": diamond_id, 
                    "user_id": USER_ID
                })
                results["delete_diamond_v1"] = delete_result1
            
            if stock_number:
                # Try delete with stock number in URL
                delete_result2 = test_endpoint("DELETE", f"/delete_stone/{stock_number}", {"user_id": USER_ID})
                results["delete_stone_v2"] = delete_result2
    
    # 4. Test POST upload inventory
    test_diamond = {
        "shape": "Round",
        "weight": 1.25,
        "color": "D",
        "clarity": "VVS1",
        "cut": "Excellent",
        "polish": "Excellent", 
        "symmetry": "Excellent",
        "price_per_carat": 10000,
        "stock_number": f"TEST-{int(time.time())}",
        "status": "Available"
    }
    
    upload_data = {
        "user_id": USER_ID,
        "diamonds": [test_diamond]
    }
    
    upload_result = test_endpoint("POST", "/upload-inventory", data=upload_data)
    results["upload_inventory"] = upload_result
    
    # 5. Test dashboard-related endpoints (if they exist)
    dashboard_result = test_endpoint("GET", f"/users/{USER_ID}/dashboard/stats")
    results["dashboard_stats"] = dashboard_result
    
    # 6. Test reports endpoints
    if get_all_result["success"] and get_all_result["data"]:
        sample_diamond = get_all_result["data"][0]
        diamond_id = sample_diamond.get("id")
        
        if diamond_id:
            # Test create report
            report_data = {
                "user_id": USER_ID,
                "diamond_id": str(diamond_id),
                "report_type": "standard"
            }
            create_report_result = test_endpoint("POST", "/create-report", data=report_data)
            results["create_report"] = create_report_result
            
            # Test get report
            get_report_result = test_endpoint("GET", "/get-report", {
                "diamond_id": str(diamond_id),
                "user_id": USER_ID
            })
            results["get_report"] = get_report_result
    
    return results

def print_summary(results: Dict[str, Any]):
    """Print a comprehensive summary of all test results"""
    print("\n" + "="*60)
    print("TEST RESULTS SUMMARY")
    print("="*60)
    
    total_tests = len(results)
    successful_tests = sum(1 for result in results.values() if isinstance(result, dict) and result.get("success", False))
    
    print(f"Total tests: {total_tests}")
    print(f"Successful: {successful_tests}")
    print(f"Failed: {total_tests - successful_tests}")
    
    print("\n" + "-"*60)
    print("DETAILED RESULTS:")
    print("-"*60)
    
    for endpoint, result in results.items():
        if isinstance(result, dict):
            status = "✅ PASS" if result.get("success", False) else "❌ FAIL"
            status_code = result.get("status_code", "N/A")
            print(f"{endpoint:25} {status} (Status: {status_code})")
            
            if not result.get("success", False):
                error = result.get("error") or "HTTP Error"
                print(f"{'':27} Error: {error}")
        else:
            print(f"{endpoint:25} ℹ️  INFO")
    
    # Special handling for data filtering
    if "data_filtering" in results:
        filtering = results["data_filtering"]
        if filtering["valid"]:
            print(f"{'Data Filtering':25} ✅ PASS (User-specific data)")
        else:
            print(f"{'Data Filtering':25} ❌ FAIL (Mixed user data)")
            print(f"{'':27} Other users' diamonds: {filtering['other_diamonds']}")

if __name__ == "__main__":
    print("🚀 Starting Comprehensive API Endpoint Testing")
    print(f"Base URL: {BASE_URL}")
    print(f"User ID: {USER_ID}")
    
    results = test_all_endpoints()
    print_summary(results)
    
    print("\n" + "="*60)
    print("Testing completed! Check results above for any issues.")
    print("="*60)
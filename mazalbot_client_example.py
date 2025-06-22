"""
Example usage of the MazalbotClient class for diamond inventory management.

This script demonstrates how to use the MazalbotClient to perform various
operations on the diamond inventory, including retrieving, adding, updating,
and deleting diamonds.
"""

import logging
import json
from mazalbot_client import MazalbotClient, DiamondData


def main():
    # Set up logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Initialize client with your credentials
    client = MazalbotClient(
        base_url="https://api.mazalbot.com",
        access_token="ifj9ov1rh20fslfp",
        user_id=2138564172,  # Replace with your actual user ID
        log_level="INFO"
    )
    
    # Example 1: Get all diamonds
    print("\n=== Getting All Diamonds ===")
    response = client.get_diamonds(page=1, limit=10)
    if response.success:
        diamonds = response.data
        print(f"Found {len(diamonds)} diamonds")
        
        # Print first diamond details
        if diamonds:
            print("\nFirst diamond details:")
            print(json.dumps(diamonds[0], indent=2))
    else:
        print(f"Error: {response.error}")
    
    # Example 2: Search for diamonds with specific criteria
    print("\n=== Searching for Diamonds ===")
    search_criteria = {
        "shape": "Round",
        "color": "D"
    }
    response = client.search_diamonds(search_criteria)
    if response.success:
        diamonds = response.data
        print(f"Found {len(diamonds)} matching diamonds")
    else:
        print(f"Error searching diamonds: {response.error}")
    
    # Example 3: Add a new diamond
    print("\n=== Adding a New Diamond ===")
    new_diamond: DiamondData = {
        "shape": "Round",
        "weight": 1.25,
        "color": "D",
        "clarity": "VVS1",
        "price_per_carat": 10000,
        "stock_number": f"D{int(time.time())}"  # Generate unique stock number
    }
    
    # Uncomment to actually add a diamond
    """
    response = client.add_diamond(new_diamond)
    if response.success:
        print(f"Added diamond with ID: {response.data.get('id')}")
        
        # Store the ID for later examples
        added_diamond_id = response.data.get('id')
    else:
        print(f"Error adding diamond: {response.error}")
        added_diamond_id = None
    """
    
    # For demonstration, we'll assume a diamond ID
    added_diamond_id = "example_diamond_id"
    
    # Example 4: Update a diamond
    if added_diamond_id:
        print("\n=== Updating a Diamond ===")
        update_data: DiamondData = {
            "price_per_carat": 11000,  # Increase the price
            "status": "Reserved"       # Change the status
        }
        
        # Uncomment to actually update a diamond
        """
        response = client.update_diamond(added_diamond_id, update_data)
        if response.success:
            print(f"Updated diamond {added_diamond_id}")
        else:
            print(f"Error updating diamond: {response.error}")
        """
    
    # Example 5: Delete a diamond
    if added_diamond_id:
        print("\n=== Deleting a Diamond ===")
        
        # Uncomment to actually delete a diamond
        """
        response = client.delete_diamond(added_diamond_id)
        if response.success:
            print(f"Deleted diamond {added_diamond_id}")
        else:
            print(f"Error deleting diamond: {response.error}")
        """
    
    # Example 6: Get dashboard statistics
    print("\n=== Getting Dashboard Statistics ===")
    response = client.get_dashboard_stats()
    if response.success:
        print("Dashboard statistics:")
        print(json.dumps(response.data, indent=2))
    else:
        print(f"Error getting dashboard stats: {response.error}")
    
    # Example 7: Get inventory distribution by shape
    print("\n=== Getting Inventory by Shape ===")
    response = client.get_inventory_by_shape()
    if response.success:
        print("Inventory distribution by shape:")
        print(json.dumps(response.data, indent=2))
    else:
        print(f"Error getting inventory distribution: {response.error}")


if __name__ == "__main__":
    import time  # Import here to avoid conflict with the global import
    main()
import requests
import time
import logging
import json
from typing import Dict, List, Optional, Union, Any, TypedDict, Literal
from dataclasses import dataclass
from urllib.parse import urljoin


class DiamondData(TypedDict, total=False):
    """Type definition for diamond data"""
    id: str
    stock_number: str
    shape: str
    weight: float
    carat: float
    color: str
    clarity: str
    cut: Optional[str]
    polish: Optional[str]
    symmetry: Optional[str]
    price_per_carat: Optional[float]
    price: Optional[float]
    status: Optional[str]
    picture: Optional[str]
    certificate_url: Optional[str]
    certificate_number: Optional[str]
    lab: Optional[str]
    fluorescence: Optional[str]
    owners: Optional[List[int]]
    owner_id: Optional[int]


@dataclass
class ApiResponse:
    """Standardized API response object"""
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
    status_code: int = 200
    message: Optional[str] = None


class MazalbotClient:
    """
    Client for interacting with the Mazalbot Diamond Inventory API.
    
    This class provides methods for all CRUD operations on diamond inventory,
    with proper error handling, authentication, and validation.
    
    Example usage:
    ```python
    # Initialize the client
    client = MazalbotClient(
        base_url="https://api.mazalbot.com",
        access_token="ifj9ov1rh20fslfp",
        user_id=123456789
    )
    
    # Get all diamonds
    response = client.get_diamonds()
    if response.success:
        diamonds = response.data
        print(f"Found {len(diamonds)} diamonds")
    else:
        print(f"Error: {response.error}")
    
    # Add a new diamond
    new_diamond = {
        "shape": "Round",
        "weight": 1.25,
        "color": "D",
        "clarity": "VVS1",
        "price_per_carat": 10000,
        "stock_number": "D12345"
    }
    response = client.add_diamond(new_diamond)
    if response.success:
        print(f"Added diamond with ID: {response.data['id']}")
    
    # Delete a diamond
    response = client.delete_diamond("diamond_id_here")
    if response.success:
        print("Diamond deleted successfully")
    ```
    """
    
    def __init__(
        self, 
        base_url: str = "https://api.mazalbot.com", 
        access_token: Optional[str] = None,
        user_id: Optional[int] = None,
        max_retries: int = 3,
        retry_delay: float = 1.0,
        timeout: int = 30,
        log_level: str = "INFO"
    ):
        """
        Initialize the Mazalbot API client.
        
        Args:
            base_url: Base URL of the Mazalbot API
            access_token: API access token for authentication (required)
            user_id: User ID for filtering operations (required for most endpoints)
            max_retries: Maximum number of retry attempts for failed requests
            retry_delay: Delay between retry attempts in seconds
            timeout: Request timeout in seconds
            log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        
        Raises:
            ValueError: If access_token is not provided
        """
        if not access_token:
            raise ValueError("access_token is required and cannot be None or empty")
        
        self.base_url = base_url.rstrip('/')
        self.access_token = access_token
        self.user_id = user_id
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self.timeout = timeout
        
        # Set up logging
        self.logger = logging.getLogger("mazalbot_client")
        log_level_map = {
            "DEBUG": logging.DEBUG,
            "INFO": logging.INFO,
            "WARNING": logging.WARNING,
            "ERROR": logging.ERROR,
            "CRITICAL": logging.CRITICAL
        }
        self.logger.setLevel(log_level_map.get(log_level, logging.INFO))
        
        # Create console handler if none exists
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
        
        self.logger.info(f"Initialized Mazalbot client with base URL: {self.base_url}")
    
    def _get_headers(self) -> Dict[str, str]:
        """
        Get the headers for API requests.
        
        Returns:
            Dict containing the necessary headers for API requests
        """
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    
    def _make_request(
        self, 
        method: Literal["GET", "POST", "PUT", "DELETE"], 
        endpoint: str, 
        params: Optional[Dict[str, Any]] = None,
        data: Optional[Dict[str, Any]] = None,
        retry_on_codes: List[int] = [429, 500, 502, 503, 504]
    ) -> ApiResponse:
        """
        Make an HTTP request to the API with retry logic.
        
        Args:
            method: HTTP method (GET, POST, PUT, DELETE)
            endpoint: API endpoint (without base URL)
            params: Query parameters
            data: Request body data
            retry_on_codes: HTTP status codes that should trigger a retry
            
        Returns:
            ApiResponse object with standardized response data
        """
        url = urljoin(self.base_url, endpoint.lstrip('/'))
        headers = self._get_headers()
        
        # Add user_id to params if not present and available
        if params is None:
            params = {}
        
        if self.user_id is not None and 'user_id' not in params:
            params['user_id'] = self.user_id
        
        self.logger.debug(f"Making {method} request to {url}")
        self.logger.debug(f"Params: {params}")
        if data:
            self.logger.debug(f"Data: {json.dumps(data, default=str)[:500]}...")
        
        attempts = 0
        while attempts < self.max_retries:
            try:
                response = requests.request(
                    method=method,
                    url=url,
                    headers=headers,
                    params=params,
                    json=data,
                    timeout=self.timeout
                )
                
                # Try to parse JSON response
                try:
                    response_data = response.json()
                except (json.JSONDecodeError, ValueError):
                    response_data = {"message": response.text}
                
                # Check if response was successful
                if response.status_code < 400:
                    self.logger.debug(f"Request successful: {response.status_code}")
                    return ApiResponse(
                        success=True,
                        data=response_data.get("data", response_data),
                        status_code=response.status_code,
                        message=response_data.get("message")
                    )
                
                # Check if we should retry
                if response.status_code in retry_on_codes and attempts < self.max_retries - 1:
                    attempts += 1
                    retry_time = self.retry_delay * (2 ** attempts)  # Exponential backoff
                    self.logger.warning(
                        f"Request failed with status {response.status_code}. "
                        f"Retrying in {retry_time:.2f}s ({attempts}/{self.max_retries})"
                    )
                    time.sleep(retry_time)
                    continue
                
                # Request failed and we're not retrying
                error_message = response_data.get("error", response_data.get("message", f"HTTP {response.status_code}"))
                self.logger.error(f"Request failed: {response.status_code} - {error_message}")
                return ApiResponse(
                    success=False,
                    error=error_message,
                    status_code=response.status_code
                )
                
            except requests.RequestException as e:
                # Network-related error
                if attempts < self.max_retries - 1:
                    attempts += 1
                    retry_time = self.retry_delay * (2 ** attempts)
                    self.logger.warning(
                        f"Request failed with exception: {str(e)}. "
                        f"Retrying in {retry_time:.2f}s ({attempts}/{self.max_retries})"
                    )
                    time.sleep(retry_time)
                else:
                    self.logger.error(f"Request failed after {self.max_retries} attempts: {str(e)}")
                    return ApiResponse(
                        success=False,
                        error=f"Network error: {str(e)}",
                        status_code=0
                    )
        
        # This should never be reached, but just in case
        return ApiResponse(
            success=False,
            error="Maximum retry attempts exceeded",
            status_code=0
        )
    
    def get_diamonds(
        self, 
        page: int = 1, 
        limit: int = 100,
        filters: Optional[Dict[str, Any]] = None
    ) -> ApiResponse:
        """
        Get diamonds from the inventory with pagination.
        
        Args:
            page: Page number (1-based)
            limit: Number of items per page
            filters: Optional filters to apply (shape, color, clarity, etc.)
            
        Returns:
            ApiResponse containing the list of diamonds if successful
        """
        if self.user_id is None:
            return ApiResponse(
                success=False,
                error="User ID is required for this operation",
                status_code=400
            )
        
        params = {
            "user_id": self.user_id,
            "page": page,
            "limit": limit
        }
        
        # Add any additional filters
        if filters:
            params.update(filters)
        
        return self._make_request(
            method="GET",
            endpoint="/api/v1/get_all_stones",
            params=params
        )
    
    def get_diamond(self, diamond_id: str) -> ApiResponse:
        """
        Get a specific diamond by ID.
        
        Args:
            diamond_id: The ID of the diamond to retrieve
            
        Returns:
            ApiResponse containing the diamond data if successful
        """
        if self.user_id is None:
            return ApiResponse(
                success=False,
                error="User ID is required for this operation",
                status_code=400
            )
        
        params = {"user_id": self.user_id}
        
        return self._make_request(
            method="GET",
            endpoint=f"/api/v1/get_stone/{diamond_id}",
            params=params
        )
    
    def add_diamond(self, diamond_data: DiamondData) -> ApiResponse:
        """
        Add a new diamond to the inventory.
        
        Args:
            diamond_data: Dictionary containing the diamond data
            
        Returns:
            ApiResponse containing the created diamond data if successful
        """
        if self.user_id is None:
            return ApiResponse(
                success=False,
                error="User ID is required for this operation",
                status_code=400
            )
        
        # Validate required fields
        required_fields = ["shape", "weight", "color", "clarity"]
        missing_fields = [field for field in required_fields if field not in diamond_data]
        
        if missing_fields:
            return ApiResponse(
                success=False,
                error=f"Missing required fields: {', '.join(missing_fields)}",
                status_code=400
            )
        
        # Ensure user_id is included in the data
        data = {
            "user_id": self.user_id,
            "diamonds": [diamond_data]
        }
        
        return self._make_request(
            method="POST",
            endpoint="/api/v1/upload-inventory",
            data=data
        )
    
    def add_diamonds(self, diamonds: List[DiamondData]) -> ApiResponse:
        """
        Add multiple diamonds to the inventory in a single request.
        
        Args:
            diamonds: List of dictionaries containing diamond data
            
        Returns:
            ApiResponse containing the created diamonds data if successful
        """
        if self.user_id is None:
            return ApiResponse(
                success=False,
                error="User ID is required for this operation",
                status_code=400
            )
        
        if not diamonds:
            return ApiResponse(
                success=False,
                error="No diamonds provided",
                status_code=400
            )
        
        # Validate required fields for each diamond
        required_fields = ["shape", "weight", "color", "clarity"]
        for i, diamond in enumerate(diamonds):
            missing_fields = [field for field in required_fields if field not in diamond]
            if missing_fields:
                return ApiResponse(
                    success=False,
                    error=f"Diamond at index {i} is missing required fields: {', '.join(missing_fields)}",
                    status_code=400
                )
        
        # Prepare data for bulk upload
        data = {
            "user_id": self.user_id,
            "diamonds": diamonds
        }
        
        return self._make_request(
            method="POST",
            endpoint="/api/v1/upload-inventory",
            data=data
        )
    
    def update_diamond(self, diamond_id: str, diamond_data: DiamondData) -> ApiResponse:
        """
        Update an existing diamond.
        
        Args:
            diamond_id: The ID of the diamond to update
            diamond_data: Dictionary containing the updated diamond data
            
        Returns:
            ApiResponse containing the updated diamond data if successful
        """
        if self.user_id is None:
            return ApiResponse(
                success=False,
                error="User ID is required for this operation",
                status_code=400
            )
        
        # Prepare data for update
        data = {
            "user_id": self.user_id,
            **diamond_data
        }
        
        return self._make_request(
            method="PUT",
            endpoint=f"/api/v1/update_diamond/{diamond_id}",
            data=data
        )
    
    def delete_diamond(self, diamond_id: str) -> ApiResponse:
        """
        Delete a diamond from the inventory.
        
        Args:
            diamond_id: The ID of the diamond to delete
            
        Returns:
            ApiResponse indicating success or failure
        """
        if self.user_id is None:
            return ApiResponse(
                success=False,
                error="User ID is required for this operation",
                status_code=400
            )
        
        params = {"user_id": self.user_id}
        
        return self._make_request(
            method="DELETE",
            endpoint=f"/api/v1/delete_diamond",
            params={"diamond_id": diamond_id, "user_id": self.user_id}
        )
    
    def create_report(self, diamond_id: str, report_type: str = "standard") -> ApiResponse:
        """
        Create a report for a specific diamond.
        
        Args:
            diamond_id: The ID of the diamond to create a report for
            report_type: Type of report to create (standard, detailed, etc.)
            
        Returns:
            ApiResponse containing the report data if successful
        """
        if self.user_id is None:
            return ApiResponse(
                success=False,
                error="User ID is required for this operation",
                status_code=400
            )
        
        data = {
            "user_id": self.user_id,
            "diamond_id": diamond_id,
            "report_type": report_type
        }
        
        return self._make_request(
            method="POST",
            endpoint="/api/v1/create-report",
            data=data
        )
    
    def get_report(self, report_id: str) -> ApiResponse:
        """
        Get a specific report by ID.
        
        Args:
            report_id: The ID of the report to retrieve
            
        Returns:
            ApiResponse containing the report data if successful
        """
        if self.user_id is None:
            return ApiResponse(
                success=False,
                error="User ID is required for this operation",
                status_code=400
            )
        
        params = {
            "user_id": self.user_id,
            "diamond_id": report_id
        }
        
        return self._make_request(
            method="GET",
            endpoint="/api/v1/get-report",
            params=params
        )
    
    def search_diamonds(self, search_criteria: Dict[str, Any]) -> ApiResponse:
        """
        Search for diamonds based on specific criteria.
        
        Args:
            search_criteria: Dictionary containing search parameters
            
        Returns:
            ApiResponse containing the matching diamonds if successful
        """
        if self.user_id is None:
            return ApiResponse(
                success=False,
                error="User ID is required for this operation",
                status_code=400
            )
        
        # Add user_id to search criteria
        search_criteria["user_id"] = self.user_id
        
        return self._make_request(
            method="GET",
            endpoint="/api/v1/get_all_stones",
            params=search_criteria
        )
    
    def get_dashboard_stats(self) -> ApiResponse:
        """
        Get dashboard statistics for the current user.
        
        Returns:
            ApiResponse containing dashboard statistics if successful
        """
        if self.user_id is None:
            return ApiResponse(
                success=False,
                error="User ID is required for this operation",
                status_code=400
            )
        
        return self._make_request(
            method="GET",
            endpoint=f"/api/v1/users/{self.user_id}/dashboard/stats"
        )
    
    def get_inventory_by_shape(self) -> ApiResponse:
        """
        Get inventory distribution by shape.
        
        Returns:
            ApiResponse containing inventory distribution data if successful
        """
        if self.user_id is None:
            return ApiResponse(
                success=False,
                error="User ID is required for this operation",
                status_code=400
            )
        
        return self._make_request(
            method="GET",
            endpoint=f"/api/v1/users/{self.user_id}/inventory/by-shape"
        )
    
    def get_recent_sales(self) -> ApiResponse:
        """
        Get recent sales data.
        
        Returns:
            ApiResponse containing recent sales data if successful
        """
        if self.user_id is None:
            return ApiResponse(
                success=False,
                error="User ID is required for this operation",
                status_code=400
            )
        
        return self._make_request(
            method="GET",
            endpoint=f"/api/v1/users/{self.user_id}/sales/recent"
        )


# Example usage
if __name__ == "__main__":
    # Set up logging
    logging.basicConfig(level=logging.INFO)
    
    # Initialize client - get credentials from environment variables for security
    import os
    access_token = os.getenv('MAZALBOT_ACCESS_TOKEN')
    if not access_token:
        print("Error: MAZALBOT_ACCESS_TOKEN environment variable not set")
        exit(1)
    
    client = MazalbotClient(
        base_url="https://api.mazalbot.com",
        access_token=access_token,
        user_id=2138564172  # Example user ID
    )
    
    # Get all diamonds
    response = client.get_diamonds()
    if response.success:
        diamonds = response.data
        print(f"Found {len(diamonds)} diamonds")
        
        # Print first diamond details
        if diamonds:
            print("First diamond details:")
            print(json.dumps(diamonds[0], indent=2))
    else:
        print(f"Error: {response.error}")
    
    # Example: Add a new diamond
    """
    new_diamond = {
        "shape": "Round",
        "weight": 1.25,
        "color": "D",
        "clarity": "VVS1",
        "price_per_carat": 10000,
        "stock_number": "D12345"
    }
    response = client.add_diamond(new_diamond)
    if response.success:
        print(f"Added diamond with ID: {response.data.get('id')}")
    else:
        print(f"Error adding diamond: {response.error}")
    """
    
    # Example: Search for diamonds
    """
    search_criteria = {
        "shape": "Round",
        "color": "D",
        "clarity": "VVS1"
    }
    response = client.search_diamonds(search_criteria)
    if response.success:
        diamonds = response.data
        print(f"Found {len(diamonds)} matching diamonds")
    else:
        print(f"Error searching diamonds: {response.error}")
    """
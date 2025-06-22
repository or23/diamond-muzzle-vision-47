# Mazalbot Diamond Inventory API Specification

## Overview

This document provides a comprehensive specification for the Mazalbot Diamond Inventory API, which allows for managing diamond inventory data through RESTful endpoints.

## Base URL

```
https://api.mazalbot.com/api/v1
```

## Authentication

All API requests require authentication using a bearer token.

**Header**:
```
Authorization: Bearer ifj9ov1rh20fslfp
```

## Endpoints

### 1. Get All Diamonds

Retrieves all diamonds for a specific user.

**Endpoint**: `GET /get_all_stones`

**Parameters**:
- `user_id` (required): The ID of the user whose diamonds to retrieve
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 100)
- Additional filter parameters (optional): shape, color, clarity, etc.

**Response**:
```json
[
  {
    "id": "string",
    "shape": "string",
    "weight": number,
    "color": "string",
    "clarity": "string",
    "cut": "string",
    "polish": "string",
    "symmetry": "string",
    "price_per_carat": number,
    "stock_number": "string",
    "status": "string",
    "picture": "string",
    "certificate_url": "string",
    "owners": [number],
    "owner_id": number
  }
]
```

### 2. Get Single Diamond

Retrieves a specific diamond by ID.

**Endpoint**: `GET /get_stone/{diamond_id}`

**Parameters**:
- `user_id` (required): The ID of the user who owns the diamond

**Response**: Same as single diamond object from Get All Diamonds

### 3. Add Diamonds

Adds one or more diamonds to the inventory.

**Endpoint**: `POST /upload-inventory`

**Request Body**:
```json
{
  "user_id": number,
  "diamonds": [
    {
      "shape": "string",
      "weight": number,
      "color": "string",
      "clarity": "string",
      "cut": "string",
      "polish": "string",
      "symmetry": "string",
      "price_per_carat": number,
      "stock_number": "string",
      "status": "string",
      "picture": "string",
      "certificate_url": "string"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "stock_number": "string"
    }
  ]
}
```

### 4. Update Diamond

Updates an existing diamond.

**Endpoint**: `PUT /update_diamond/{diamond_id}`

**Request Body**:
```json
{
  "user_id": number,
  "shape": "string",
  "weight": number,
  "color": "string",
  "clarity": "string",
  "cut": "string",
  "polish": "string",
  "symmetry": "string",
  "price_per_carat": number,
  "stock_number": "string",
  "status": "string",
  "picture": "string",
  "certificate_url": "string"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "stock_number": "string"
  }
}
```

### 5. Delete Diamond

Deletes a diamond from the inventory.

**Endpoint**: `DELETE /delete_diamond`

**Parameters**:
- `diamond_id` (required): The ID of the diamond to delete
- `user_id` (required): The ID of the user who owns the diamond

**Response**:
```json
{
  "success": true,
  "message": "Diamond deleted successfully"
}
```

### 6. Create Report

Creates a report for a specific diamond.

**Endpoint**: `POST /create-report`

**Request Body**:
```json
{
  "user_id": number,
  "diamond_id": "string",
  "report_type": "string"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "report_id": "string",
    "report_url": "string"
  }
}
```

### 7. Get Report

Retrieves a specific report.

**Endpoint**: `GET /get-report`

**Parameters**:
- `diamond_id` (required): The ID of the diamond report to retrieve
- `user_id` (required): The ID of the user who owns the report

**Response**:
```json
{
  "success": true,
  "data": {
    "report_id": "string",
    "diamond_id": "string",
    "report_type": "string",
    "report_url": "string",
    "created_at": "string"
  }
}
```

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message",
  "status_code": number
}
```

Common error codes:
- `400`: Bad Request - Invalid parameters or request body
- `401`: Unauthorized - Invalid or missing authentication
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server-side error

## Rate Limiting

The API implements rate limiting to prevent abuse. Clients should respect the following headers:
- `X-RateLimit-Limit`: Maximum number of requests allowed in a time window
- `X-RateLimit-Remaining`: Number of requests remaining in the current time window
- `X-RateLimit-Reset`: Time (in seconds) until the rate limit resets

## Pagination

Endpoints that return multiple items support pagination through the following parameters:
- `page`: Page number (1-based)
- `limit`: Number of items per page

Response headers for paginated endpoints:
- `X-Total-Count`: Total number of items
- `X-Total-Pages`: Total number of pages
# API Documentation

## Authentication

### Login
- **Endpoint**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "username": "admin",
      "role": "admin"
    }
  }
  ```

## Admin Reports

### Get Reports
- **Endpoint**: `GET /api/admin/reports`
- **Query Params**: `status` (draft, published), `limit`, `page`
- **Headers**: `Authorization: Bearer <token>`

### Create Report
- **Endpoint**: `POST /api/admin/reports`
- **Body**:
  ```json
  {
    "sport": "NFL"
  }
  ```

### Update Pick
- **Endpoint**: `PATCH /api/admin/picks/:pickId`
- **Body**:
  ```json
  {
    "units": 3,
    "analysis": "Updated analysis"
  }
  ```

### Publish Report
- **Endpoint**: `POST /api/admin/reports/:reportId/publish`

## Client API

### Get Published Reports
- **Endpoint**: `GET /api/client/reports`
- **Response**: List of published reports with picks.

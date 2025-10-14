# API Documentation

## Base URL
- **Development**: `http://localhost:5000`
- **Production**: `https://drive-like-api.vercel.app`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: <your-jwt-token>
```

---

## Endpoints

### Authentication

#### 1. Register User
- **POST** `/api/auth/register`
- **Description**: Register a new user
- **Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```
- **Response**:
```json
{
  "message": "User registered successfully"
}
```

#### 2. Login User
- **POST** `/api/auth/login`
- **Description**: Login with email and password
- **Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response**:
```json
{
  "token": "jwt-token-string"
}
```

---

### Folders

#### 3. Create Folder
- **POST** `/api/folders`
- **Description**: Create a new folder (supports nested folders)
- **Headers**: `Authorization: <token>`
- **Request Body**:
```json
{
  "name": "string",
  "parentFolder": "folder-id or null"
}
```
- **Response**:
```json
{
  "_id": "folder-id",
  "name": "string",
  "parentFolder": "parent-folder-id or null",
  "user": "user-id"
}
```

#### 4. Get User Folders
- **GET** `/api/folders`
- **Description**: Get all folders for the authenticated user
- **Headers**: `Authorization: <token>`
- **Response**:
```json
[
  {
    "_id": "folder-id",
    "name": "string",
    "parentFolder": "parent-folder-id or null",
    "user": "user-id"
  }
]
```

---

### Images

#### 5. Upload Image
- **POST** `/api/images`
- **Description**: Upload an image to a folder
- **Headers**: `Authorization: <token>`
- **Request Body** (multipart/form-data):
  - `name`: Image name (string)
  - `folder`: Folder ID (string)
  - `image`: Image file (file)
- **Response**:
```json
{
  "_id": "image-id",
  "name": "string",
  "url": "gridfs-file-id",
  "folder": "folder-id",
  "user": "user-id"
}
```

#### 6. Get User Images
- **GET** `/api/images`
- **Description**: Get all images for the authenticated user
- **Headers**: `Authorization: <token>`
- **Response**:
```json
[
  {
    "_id": "image-id",
    "name": "string",
    "url": "gridfs-file-id",
    "folder": "folder-id",
    "user": "user-id"
  }
]
```

#### 7. Get Image File
- **GET** `/api/images/:id`
- **Description**: Retrieve the actual image file by its GridFS ID
- **Parameters**: `id` - GridFS file ID
- **Response**: Image file (binary data)

---

### Search

#### 8. Search Images
- **GET** `/api/search?q=<query>`
- **Description**: Search for images by name
- **Headers**: `Authorization: <token>`
- **Query Parameters**:
  - `q`: Search query string
- **Response**:
```json
[
  {
    "_id": "image-id",
    "name": "string",
    "url": "gridfs-file-id",
    "folder": "folder-id",
    "user": "user-id"
  }
]
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Error message describing the bad request"
}
```

### 401 Unauthorized
```json
{
  "error": "Access Denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error message describing the server error"
}
```

---

## Notes

- Maximum file size for image uploads: **5MB**
- Supported image formats: All standard image formats (PNG, JPG, JPEG, GIF, etc.)
- Images are stored using MongoDB GridFS
- Users can only access their own folders and images
- Folders support nesting (Google Drive-like structure)

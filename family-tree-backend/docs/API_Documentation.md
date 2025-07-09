# Family Tree API Documentation

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [Family Management APIs](#family-management-apis)
3. [User Management APIs](#user-management-apis)
4. [Image Management APIs](#image-management-apis)
5. [Public APIs](#public-apis)
6. [Relationship APIs](#relationship-apis)
7. [Error Codes Reference](#error-codes-reference)
8. [Data Models](#data-models)

---

## Authentication APIs

### 1. User Registration

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user account

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123!",
  "email": "john@example.com",
  "mobile": "+1234567890"
}
```

**Happy Flow Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "johndoe",
  "familyName": null,
  "familyKey": "johndoe",
  "expiresIn": 2592000000
}
```

**Error Flow Responses:**

**400 Bad Request - Username exists:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Username already exists",
  "path": "/api/auth/register"
}
```

**400 Bad Request - Validation errors:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input data",
  "path": "/api/auth/register",
  "validationErrors": {
    "username": "Username is required",
    "password": "Password is required",
    "email": "Invalid email format"
  }
}
```

---

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and get access token

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**Happy Flow Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "johndoe",
  "familyName": "The Doe Family",
  "familyKey": "johndoe",
  "expiresIn": 2592000000
}
```

**Error Flow Responses:**

**401 Unauthorized - Invalid credentials:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid username or password",
  "path": "/api/auth/login"
}
```

**400 Bad Request - Missing fields:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input data",
  "path": "/api/auth/login",
  "validationErrors": {
    "username": "Username is required",
    "password": "Password is required"
  }
}
```

---

### 3. Google Sign-In

**Endpoint:** `POST /api/auth/google-signin`

**Description:** Authenticate user with Google OAuth token

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
"google-oauth-token-here"
```

**Happy Flow Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "google_1642234567890",
  "familyName": null,
  "familyKey": "google_1642234567890",
  "expiresIn": 2592000000
}
```

**Error Flow Response:**

**400 Bad Request - Invalid Google token:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid Google token",
  "path": "/api/auth/google-signin"
}
```

---

### 4. User Logout

**Endpoint:** `POST /api/auth/logout`

**Description:** Logout user and invalidate token

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Happy Flow Response (200 OK):**
```json
{}
```

**Error Flow Response:**

**401 Unauthorized - Invalid token:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "path": "/api/auth/logout"
}
```

---

## Family Management APIs

### 1. Create Family

**Endpoint:** `POST /api/family/create`

**Description:** Create a new family tree

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Parameters:**
```
familyName=The Doe Family
```

**Happy Flow Response (200 OK):**
```json
{
  "id": "64a7b8c9d1e2f3a4b5c6d7e8",
  "name": "The Doe Family",
  "familyKey": "johndoe",
  "members": [],
  "relationships": [],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Flow Responses:**

**400 Bad Request - Family already exists:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Family already exists for this user",
  "path": "/api/family/create"
}
```

**401 Unauthorized:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Access denied",
  "path": "/api/family/create"
}
```

---

### 2. Get Family

**Endpoint:** `GET /api/family/{familyKey}`

**Description:** Retrieve family tree details

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Path Parameters:**
- `familyKey` (string): Unique family identifier

**Happy Flow Response (200 OK):**
```json
{
  "id": "64a7b8c9d1e2f3a4b5c6d7e8",
  "name": "The Doe Family",
  "familyKey": "johndoe",
  "members": [
    {
      "id": "64a7b8c9d1e2f3a4b5c6d7e9",
      "fullName": "John Doe",
      "nickName": "Johnny",
      "mobile": "+1234567890",
      "email": "john@example.com",
      "imageUrl": "https://s3.wasabisys.com/bucket/users/john.jpg",
      "bio": "Family patriarch",
      "gender": "MALE",
      "bloodGroup": "O+",
      "birthDay": "1980-05-15",
      "marriageAnniversary": "2005-06-20",
      "rewards": "Best Father Award 2023",
      "job": "Software Engineer",
      "education": "Computer Science Degree",
      "familyDoctor": "Dr. Smith",
      "deathAnniversary": null,
      "location": 0,
      "isActive": true,
      "relationships": {
        "spouseId": "64a7b8c9d1e2f3a4b5c6d7ea",
        "childrenIds": ["64a7b8c9d1e2f3a4b5c6d7eb"],
        "parentIds": [],
        "motherId": null,
        "fatherId": null
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "relationships": [
    {
      "id": "64a7b8c9d1e2f3a4b5c6d7ec",
      "fromId": "64a7b8c9d1e2f3a4b5c6d7e9",
      "toId": "64a7b8c9d1e2f3a4b5c6d7ea",
      "type": "SPOUSE",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Flow Responses:**

**404 Not Found:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Family not found",
  "path": "/api/family/johndoe"
}
```

---

### 3. Add Family Member

**Endpoint:** `POST /api/family/{familyKey}/members`

**Description:** Add a new member to the family tree

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Path Parameters:**
- `familyKey` (string): Unique family identifier

**Query Parameters:**
- `parentId` (string, optional): ID of parent member
- `relationshipType` (string, optional): Type of relationship (child, spouse, parent, mother, father)

**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "nickName": "Janie",
  "mobile": "+1234567891",
  "email": "jane@example.com",
  "bio": "Loving mother and teacher",
  "gender": "FEMALE",
  "bloodGroup": "A+",
  "birthDay": "1982-08-22",
  "marriageAnniversary": "2005-06-20",
  "rewards": "Teacher of the Year 2022",
  "job": "Elementary School Teacher",
  "education": "Education Degree",
  "familyDoctor": "Dr. Smith",
  "deathAnniversary": null,
  "imageUrl": "https://s3.wasabisys.com/bucket/users/jane.jpg",
  "location": 1
}
```

**Happy Flow Response (200 OK):**
```json
{
  "id": "64a7b8c9d1e2f3a4b5c6d7ea",
  "fullName": "Jane Doe",
  "nickName": "Janie",
  "mobile": "+1234567891",
  "email": "jane@example.com",
  "imageUrl": "https://s3.wasabisys.com/bucket/users/jane.jpg",
  "bio": "Loving mother and teacher",
  "gender": "FEMALE",
  "bloodGroup": "A+",
  "birthDay": "1982-08-22",
  "marriageAnniversary": "2005-06-20",
  "rewards": "Teacher of the Year 2022",
  "job": "Elementary School Teacher",
  "education": "Education Degree",
  "familyDoctor": "Dr. Smith",
  "deathAnniversary": null,
  "location": 1,
  "isActive": true,
  "relationships": {
    "spouseId": "64a7b8c9d1e2f3a4b5c6d7e9",
    "childrenIds": [],
    "parentIds": [],
    "motherId": null,
    "fatherId": null
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Flow Responses:**

**400 Bad Request - Validation errors:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input data",
  "path": "/api/family/johndoe/members",
  "validationErrors": {
    "fullName": "Full name is required",
    "email": "Invalid email format"
  }
}
```

**404 Not Found - Family not found:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Family not found",
  "path": "/api/family/johndoe/members"
}
```

**400 Bad Request - Invalid relationship:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid relationship type: invalidType",
  "path": "/api/family/johndoe/members"
}
```

---

### 4. Remove Family Member

**Endpoint:** `DELETE /api/family/{familyKey}/members/{userId}`

**Description:** Remove a member from the family tree (marks as inactive)

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Path Parameters:**
- `familyKey` (string): Unique family identifier
- `userId` (string): ID of the member to remove

**Happy Flow Response (200 OK):**
```json
{}
```

**Error Flow Responses:**

**404 Not Found - Member not found:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "User not found",
  "path": "/api/family/johndoe/members/64a7b8c9d1e2f3a4b5c6d7ea"
}
```

**404 Not Found - Family not found:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Family not found",
  "path": "/api/family/johndoe/members/64a7b8c9d1e2f3a4b5c6d7ea"
}
```

---

### 5. Update Family Name

**Endpoint:** `PUT /api/family/{familyKey}/name`

**Description:** Update the family name

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Path Parameters:**
- `familyKey` (string): Unique family identifier

**Query Parameters:**
- `newName` (string): New family name

**Happy Flow Response (200 OK):**
```json
{}
```

**Error Flow Responses:**

**404 Not Found:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Family not found",
  "path": "/api/family/johndoe/name"
}
```

**400 Bad Request - Empty name:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Family name cannot be empty",
  "path": "/api/family/johndoe/name"
}
```

---

## User Management APIs

### 1. Get User

**Endpoint:** `GET /api/users/{userId}`

**Description:** Get user details by ID

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Path Parameters:**
- `userId` (string): User ID

**Happy Flow Response (200 OK):**
```json
{
  "id": "64a7b8c9d1e2f3a4b5c6d7e9",
  "fullName": "John Doe",
  "nickName": "Johnny",
  "mobile": "+1234567890",
  "email": "john@example.com",
  "imageUrl": "https://s3.wasabisys.com/bucket/users/john.jpg",
  "bio": "Family patriarch",
  "gender": "MALE",
  "bloodGroup": "O+",
  "birthDay": "1980-05-15",
  "marriageAnniversary": "2005-06-20",
  "rewards": "Best Father Award 2023",
  "job": "Software Engineer",
  "education": "Computer Science Degree",
  "familyDoctor": "Dr. Smith",
  "deathAnniversary": null,
  "location": 0,
  "isActive": true,
  "relationships": {
    "spouseId": "64a7b8c9d1e2f3a4b5c6d7ea",
    "childrenIds": ["64a7b8c9d1e2f3a4b5c6d7eb"],
    "parentIds": [],
    "motherId": null,
    "fatherId": null
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Flow Response:**

**404 Not Found:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "User not found",
  "path": "/api/users/64a7b8c9d1e2f3a4b5c6d7e9"
}
```

---

### 2. Update User

**Endpoint:** `PUT /api/users/{userId}`

**Description:** Update user information

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Path Parameters:**
- `userId` (string): User ID

**Request Body:**
```json
{
  "fullName": "John Smith Doe",
  "nickName": "Johnny",
  "mobile": "+1234567890",
  "email": "john.smith@example.com",
  "bio": "Updated bio information",
  "gender": "MALE",
  "bloodGroup": "O+",
  "birthDay": "1980-05-15",
  "marriageAnniversary": "2005-06-20",
  "rewards": "Best Father Award 2023, Community Leader 2024",
  "job": "Senior Software Engineer",
  "education": "Master's in Computer Science",
  "familyDoctor": "Dr. Johnson",
  "deathAnniversary": null,
  "imageUrl": "https://s3.wasabisys.com/bucket/users/john-updated.jpg",
  "location": 0
}
```

**Happy Flow Response (200 OK):**
```json
{
  "id": "64a7b8c9d1e2f3a4b5c6d7e9",
  "fullName": "John Smith Doe",
  "nickName": "Johnny",
  "mobile": "+1234567890",
  "email": "john.smith@example.com",
  "imageUrl": "https://s3.wasabisys.com/bucket/users/john-updated.jpg",
  "bio": "Updated bio information",
  "gender": "MALE",
  "bloodGroup": "O+",
  "birthDay": "1980-05-15",
  "marriageAnniversary": "2005-06-20",
  "rewards": "Best Father Award 2023, Community Leader 2024",
  "job": "Senior Software Engineer",
  "education": "Master's in Computer Science",
  "familyDoctor": "Dr. Johnson",
  "deathAnniversary": null,
  "location": 0,
  "isActive": true,
  "relationships": {
    "spouseId": "64a7b8c9d1e2f3a4b5c6d7ea",
    "childrenIds": ["64a7b8c9d1e2f3a4b5c6d7eb"],
    "parentIds": [],
    "motherId": null,
    "fatherId": null
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T11:45:00Z"
}
```

**Error Flow Responses:**

**404 Not Found:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "User not found",
  "path": "/api/users/64a7b8c9d1e2f3a4b5c6d7e9"
}
```

**400 Bad Request - Validation errors:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input data",
  "path": "/api/users/64a7b8c9d1e2f3a4b5c6d7e9",
  "validationErrors": {
    "fullName": "Full name is required",
    "email": "Invalid email format"
  }
}
```

---

### 3. Search Users

**Endpoint:** `GET /api/users/search`

**Description:** Search users by name

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
- `query` (string): Search query

**Happy Flow Response (200 OK):**
```json
[
  {
    "id": "64a7b8c9d1e2f3a4b5c6d7e9",
    "fullName": "John Doe",
    "nickName": "Johnny",
    "mobile": "+1234567890",
    "email": "john@example.com",
    "imageUrl": "https://s3.wasabisys.com/bucket/users/john.jpg",
    "bio": "Family patriarch",
    "gender": "MALE",
    "bloodGroup": "O+",
    "birthDay": "1980-05-15",
    "marriageAnniversary": "2005-06-20",
    "rewards": "Best Father Award 2023",
    "job": "Software Engineer",
    "education": "Computer Science Degree",
    "familyDoctor": "Dr. Smith",
    "deathAnniversary": null,
    "location": 0,
    "isActive": true,
    "relationships": {
      "spouseId": "64a7b8c9d1e2f3a4b5c6d7ea",
      "childrenIds": ["64a7b8c9d1e2f3a4b5c6d7eb"],
      "parentIds": [],
      "motherId": null,
      "fatherId": null
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

**Error Flow Response:**

**400 Bad Request - Empty query:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Search query cannot be empty",
  "path": "/api/users/search"
}
```

---

## Image Management APIs

### 1. Upload Image

**Endpoint:** `POST /api/images/upload/{userId}`

**Description:** Upload an image for a user

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

**Path Parameters:**
- `userId` (string): User ID

**Request Body (Form Data):**
```
file: [image file]
```

**Happy Flow Response (200 OK):**
```json
"https://s3.wasabisys.com/family-tree-images/users/64a7b8c9d1e2f3a4b5c6d7e9/profile-123456.jpg"
```

**Error Flow Responses:**

**400 Bad Request - No file:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Failed to upload image: File is empty",
  "path": "/api/images/upload/64a7b8c9d1e2f3a4b5c6d7e9"
}
```

**400 Bad Request - Invalid file type:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Failed to upload image: File must be an image",
  "path": "/api/images/upload/64a7b8c9d1e2f3a4b5c6d7e9"
}
```

**413 Payload Too Large:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 413,
  "error": "Payload Too Large",
  "message": "File size exceeds maximum limit of 10MB",
  "path": "/api/images/upload/64a7b8c9d1e2f3a4b5c6d7e9"
}
```

---

### 2. Delete Image

**Endpoint:** `DELETE /api/images/delete`

**Description:** Delete an image

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
- `imageUrl` (string): URL of the image to delete

**Happy Flow Response (200 OK):**
```json
{}
```

**Error Flow Response:**

**400 Bad Request - Invalid URL:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Failed to delete image: Invalid image URL",
  "path": "/api/images/delete"
}
```

---

## Public APIs

### 1. Get Public Family

**Endpoint:** `GET /api/public/family/{token}`

**Description:** Get public family tree (no authentication required)

**Path Parameters:**
- `token` (string): Public access token

**Query Parameters:**
- `familyName` (string): Family name for verification

**Happy Flow Response (200 OK):**
```json
{
  "id": "64a7b8c9d1e2f3a4b5c6d7e8",
  "name": "The Doe Family",
  "familyKey": "johndoe",
  "members": [
    {
      "id": "64a7b8c9d1e2f3a4b5c6d7e9",
      "fullName": "John Doe",
      "nickName": "Johnny",
      "mobile": null,
      "email": null,
      "imageUrl": "https://s3.wasabisys.com/bucket/users/john.jpg",
      "bio": "Family patriarch",
      "gender": "MALE",
      "bloodGroup": "O+",
      "birthDay": "1980-05-15",
      "marriageAnniversary": "2005-06-20",
      "rewards": "Best Father Award 2023",
      "job": "Software Engineer",
      "education": "Computer Science Degree",
      "familyDoctor": null,
      "deathAnniversary": null,
      "location": 0,
      "isActive": true,
      "relationships": {
        "spouseId": "64a7b8c9d1e2f3a4b5c6d7ea",
        "childrenIds": ["64a7b8c9d1e2f3a4b5c6d7eb"],
        "parentIds": [],
        "motherId": null,
        "fatherId": null
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "relationships": [
    {
      "id": "64a7b8c9d1e2f3a4b5c6d7ec",
      "fromId": "64a7b8c9d1e2f3a4b5c6d7e9",
      "toId": "64a7b8c9d1e2f3a4b5c6d7ea",
      "type": "SPOUSE",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Flow Responses:**

**401 Unauthorized - Invalid token:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "path": "/api/public/family/invalid-token"
}
```

**404 Not Found - Family not found:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Family not found",
  "path": "/api/public/family/valid-token"
}
```

**400 Bad Request - Family name mismatch:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Family name does not match",
  "path": "/api/public/family/valid-token"
}
```

---

## Relationship APIs

### 1. Create Relationship

**Endpoint:** `POST /api/relationships`

**Description:** Create a new relationship between family members

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "fromId": "64a7b8c9d1e2f3a4b5c6d7e9",
  "toId": "64a7b8c9d1e2f3a4b5c6d7ea",
  "type": "SPOUSE"
}
```

**Happy Flow Response (200 OK):**
```json
{
  "id": "64a7b8c9d1e2f3a4b5c6d7ec",
  "fromId": "64a7b8c9d1e2f3a4b5c6d7e9",
  "toId": "64a7b8c9d1e2f3a4b5c6d7ea",
  "type": "SPOUSE",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Flow Responses:**

**400 Bad Request - Validation errors:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input data",
  "path": "/api/relationships",
  "validationErrors": {
    "fromId": "From ID is required",
    "toId": "To ID is required"
  }
}
```

**400 Bad Request - Invalid relationship:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Cannot create relationship: users not found",
  "path": "/api/relationships"
}
```

---

### 2. Get User Relationships

**Endpoint:** `GET /api/relationships/user/{userId}`

**Description:** Get all relationships for a specific user

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Path Parameters:**
- `userId` (string): User ID

**Happy Flow Response (200 OK):**
```json
[
  {
    "id": "64a7b8c9d1e2f3a4b5c6d7ec",
    "fromId": "64a7b8c9d1e2f3a4b5c6d7e9",
    "toId": "64a7b8c9d1e2f3a4b5c6d7ea",
    "type": "SPOUSE",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": "64a7b8c9d1e2f3a4b5c6d7ed",
    "fromId": "64a7b8c9d1e2f3a4b5c6d7e9",
    "toId": "64a7b8c9d1e2f3a4b5c6d7eb",
    "type": "CHILD",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

**Error Flow Response:**

**404 Not Found:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "User not found",
  "path": "/api/relationships/user/64a7b8c9d1e2f3a4b5c6d7e9"
}
```

---

### 3. Delete Relationship

**Endpoint:** `DELETE /api/relationships/{relationshipId}`

**Description:** Delete a specific relationship

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Path Parameters:**
- `relationshipId` (string): Relationship ID

**Happy Flow Response (200 OK):**
```json
{}
```

**Error Flow Response:**

**404 Not Found:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Relationship not found",
  "path": "/api/relationships/64a7b8c9d1e2f3a4b5c6d7ec"
}
```

---

## Error Codes Reference

### HTTP Status Codes

| Code | Description | When Used |
|------|-------------|-----------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid input data, validation errors |
| 401 | Unauthorized | Invalid or missing authentication |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 413 | Payload Too Large | File size exceeds limit |
| 422 | Unprocessable Entity | Valid syntax but semantic errors |
| 500 | Internal Server Error | Server-side error |

### Common Error Response Format

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Detailed error message",
  "path": "/api/endpoint/path",
  "validationErrors": {
    "field1": "Error message for field1",
    "field2": "Error message for field2"
  }
}
```

### Validation Error Messages

| Field | Error Messages |
|-------|----------------|
| username | "Username is required", "Username already exists" |
| password | "Password is required", "Password must be at least 8 characters" |
| email | "Invalid email format", "Email already exists" |
| fullName | "Full name is required" |
| mobile | "Invalid mobile number format" |
| gender | "Invalid gender value" |
| bloodGroup | "Invalid blood group" |
| birthDay | "Invalid date format" |

---

## Data Models

### User Model

```json
{
  "id": "string",
  "fullName": "string (required)",
  "nickName": "string (optional)",
  "mobile": "string (optional)",
  "email": "string (optional, valid email)",
  "imageUrl": "string (optional, valid URL)",
  "bio": "string (optional)",
  "gender": "enum: MALE, FEMALE, OTHER",
  "bloodGroup": "string (optional)",
  "birthDay": "date (ISO 8601)",
  "marriageAnniversary": "date (ISO 8601)",
  "rewards": "string (optional)",
  "job": "string (optional)",
  "education": "string (optional)",
  "familyDoctor": "string (optional)",
  "deathAnniversary": "date (ISO 8601, optional)",
  "location": "integer",
  "isActive": "boolean",
  "relationships": {
    "spouseId": "string (optional)",
    "childrenIds": "array of strings",
    "parentIds": "array of strings",
    "motherId": "string (optional)",
    "fatherId": "string (optional)"
  },
  "createdAt": "datetime (ISO 8601)",
  "updatedAt": "datetime (ISO 8601)"
}
```

### Family Model

```json
{
  "id": "string",
  "name": "string (required)",
  "familyKey": "string (unique)",
  "members": "array of User objects",
  "relationships": "array of Relationship objects",
  "createdAt": "datetime (ISO 8601)",
  "updatedAt": "datetime (ISO 8601)"
}
```

### Relationship Model

```json
{
  "id": "string",
  "fromId": "string (required)",
  "toId": "string (required)",
  "type": "enum: MOTHER, FATHER, CHILD, SPOUSE",
  "createdAt": "datetime (ISO 8601)"
}
```

### LoginDetails Model

```json
{
  "id": "string",
  "username": "string (required, unique)",
  "password": "string (encrypted)",
  "mobile": "string (optional)",
  "email": "string (optional, valid email)",
  "familyName": "string (optional)",
  "familyKey": "string",
  "isGoogleSignIn": "boolean",
  "token": "string (JWT)",
  "tokenExpiryDate": "datetime (ISO 8601)",
  "createdAt": "datetime (ISO 8601)",
  "updatedAt": "datetime (ISO 8601)"
}
```

### Authentication Response Model

```json
{
  "token": "string (JWT)",
  "refreshToken": "string (JWT)",
  "username": "string",
  "familyName": "string (optional)",
  "familyKey": "string",
  "expiresIn": "long (milliseconds)"
}
```

---

## Rate Limiting

### Default Limits
- **Authentication endpoints**: 5 requests per minute per IP
- **Family management**: 100 requests per hour per user
- **Image upload**: 10 uploads per hour per user
- **Public endpoints**: 1000 requests per hour per IP

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642234567
```

### Rate Limit Exceeded Response (429)
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again in 60 seconds.",
  "path": "/api/auth/login"
}
```

---

## Security Headers

### Required Request Headers
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Security Response Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## API Versioning

Current API version: **v1**

All endpoints are prefixed with `/api/` which represents version 1.

Future versions will use:
- `/api/v2/` for version 2
- `/api/v3/` for version 3

### Version Headers
```
API-Version: 1.0
Accept-Version: 1.0
```

---

*This document was generated for Family Tree API v1.0*
*Last updated: January 15, 2024*
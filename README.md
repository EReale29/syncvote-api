# SyncVote API

>SyncVote API is a backend service that provides voting functionality for posts and comments. It includes routes for managing posts, comments, users, and votes. Built with TypeScript, this API leverages Express for routing and Firestore as a database.



## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Postman](#postman)
- [Usage](#usage)
- [Syncvote API Documentation](#syncvote-api-documentation)

---
## Features

- User authentication and authorization
- CRUD operations for posts and comments
- Voting functionality for posts and comments
- Middleware for authentication and data validation

---
## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/EReale29/syncvote-api.git
   cd syncvote-api-main
   ```
   
2. **Install dependencies:**

    ```bash
   npm install
    ```

3.	**Environment Setup:**

Create a .env file in the root directory with the following variables:

```plaintext
FIREBASE_PROJECT_ID= <Your Firebase Project ID>
FIREBASE_CLIENT_EMAIL= <Your Firebase Client Email>
FIREBASE_PRIVATE_KEY= <Your Firebase Private Key>
FIREBASE_DATABASE_URL= <Your Firestore Database URL>
```
---
## Configuration

Ensure Firebase and Firestore are set up. The .env file should contain the necessary credentials to connect to Firebase Firestore.

You may also configure additional settings like server port and other environment-specific configurations.

---

## Postman

To simplify testing the SyncVote API, a Postman collection has been provided. This collection contains predefined requests for authentication, user management, post and comment operations, and voting actions.

Steps to Import the Collection into Postman

1. Download the JSON Collection: Save the postmanJSON.json file to your computer.


2. Open Postman: Launch the Postman application.


3.	Import the Collection:
•	In Postman, click on the Import button (usually located at the top left of the interface).
•	In the dialog box that appears, select Upload Files.
•	Navigate to the location where you saved postmanJSON.json, select it, and click Open.
•	Postman will import the collection, and you’ll see it appear in the Collections sidebar under the name “syncvote”.


4.	Set Up the Environment (Optional):
•	For authorization, the collection uses the bearer_token environment variable. Ensure you have an environment set up in Postman with a variable named bearer_token to store your access token.
•	Once logged in, the collection’s login request automatically sets this token in your environment.

---
## Usage

1. **Start the server:**

    ```bash
        npm run dev
    ```
   
2. **Running Postman request:**

    •	Expand the imported syncvote collection in Postman to view available requests.
    
    •	Each request is pre-configured with the necessary method, headers, and body parameters.
    
    •	To test endpoints like login, user registration, post creation, etc., click on a request and then click Send.


---

# SyncVote API Documentation

This API allows users to perform operations on users, posts, comments, and votes. Each endpoint’s description includes required methods, headers, URL parameters, and example requests.

---

## Authentication

### 1. Login as Admin
- **Method**: `POST`
- **URL**: `/auth/login`
- **Body**:
  ```json
  {
    "email": "admin@gmail.com",
    "password": "adminPassword"
  }
  ```

### 2. Login as User
- **Method**: `POST`
- **URL**: `/auth/login`
- **Body**:
  ```json
  {
    "email": "user@gmail.com",
    "password": "userPassword"
  }
  ```

---

## User Management

### 1. Create User
- **Method**: `POST`
- **URL**: `/users`
- **Body**:
  ```json
  {
    "email": "user@gmail.com",
    "password": "userPassword",
    "username": "username"
  }
  ```

### 2. Get All Users
- **Method**: `GET`
- **URL**: `/users`
- **Headers**:
    - `Authorization: Bearer {{bearer_token}}`

### 3. Get User by ID
- **Method**: `GET`
- **URL**: `/users/:id`
- **Headers**:
    - `Authorization: Bearer {{bearer_token}}`

### 4. Update User by ID
- **Method**: `PUT`
- **URL**: `/users/:id`
- **Headers**:
    - `Authorization: Bearer {{bearer_token}}`
- **Body**:
  ```json
  {
    "email": "usermodifier@gmail.com",
    "username": "usernamemodifier"
  }
  ```

### 5. Update Connected User
- **Method**: `PUT`
- **URL**: `/users/me`
- **Headers**:
    - `Authorization: Bearer {{bearer_token}}`
- **Body**:
  ```json
  {
    "email": "usermodifier@gmail.com",
    "username": "usernamemodifier"
  }
  ```

### 6. Delete User by ID
- **Method**: `DELETE`
- **URL**: `/users/:id`
- **Headers**:
    - `Authorization: Bearer {{bearer_token}}`

### 7. Change Password
- **Method**: `PATCH`
- **URL**: `/users/password`
- **Body**:
  ```json
  {
    "oldPassword": "oldPassword",
    "newPassword": "newPassword"
  }
  ```

---

## Post Management

### 1. Create Post
- **Method**: `POST`
- **URL**: `/posts`
- **Headers**:
    - `Authorization: Bearer {{bearer_token}}`
- **Body**:
  ```json
  {
    "title": "Titre du post",
    "description": "description du post",
    "categories": ["category"]
  }
  ```

### 2. Get All Posts
- **Method**: `GET`
- **URL**: `/posts`
- **Headers**:
    - `Authorization: Bearer {{bearer_token}}`

### 3. Get Post by ID
- **Method**: `GET`
- **URL**: `/posts/:id`
- **Headers**:
    - `Authorization: Bearer {{bearer_token}}`

### 4. Get All Posts by User
- **Method**: `GET`
- **URL**: `/users/:userId/posts`

### 5. Get Posts by Category
- **Method**: `GET`
- **URL**: `/posts?category=sports`
- **Headers**:
    - `Authorization: Bearer {{bearer_token}}`

### 6. Update Post by ID
- **Method**: `PUT`
- **URL**: `/posts/:id`
- **Headers**:
    - `Authorization: Bearer {{bearer_token}}`
- **Body**:
  ```json
  {
    "title": "Titre du post modifier",
    "description": "description du post modifier",
    "categories": ["category modifier"]
  }
  ```

### 7. Delete Post by ID
- **Method**: `DELETE`
- **URL**: `/posts/:id`
- **Headers**:
    - `Authorization: Bearer {{bearer_token}}`

---

## Comment Management

### 1. Add Comment to a Post
- **Method**: `POST`
- **URL**: `/posts/:postId/comments`
- **Headers**:
    - `Authorization: Bearer {{bearer_token}}`
- **Body**:
  ```json
  {
    "description": "description du commentaire"
  }
  ```

### 2. Get All Comments of a Post
- **Method**: `GET`
- **URL**: `/posts/:postId/comments`
- **Headers**:
    - `Authorization: Bearer {{bearer_token}}`

### 3. Get Comment by ID
- **Method**: `GET`
- **URL**: `/comments/:id`
- **Headers**:
    - `Authorization: Bearer {{bearer_token}}`

### 4. Update Comment by ID
- **Method**: `PUT`
- **URL**: `/comments/:id`
- **Headers**:
    - `Authorization: Bearer {{bearer_token}}`
- **Body**:
  ```json
  {
    "description": "description du commentaire modifier"
  }
  ```

### 5. Delete Comment by ID
- **Method**: `DELETE`
- **URL**: `/comments/:id`
- **Headers**:
    - `Authorization: Bearer {{bearer_token}}`

### 6. Get All Comments
- **Method**: `GET`
- **URL**: `/comments/`

---

## Voting

### 1. Vote on a Post
- **Method**: `POST`
- **URL**: `/votes/post`
- **Body**:
  ```json
  {
    "entityId": "POST_ID",
    "type": "up || down"
  }
  ```

### 2. Vote on a Comment
- **Method**: `POST`
- **URL**: `/votes/comment`
- **Body**:
  ```json
  {
    "entityId": "COMMENT_ID",
    "type": "up || down"
  }
  ```

---

Each request must be test with your value.

Make sure the `Authorization` header is populated with `{{bearer_token}}` for authenticated requests.

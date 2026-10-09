# Blog API Application

A REST API for a blog application built with Node.js, Express, MongoDB, Mongoose, and JWT authentication.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Tokens (JWT)

## 🔗 Social Links

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-915EFF?style=for-the-badge&logo=vercel&logoColor=white)](https://pradip-reactjs-portfolio.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pradip-bambharoliya-reactjs)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pradipbambharoliya97)

> **Upwork:** Add your Upwork profile badge after you have copied your public profile URL.

## ✨ Features

- User registration and login
- JWT-based authentication and authorization
- Create, read, update, and delete posts
- Create, update, and delete comments
- Like and dislike posts
- Follow and unfollow users
- View followers and following counts
- View profile-viewer information and counts
- Track user activity and the last active date
- Track the last post creation date
- Automatically block inactive users after 30 days
- Admin ability to block and unblock users
- User ability to block and unblock other users
- Prevent users from seeing content from users they have blocked
- Update account password and profile information
- Upload a profile photo
- Close/delete a user account
- Assign user awards based on post count
- View post count and blocked-user counts

Only keep features in this list that are implemented and working in your current API.

## 🚀 Run Locally

### 1. Clone the repository

Replace the placeholder with the actual URL of your project repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_PROJECT_DIRECTORY
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add the variables required by your application. At minimum, the existing documentation identifies `MONGODB_URL`; your code may require additional values such as a JWT secret.

```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Use the exact environment variable names referenced by your code. Never commit your real `.env` file, database credentials, or JWT secrets to a public repository.

### 4. Start the server

```bash
npm run server
```

Make sure `server` is a script defined in your `package.json`. If your project uses a different script, use the correct command.

## 🌐 Base URL

The deployed API base URL documented for this project is:

```text
https://blog-api-v3-inovotek.onrender.com/
```

Example endpoint:

```text
https://blog-api-v3-inovotek.onrender.com/api/v1/users/login
```

## 🔐 Authentication

Some endpoints require authentication. Register and log in to obtain an access token, then send it in the `Authorization` header.

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Do not share real access tokens in public documentation, screenshots, or source control.

## 📚 API Reference

The routes below are based on the existing project documentation. Before publishing, confirm each HTTP method and path against the Express route definitions, especially the follow/unfollow, like/dislike, profile-photo upload, and delete-post endpoints.

### Authentication

| Action                         | Method | Endpoint                 |
| ------------------------------ | ------ | ------------------------ |
| Register a new user/API client | `POST` | `/api/v1/users/register` |
| Log in                         | `POST` | `/api/v1/users/login`    |

#### Register

```http
POST /api/v1/users/register
Content-Type: application/json
```

Add the request fields required by your registration controller. The current documentation does not specify the complete registration schema.

#### Log in

```http
POST /api/v1/users/login
Content-Type: application/json
```

Example request body:

```json
{
  "email": "you@example.com",
  "password": "your-password"
}
```

### Users

| Action                                  | Method                      | Endpoint                             |
| --------------------------------------- | --------------------------- | ------------------------------------ |
| Get my profile                          | `GET`                       | `/api/v1/users/profile`              |
| Get all users                           | `GET`                       | `/api/v1/users/users`                |
| View a user's profile / profile viewers | `GET`                       | `/api/v1/users/profile-viewers/:id`  |
| Follow a user                           | Verify in route definitions | `/api/v1/users/following/:id`        |
| Unfollow a user                         | Verify in route definitions | `/api/v1/users/unfollowing/:id`      |
| Update password                         | `PUT`                       | `/api/v1/users/update-password`      |
| Update profile                          | `PUT`                       | `/api/v1/users`                      |
| Block a user                            | `PUT`                       | `/api/v1/users/block/:id`            |
| Unblock a user                          | `PUT`                       | `/api/v1/users/unblock/:id`          |
| Admin: block a user                     | `PUT`                       | `/api/v1/users/admin-block/:id`      |
| Admin: unblock a user                   | `PUT`                       | `/api/v1/users/admin-unblock/:id`    |
| Delete account                          | `DELETE`                    | `/api/v1/users/delete-account`       |
| Upload profile photo                    | Verify in route definitions | `/api/v1/users/profile-photo-upload` |

For protected endpoints, send the bearer token in the `Authorization` header.

#### Update password

```http
PUT /api/v1/users/update-password
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

```json
{
  "password": "your-new-password"
}
```

#### Update profile

```http
PUT /api/v1/users
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

Example request body (include only fields supported by your API):

```json
{
  "email": "you@example.com",
  "firstname": "Pradip",
  "lastname": "Bambharoliya"
}
```

### Posts

| Action            | Method                      | Endpoint                     |
| ----------------- | --------------------------- | ---------------------------- |
| Create a post     | `POST`                      | `/api/v1/posts`              |
| Get all posts     | `GET`                       | `/api/v1/posts`              |
| Get a single post | `GET`                       | `/api/v1/posts/:id`          |
| Toggle like       | Verify in route definitions | `/api/v1/postslikes/:id`     |
| Toggle dislike    | Verify in route definitions | `/api/v1/posts/dislikes/:id` |
| Update a post     | `PUT`                       | `/api/v1/posts/:id`          |
| Delete a post     | Verify in route definitions | `/api/v1/posts/:id`          |

#### Create a post

```http
POST /api/v1/posts
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

The existing documentation lists `title`, `description`, `category`, and `photo` as post fields:

```json
{
  "title": "My first post",
  "description": "Write your post content here.",
  "category": "CATEGORY_ID",
  "photo": "IMAGE_URL_OR_SUPPORTED_UPLOAD_VALUE"
}
```

Confirm whether `photo` is expected as a URL/string or uploaded as multipart form data in your implementation.

#### Update a post

```http
PUT /api/v1/posts/:id
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

```json
{
  "title": "Updated post title",
  "description": "Updated post content",
  "category": "CATEGORY_ID",
  "photo": "IMAGE_URL_OR_SUPPORTED_UPLOAD_VALUE"
}
```

### Comments

| Action                     | Method   | Endpoint               |
| -------------------------- | -------- | ---------------------- |
| Create a comment on a post | `POST`   | `/api/v1/comments/:id` |
| Update a comment           | `PUT`    | `/api/v1/comments/:id` |
| Delete a comment           | `DELETE` | `/api/v1/comments/:id` |

For comment endpoints, confirm whether `:id` refers to the post ID or the comment ID for each action. The existing documentation uses inconsistent descriptions.

## 🛡️ Security and Configuration Notes

- Keep `.env` out of version control; add it to `.gitignore`.
- Use a strong, private JWT secret.
- Validate and sanitize incoming request data.
- Protect private endpoints with authentication and authorization middleware.
- Enforce admin permissions on admin-only routes.
- Avoid exposing passwords, tokens, or private user information in API responses and logs.
- Confirm that the deployed base URL and all listed endpoints are current.

## 📝 Before Publishing

- [ ] Replace `YOUR_GITHUB_REPOSITORY_URL` and `YOUR_PROJECT_DIRECTORY` in the setup instructions.
- [ ] Add your Upwork badge only after you have your public profile URL.
- [ ] Confirm all endpoint methods and paths against your Express route files.
- [ ] Confirm the exact environment variables and npm scripts from your project.
- [ ] Test the sample requests using Postman or another API client.
- [ ] Ensure no credentials, tokens, or private information are committed.

# Backend (MongoDB Atlas + Express)

This backend provides a simple admin authentication API using MongoDB Atlas, JWTs, and bcrypt for password hashing.

Setup

1. Copy `.env.example` to `.env` and fill values:

```
MONGODB_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your_jwt_secret
ADMIN_MOBILE=9876543210
ADMIN_PASSWORD=admin123
PORT=5000
```

2. Install and start:

```powershell
cd backend
npm install
npm start
```

Notes
- On first start the server will seed an admin user with `ADMIN_MOBILE` and `ADMIN_PASSWORD` (hashed) if that mobile doesn't already exist.
- The login endpoint is `POST /api/admin/login` with JSON `{ mobile, password }` and returns `{ token }` on success.
- Protected endpoint example: `GET /api/admin/profile` requires `Authorization: Bearer <token>`.

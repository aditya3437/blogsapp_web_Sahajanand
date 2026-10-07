# Papertrail blog

A React and Express blog with member registration/login, public story reading, and an administrator dashboard for managing members and stories. No ad integration is included.

## Requirements

- Node.js 20.19+ (or 22.12+)
- MongoDB running locally or a MongoDB connection URI

## Configure and run

1. Copy `server/.env.example` to `server/.env` and set a private, random `JWT_SECRET` and your `MONGODB_URI`.
2. Start the API:

   ```powershell
   cd server
   npm install
   npm start
   ```

3. In a second terminal, start the frontend:

   ```powershell
   cd client/client
   npm install
   npm run dev
   ```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`, or `5174` if 5173 is busy). The browser keeps using that frontend URL for `/api` requests; Vite proxies them to the API on port 5000. For a separately hosted frontend, set `CLIENT_ORIGIN` to its origin (multiple comma-separated origins are supported).

## First administrator

Register an account through the site, then promote that account directly in MongoDB using `mongosh`:

```javascript
use papertrail
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

Sign out and back in after the promotion. Public registration always creates a regular member account.

## API overview

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/posts`, `GET /api/posts/:id`
- Admin-only post CRUD: `POST /api/posts`, `PUT /api/posts/:id`, and `DELETE /api/posts/:id`
- Admin-only user CRUD: `GET /api/users`, `GET /api/users/:id`, `POST /api/users`, `PUT /api/users/:id`, `DELETE /api/users/:id`
- `GET /api/health`

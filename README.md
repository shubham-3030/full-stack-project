# Full-Stack Blog Application (MERN Stack)

A feature-rich, modern Full-Stack Blog Application built using **React.js**, **Tailwind CSS**, **Node.js**, **Express.js**, **MongoDB**, **Mongoose**, **JWT Authentication**, and **bcrypt** password hashing.

---

## 🌟 Key Features

- 🔐 **User Registration & Login**: JWT-based authentication with encrypted passwords using `bcryptjs` and strict input validation (`confirmPassword` matching).
- 📝 **Full CRUD for Blogs**: Create, Read, Update, and Delete blog posts.
- 🛡️ **Strict Ownership-Based Authorization**:
  - Backend independently verifies ownership (`blog.author === req.user._id`) on `PUT` and `DELETE` requests, returning HTTP `403 Forbidden` for unauthorized attempts.
  - Read access (`GET /api/blogs`) requires user authentication per assignment specification.
  - Frontend conditionally renders edit and delete controls only for the post author.
- 🎨 **Modern Light UI & UX**: Clean Slate light palette, dynamic cards, tag badges, read-time estimates, loading skeletons, and interactive toast alerts.
- 🔍 **Search & Category Filter**: Search blogs by title, content, or tags with live category filtering.
- 👤 **User Dashboard & Profile**: Personalized creator stats, published article list, word count metrics, and user profile metadata.
- ⚡ **Database Integration**: Connects to MongoDB / MongoDB Atlas with in-memory fallback for automated testing.

---

## 🚀 Deployment Instructions

### 1. Backend Deployment (Render)
1. Sign in to [Render](https://render.com/).
2. Create a **New Web Service** and connect your GitHub repository `https://github.com/Atulparjapat03/Blog-Application.git`.
3. Configure the service settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add Environment Variables on Render:
   - `MONGODB_URI`: Your MongoDB Atlas Connection String
   - `JWT_SECRET`: Your production secret key
   - `JWT_EXPIRE`: `30d`
   - `NODE_ENV`: `production`
5. Deploy and copy your backend URL (e.g. `https://blog-backend-api.onrender.com`).

### 2. Frontend Deployment (Netlify)
1. Sign in to [Netlify](https://www.netlify.com/).
2. Click **Add new site** > **Import an existing project** > **GitHub**.
3. Select `https://github.com/Atulparjapat03/Blog-Application.git`.
4. Configure site settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add Environment Variables on Netlify:
   - `VITE_API_URL`: `https://blog-backend-api.onrender.com/api` *(Your Render backend API URL)*
6. Deploy site!

---

## 💻 Local Development Setup

### 1. Install Dependencies
Run from the root directory:

```bash
npm run install:all
```

### 2. Configure Environment Variables
Copy `backend/.env.example` to `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/blogapp
JWT_SECRET=your_secret_jwt_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

### 3. Run Locally
```bash
npm run dev
```

Open your browser at **`http://localhost:3000`**.

---

## 🔒 Security & Authorization API Matrix

| Action | HTTP Method | Endpoint | Access Level | Ownership Check |
|---|---|---|---|---|
| Register User | `POST` | `/api/auth/register` | Anyone | N/A |
| Login User | `POST` | `/api/auth/login` | Anyone | N/A |
| Get User Profile | `GET` | `/api/auth/me` | Logged-in | Self |
| Read All Blogs | `GET` | `/api/blogs` | **Logged-in users** | N/A |
| Read Single Blog | `GET` | `/api/blogs/:id` | **Logged-in users** | N/A |
| Create Blog | `POST` | `/api/blogs` | Logged-in users | N/A |
| Update Blog | `PUT` | `/api/blogs/:id` | Logged-in users | **Blog Owner Only** (`403 Forbidden` if not owner) |
| Delete Blog | `DELETE` | `/api/blogs/:id` | Logged-in users | **Blog Owner Only** (`403 Forbidden` if not owner) |

---

## 🧪 Database Seeding

To populate sample users and blog posts, run:

```bash
cd backend
node seed.js
```

**Seed Credentials**:
- **User 1**: `sarah@example.com` / `password123`
- **User 2**: `alex@example.com` / `password123`

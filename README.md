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
- ⚡ **Database Integration**: Connects directly to local MongoDB (`mongodb://127.0.0.1:27017/blogapp`) with an in-memory fallback for automated testing.

---

## 🏗️ Technology Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (Custom theme & light UI)
- **React Router DOM v6** (Navigation & Protected Routes)
- **Axios** (API Requests with Authorization header interceptors)
- **Lucide React** (Modern Icon Pack)

### Backend
- **Node.js & Express.js** (RESTful API)
- **MongoDB & Mongoose** (Data Modeling & Schema Validation)
- **JSON Web Tokens (JWT)** (Secure Token Authentication)
- **bcryptjs** (Password Hashing)

---

## 📁 Project Structure

```
Full Stack Project/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & fallback setup
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, GetMe
│   │   └── blogController.js     # Create, GetAll, GetOne, Update, Delete
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT token verification middleware
│   ├── models/
│   │   ├── User.js               # Mongoose User model with bcrypt pre-save hook
│   │   └── Blog.js               # Mongoose Blog model with Author reference
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   └── blogRoutes.js         # /api/blogs endpoints
│   ├── seed.js                   # Database seeder script
│   ├── server.js                 # Express application entry point
│   ├── .env.example              # Environment configuration template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, BlogCard, ProtectedRoute, Toast, Skeleton
│   │   ├── context/              # AuthContext (global state, login, register, token)
│   │   ├── pages/                # Home, BlogDetails, CreateBlog, EditBlog, MyBlogs, Profile, Login, Register, NotFound
│   │   ├── services/             # Axios API service configuration
│   │   ├── App.jsx               # React Router configuration
│   │   ├── main.jsx              # Application entry point
│   │   └── index.css             # Tailwind CSS & utilities
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── .gitignore                    # Ignores node_modules, dist/, and .env
├── package.json                  # Root runner script
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies
Run from the project root directory:

```bash
npm run install:all
```

Or install individually:
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
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

### 3. Run the Application
Start backend and frontend concurrently:

```bash
npm run dev
```

Open your browser and navigate to: **`http://localhost:3000`**

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

To populate sample users and blog posts into your local MongoDB, run:

```bash
cd backend
node seed.js
```

**Seed Credentials**:
- **User 1**: `sarah@example.com` / `password123`
- **User 2**: `alex@example.com` / `password123`

# 🟡 Yellow Pages — Backend

This is the Node.js + Express backend server for the Yellow Pages business directory application.

---

## 🛠 Tech Stack

- **Node.js** — JavaScript runtime
- **Express.js** — Web framework
- **MongoDB** — Database (in-memory via MongoMemoryServer)
- **Mongoose** — MongoDB object modelling
- **JWT** — JSON Web Token authentication
- **bcryptjs** — Password hashing

---

## 📁 Folder Structure

```
backend/
├── middleware/
│   └── auth.js          # JWT auth & admin middleware
├── models/
│   ├── User.js          # User schema
│   ├── Business.js      # Business schema
│   ├── Category.js      # Category schema
│   └── Ad.js            # Advertisement schema
├── server.js            # Main server + all API routes
├── .env                 # Environment variables
└── package.json
```

---

## ⚙️ Setup & Run

```bash
# Install dependencies
npm install

# Start the server
node server.js
```

Server will run at **http://localhost:5000**

On first start, the database auto-seeds with:
- Default categories
- Sample businesses
- Default admin user
- Default advertisements per page

---

## 🔑 Environment Variables (`.env`)

```
PORT=5000
JWT_SECRET=your_secret_key
```

---

## 📡 API Reference

### Auth

| Method | Endpoint              | Description          | Auth |
|--------|-----------------------|----------------------|------|
| POST   | `/api/auth/register`  | Register new user    | No   |
| POST   | `/api/auth/login`     | Login, returns token | No   |

---

### Businesses

| Method | Endpoint                | Description              | Auth         |
|--------|-------------------------|--------------------------|--------------|
| GET    | `/api/businesses`       | Get all (with filters)   | No           |
| GET    | `/api/businesses/:id`   | Get single business      | No           |
| POST   | `/api/businesses`       | Create new business      | User         |
| PUT    | `/api/businesses/:id`   | Update business          | Owner/Admin  |
| DELETE | `/api/businesses/:id`   | Delete business          | Owner/Admin  |

**Query Params for GET /api/businesses:**
- `category` — filter by category name
- `name` — search by business name
- `pincode` — filter by pincode
- `featured` — show only featured businesses

---

### Categories

| Method | Endpoint           | Description           | Auth  |
|--------|--------------------|-----------------------|-------|
| GET    | `/api/categories`  | Get all categories    | No    |

> Categories are automatically created when a business is added with a new category name.

---

### Advertisements

| Method | Endpoint         | Description            | Auth  |
|--------|------------------|------------------------|-------|
| GET    | `/api/ads`       | Get all ads            | No    |
| GET    | `/api/ads/:variant` | Get ad by page variant | No |
| PUT    | `/api/ads/:variant` | Update ad content  | Admin |

**Ad Variants:**

| Variant            | Page                    |
|--------------------|-------------------------|
| `home`             | Home page               |
| `categories`       | Categories page         |
| `directory`        | Directory page          |
| `business_sidebar` | Business detail sidebar |
| `business_bottom`  | Business detail bottom  |

---

### Admin — Users

| Method | Endpoint         | Description         | Auth  |
|--------|------------------|---------------------|-------|
| GET    | `/api/users`     | Get all users       | Admin |
| DELETE | `/api/users/:id` | Delete user         | Admin |

---

## 🔐 Default Admin Credentials

```
Email    : admin@yellowwebsite.com
Password : admin123
```

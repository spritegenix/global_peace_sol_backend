# 🟡 Yellow Pages — Local Business Directory

A full-stack local business directory platform where users can discover, list, and manage businesses by category. Admins have full control over listings, users, and advertisements.

---

## 📁 Project Structure

```
Yellow-Website/
├── frontend/        # React.js application (Vite)
├── backend/         # Node.js + Express server
└── README.md        # This file
```

---

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd backend
npm install
node server.js
```
Server runs on **http://localhost:5000**

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on **http://localhost:5173**

> ⚠️ Make sure the backend is running before the frontend — all API calls proxy to port 5000.

---

## 🔑 Default Admin Login

| Field    | Value                      |
|----------|----------------------------|
| Email    | admin@yellowwebsite.com    |
| Password | admin123                   |

---

## ✨ Features

- Browse businesses by category
- Search businesses by name or pincode
- Add, edit, and delete your own business listing
- Admin dashboard — manage users, businesses, categories, and ads
- Dynamic advertisement management per page
- Fully responsive design (mobile + desktop)
- Dark mode support

---

## 🛠 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React.js, Vite, Tailwind CSS      |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB (in-memory via MongoMemoryServer) |
| Auth      | JWT (JSON Web Tokens)             |

---

## 📄 Documentation

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

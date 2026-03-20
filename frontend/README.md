# 🟡 Yellow Pages — Frontend

This is the React.js frontend for the Yellow Pages business directory application.

---

## 🛠 Tech Stack

- **React.js** — UI library
- **Vite** — Fast build tool and dev server
- **Tailwind CSS** — Utility-first CSS framework
- **React Router DOM** — Client-side routing
- **Context API** — Global auth state management

---

## 📁 Folder Structure

```
frontend/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── AdBanner.jsx
│   ├── context/
│   │   └── AuthContext.jsx   # Global auth state
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   ├── Categories.jsx     # Browse all categories
│   │   ├── Directory.jsx      # Business listings + filters
│   │   ├── BusinessDetails.jsx# Individual business profile
│   │   ├── AddBusiness.jsx    # Add new business form
│   │   ├── EditBusiness.jsx   # Edit existing business
│   │   ├── Profile.jsx        # User dashboard
│   │   ├── AdminDashboard.jsx # Admin control panel
│   │   └── Auth.jsx           # Login / Register
│   ├── utils/
│   │   └── api.js             # Fetch wrapper with auth headers
│   ├── App.jsx                # Routes definition
│   └── main.jsx               # App entry point
├── vite.config.js             # Vite + proxy config
└── package.json
```

---

## ⚙️ Setup & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at **http://localhost:5173**

---

## 🔌 API Proxy

All `/api` requests are automatically forwarded to the backend at `http://localhost:5000` via the Vite proxy in `vite.config.js`.

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    }
  }
}
```

> ⚠️ Backend must be running on port 5000 for the frontend to work.

---

## 📄 Pages Overview

| Page              | Path                  | Auth Required |
|-------------------|-----------------------|---------------|
| Home              | `/`                   | No            |
| Categories        | `/categories`         | No            |
| Directory         | `/directory`          | No            |
| Business Details  | `/business/:id`       | No            |
| Add Business      | `/add-business`       | Yes           |
| Edit Business     | `/edit-business/:id`  | Yes (Owner)   |
| Profile           | `/profile`            | Yes           |
| Admin Dashboard   | `/admin`              | Yes (Admin)   |
| Login / Register  | `/auth`               | No            |

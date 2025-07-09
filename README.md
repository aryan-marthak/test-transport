# 🚗 Transportation Management System

A full-stack web application for managing vehicle requests, assignments, and fleet operations within an organization. Built with Node.js/Express (backend) and React (frontend).

---

## 📋 Features
- **Employee Dashboard:**
  - Submit vehicle requests
  - View request status and history
- **Admin Dashboard:**
  - Approve/reject trip requests
  - Assign vehicles and drivers
  - Add, remove, and manage vehicles and drivers
  - Mark vehicles as temporarily out of service
- **Real-time Updates:**
  - Live status updates for requests and assignments
- **Authentication:**
  - Secure login for employees and admins

---

## 🛠️ Tech Stack
- **Frontend:** React, Tailwind CSS, React Router, Lucide React
- **Backend:** Node.js, Express, Mongoose (MongoDB), JWT, CORS
- **Database:** MongoDB (local or Atlas)

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community) (local installation)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Transportation-Management-System
```

### 2. Install all dependencies
```bash
npm run install-all
```

### 3. Start the application
```bash
npm run dev
```
- This will start both the backend (http://localhost:5002) and frontend (http://localhost:5173) concurrently.

### 4. Access the app
- Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚙️ Configuration
- By default, the backend connects to a local MongoDB instance at `mongodb://localhost:27017/transportation`.
- To use a different MongoDB URI (e.g., MongoDB Atlas), create a `.env` file in the `backend` directory:
  ```env
  MONGODB_URI=your_mongodb_connection_string
  PORT=5002
  ```

---

## 👤 Default Accounts
- **Admin:**
  - Email: `admin@example.com`
  - Password: `aryan12345`
- **Employee:** (Would suggest you to SignUp your own new Employee.)
  - Email: `employee@example.com`
  - Password: `employee123`

---

## 📁 Project Structure
```
Transportation-Management-System/
├── backend/          # Node.js/Express backend
├── frontend/         # React frontend
├── package.json      # Root scripts for install/run
├── .gitignore
└── README.md
```

---

## 📝 Scripts
| Command                | Description                                      |
|------------------------|--------------------------------------------------|
| `npm run install-all`  | Installs backend and frontend dependencies       |
| `npm run dev`          | Starts backend and frontend concurrently         |
| `npm run dev-backend`  | Starts backend only                              |
| `npm run dev-frontend` | Starts frontend only                             |

---

## 🛠️ Troubleshooting
- **MongoDB connection failed:** Make sure MongoDB is running locally, or set the correct URI in `.env`.
- **Port already in use:** Check if ports 5002 (backend) or 5173 (frontend) are available.
- **Dependencies not found:** Run `npm run install-all` again.

---

## 📜 License
MIT License 
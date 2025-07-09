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
- **Database:** MongoDB Atlas (cloud-based)

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Transportation-Management-System
```

### 2. Install all dependencies
```bash
npm run install-all
```

### 3. Configure environment variables
- Copy the provided `.env.example` file in the `backend` directory to `.env`:
  ```bash
  cd backend
  cp .env.example .env
  ```
- Edit `.env` to add your MongoDB Atlas URI and desired PORT:
  ```env
  MONGODB_URI=your_mongodb_atlas_connection_string
  PORT=5002
  ```

#### How to generate a MongoDB Atlas URI:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up or log in.
2. Create a new project and cluster (free tier is fine).
3. In your cluster, click "Connect" > "Connect your application".
4. Copy the provided connection string (it looks like `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`).
5. Replace `<username>`, `<password>`, and any placeholder values with your actual credentials and database name.
6. Paste this string as the value for `MONGODB_URI` in your `.env` file.

#### PORT configuration:
- The default port is `5002`. You can change it in your `.env` file if needed.

### 4. Start the application
```bash
npm run dev
```
- This will start both the backend (http://localhost:5002) and frontend (http://localhost:5173) concurrently.

### 5. Access the app
- Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚙️ Configuration
- A demo `.env.example` file is provided in the `backend` directory:
  ```env
  MONGODB_URI=your_mongodb_atlas_connection_string
  PORT=5002
  ```
- Update the values as described above to match your MongoDB Atlas setup and desired port.

---

## 👤 Default Accounts
- **Admin:**
  - You would have to add an Admin account manually in the Database.
  - Email: `example@example.com`
  - Password: `example`
- **Employee:** 
  - You will have to SignUp to create new Employee.
  - Email: `example@example.com`
  - Password: `example`

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
- **MongoDB connection failed:** Make sure your MongoDB Atlas URI is correct and your cluster is running.
- **Port already in use:** Check if ports 5002 (backend) or 5173 (frontend) are available.
- **Dependencies not found:** Run `npm run install-all` again.

---

## 📜 License
MIT License 
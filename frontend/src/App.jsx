import './App.css'
import Login from './Components/Login'
import Signup from './Components/Signup'
import EmployeeDashboard from './Components/EmployeeDashboard'
import AdminDashboard from './Components/AdminDashboard'
import { Route, Routes, Navigate } from 'react-router-dom'
import authUser from './context/AuthUser.js'

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          authUser ? (
            authUser.role === 'admin' ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <Navigate to="/employee-dashboard" />
            )
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/signup"
        element={authUser ? <Navigate to="/" /> : <Signup />}
      />
      <Route
        path="/employee-dashboard"
        element={
          authUser && authUser.role === 'employee' ? (
            <EmployeeDashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          authUser && authUser.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/"
        element={<Navigate to={authUser ? (authUser.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard') : '/login'} />}
      />
    </Routes>
  )
}

export default App

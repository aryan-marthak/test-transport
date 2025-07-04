import React from 'react'
import useAuthUser from '../context/AuthUser'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const { logoutUser } = useAuthUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button 
        onClick={handleLogout}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Logout
      </button>
    </div>
  )
}

export default AdminDashboard

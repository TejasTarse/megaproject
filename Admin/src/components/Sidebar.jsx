import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white fixed top-0 left-0 h-screen overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav>
            <ul className="space-y-4">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/users">Users</Link></li>
                <li><Link to="/posts">Posts</Link></li>
                <li><Link to="/analytics">Analytics</Link></li>
            </ul>
        </nav>
    </div>
  )
}

export default Sidebar

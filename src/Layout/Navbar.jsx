import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = localStorage.getItem('name')
  const formatName = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : ''

  const navbar = [
    { path: '/', label: 'Spare Parts' },
    { path: '/in', label: 'Stock In' },
    { path: '/view', label: 'Stock Out' },
    { path: '/report', label: 'Reports' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    navigate('/')
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white rounded-md w-9 h-9 flex items-center justify-center font-bold">
              PR
            </div>
            <div className="font-bold text-xl text-white">
              PrepRush
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
              <Link
                to='/dashboard'
                className='px-4 py-2 text-sm font-medium bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors border border-gray-700 hover:border-gray-600 flex items-center space-x-1'
              >
                DashBoard
              </Link>
          </nav>
        </div>

        {/* User Controls */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-sm">
            <span className="text-gray-400">Hello,</span>
            <span className="font-medium text-blue-400">
              {name ? formatName(name) : 'Guest'}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors border border-gray-700 hover:border-gray-600 flex items-center space-x-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-gray-800 px-4 py-2">
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {navbar.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                location.pathname === item.path
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}

export default Navbar
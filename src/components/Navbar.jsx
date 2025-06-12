import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

    return (
        <nav className="bg-[#350D36] text-white p-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    <Link to="/dashboard" className="text-xl font-bold hover:text-gray-300 transition-colors">
                        PrepRush
                    </Link>
                    <Link 
                        to="/quiz" 
                        className="px-4 py-2 bg-white text-[#350D36] rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                        Start Quiz
                    </Link>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-white text-[#350D36] rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Navbar 
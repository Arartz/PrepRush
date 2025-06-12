import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 text-gray-400 text-sm py-4 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <div className="bg-blue-600 text-white rounded-md w-6 h-6 flex items-center justify-center text-xs font-bold">
              PR
            </div>
            <span className="text-white font-medium">PrepRush</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-6 text-center">
            <p>© {new Date().getFullYear()} PrepRush. All rights reserved.</p>
            <div className="hidden md:block h-4 w-px bg-gray-700"></div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <Link to='/contact'><a href="#" className="hover:text-white transition-colors">Contact</a></Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
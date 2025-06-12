import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

function Quiz() {
    const [modules, setModules] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        setError(null)
        axios.get('https://prepbackend-kc8b.onrender.com/get/modules')
            .then(res => {
                setModules(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setError('Failed to load modules')
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                    <p className="text-gray-400">Loading modules...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="h-171 bg-gray-900 flex items-center justify-center">
                <div className="bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-700 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-100 mb-4">Error loading content</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="h-171 bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3">Choose a Module</h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Select a module to start practicing
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module, index) => (
                        <Link 
                            key={index} 
                            to={`/lessons/${module.module_id}`}
                            className="transform transition-transform hover:scale-[1.02]"
                        >
                            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6 cursor-pointer hover:border-blue-500/50 hover:shadow-md transition-all duration-200 group">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-600 text-white rounded-lg w-8 h-8 flex items-center justify-center mr-3 font-bold">
                                        {index + 1}
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-100 group-hover:text-blue-400 transition-colors">
                                        {module.module_name}
                                    </h2>
                                </div>
                                <p className="text-gray-400 text-sm mb-4">
                                    {module.lesson_count || 0} lessons available
                                </p>
                                <div className="flex items-center text-blue-400 text-sm">
                                    Start practicing
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-10 flex justify-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-gray-700 text-white px-6 py-2.5 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Quiz

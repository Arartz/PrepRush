import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Progress() {
    const [progress, setProgress] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchProgress()
    }, [])

    const fetchProgress = () => {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem('token')
        if (!token) {
            setError('No authentication token found')
            setLoading(false)
            return
        }

        axios.get('https://prepbackend-kc8b.onrender.com/get/progress', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            setProgress(res.data)
            setLoading(false)
        })
        .catch(err => {
            console.error('Error fetching progress:', err)
            setError('Failed to load progress data')
            setLoading(false)
        })
    }

    const getGradeColor = (grade) => {
        switch (grade) {
            case 'A': return 'text-green-400'
            case 'B': return 'text-blue-400'
            case 'C': return 'text-yellow-400'
            default: return 'text-red-400'
        }
    }

    const calculateOverallProgress = () => {
        if (progress.length === 0) return 0
        const totalProgress = progress.reduce((acc, curr) => acc + curr.progress_percentage, 0)
        return Math.round(totalProgress / progress.length)
    }

    const getModuleProgress = (moduleId) => {
        const moduleProgress = progress.filter(p => p.module_id === moduleId)
        if (moduleProgress.length === 0) return 0
        const totalProgress = moduleProgress.reduce((acc, curr) => acc + curr.progress_percentage, 0)
        return Math.round(totalProgress / moduleProgress.length)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                    <p className="text-gray-400">Loading progress data...</p>
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
                        onClick={() => navigate(-1)}
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    const overallProgress = calculateOverallProgress()

    return (
        <div className="h-171 bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-100">Progress Dashboard</h2>
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gray-700 text-white px-6 py-2.5 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </button>
                    </div>

                    {/* Overall Progress */}
                    <div className="bg-gray-700/50 rounded-lg p-6 mb-8 border border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-100 mb-4">Overall Progress</h3>
                        <div className="w-full bg-gray-600 rounded-full h-4 mb-2">
                            <div 
                                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${overallProgress}%` }}
                            ></div>
                        </div>
                        <p className="text-lg text-gray-300">{overallProgress}% Complete</p>
                    </div>

                    {/* Module Progress */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {Array.from(new Set(progress.map(p => p.module_id))).map(moduleId => {
                            const moduleProgress = progress.filter(p => p.module_id === moduleId)
                            const moduleName = moduleProgress[0]?.module_name || 'Unknown Module'
                            const progress = getModuleProgress(moduleId)

                            return (
                                <div key={moduleId} className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                                    <h4 className="text-lg font-semibold text-gray-100 mb-4">{moduleName}</h4>
                                    <div className="w-full bg-gray-600 rounded-full h-3 mb-2">
                                        <div 
                                            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-base text-gray-300">{progress}% Complete</p>
                                </div>
                            )
                        })}
                    </div>

                    {/* Recent Activity */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-100 mb-6">Recent Activity</h3>
                        <div className="bg-gray-700/50 rounded-lg border border-gray-600 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-gray-800">
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Module</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Lesson</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Score</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Grade</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-600">
                                        {progress.slice(0, 10).map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-300">{item.module_name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-300">{item.lesson_title}</td>
                                                <td className="px-6 py-4 text-sm text-gray-300">{item.score}/{item.total_questions}</td>
                                                <td className={`px-6 py-4 text-sm font-semibold ${getGradeColor(item.grade)}`}>
                                                    {item.grade}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-400">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Progress 
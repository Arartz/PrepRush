import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
    const [modules, setModules] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [overallProgress, setOverallProgress] = useState(0)
    const [moduleProgress, setModuleProgress] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        fetchModules()
        fetchProgress()
    }, [])

    const fetchModules = () => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/')
            return
        }

        axios.get('http://localhost:4000/get/modules', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            setModules(res.data)
            setLoading(false)
        })
        .catch(err => {
            console.error('Error fetching modules:', err)
            setError('Failed to load modules')
            setLoading(false)
        })
    }

    const fetchProgress = () => {
        const token = localStorage.getItem('token')
        if (!token) return

        axios.get('http://localhost:4000/get/progress', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            if (res.data.length > 0) {
                const totalProgress = res.data.reduce((acc, curr) => acc + curr.progress_percentage, 0)
                const averageProgress = totalProgress / res.data.length
                setOverallProgress(Math.round(averageProgress))

                const moduleProgressMap = {}
                res.data.forEach(progress => {
                    if (!moduleProgressMap[progress.module_id]) {
                        moduleProgressMap[progress.module_id] = {
                            total: 0,
                            count: 0
                        }
                    }
                    moduleProgressMap[progress.module_id].total += progress.progress_percentage
                    moduleProgressMap[progress.module_id].count++
                })

                Object.keys(moduleProgressMap).forEach(moduleId => {
                    const { total, count } = moduleProgressMap[moduleId]
                    moduleProgressMap[moduleId] = Math.round(total / count)
                })

                setModuleProgress(moduleProgressMap)
            }
        })
        .catch(err => {
            console.error('Error fetching progress:', err)
        })
    }

    const handleModuleClick = (moduleId) => {
        navigate(`/lessons/${moduleId}`)
    }

    const getDifficultyColor = (level) => {
        if (!level) return 'bg-gray-800 text-gray-300 border-gray-700'
        
        const normalizedLevel = level.toString().toLowerCase().trim()
        switch(normalizedLevel) {
            case 'beginner':
                return 'bg-green-900/30 text-green-400 border-green-800'
            case 'intermediate':
                return 'bg-yellow-900/30 text-yellow-400 border-yellow-800'
            case 'advanced':
                return 'bg-red-900/30 text-red-400 border-red-800'
            default:
                return 'bg-gray-800 text-gray-300 border-gray-700'
        }
    }

    const getProgressColor = (percentage) => {
        if (percentage >= 75) return 'text-green-400'
        if (percentage >= 50) return 'text-yellow-400'
        if (percentage >= 25) return 'text-orange-400'
        return 'text-red-400'
    }

    const getProgressRingColor = (percentage) => {
        if (percentage >= 75) return 'stroke-green-500'
        if (percentage >= 50) return 'stroke-yellow-500'
        if (percentage >= 25) return 'stroke-orange-500'
        return 'stroke-red-500'
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                    <p className="text-gray-400">Loading your learning dashboard...</p>
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
                        onClick={fetchModules}
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="h-171 bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3">Your Learning Dashboard</h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Track your progress and continue your learning journey
                    </p>
                </div>

                {/* Overall Progress Card */}
                <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-gray-100 mb-1">Overall Progress</h2>
                            <p className="text-gray-500 text-sm">Across all learning modules</p>
                        </div>
                        
                        <div className="relative w-20 h-20">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#374151"
                                    strokeWidth="3"
                                />
                                <path
                                    d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#3B82F6"
                                    strokeWidth="3"
                                    strokeDasharray={`${overallProgress}, 100`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-xl font-bold ${getProgressColor(overallProgress)}`}>
                                    {overallProgress}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module) => {
                        const progress = moduleProgress[module.module_id] || 0
                        return (
                            <div
                                key={module.module_id}
                                onClick={() => handleModuleClick(module.module_id)}
                                className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6 cursor-pointer hover:border-blue-500/50 hover:shadow-md transition-all duration-200 group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold text-gray-100 group-hover:text-blue-400 transition-colors">
                                        {module.module_name}
                                    </h3>
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(module.difficulty_level)}`}>
                                        {module.difficulty_level || 'Unrated'}
                                    </span>
                                </div>

                                <p className="text-gray-400 text-sm mb-6">{module.description || 'No description available'}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="relative w-12 h-12">
                                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                                <path
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#374151"
                                                    strokeWidth="3"
                                                />
                                                <path
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    strokeWidth="3"
                                                    strokeDasharray={`${progress}, 100`}
                                                    strokeLinecap="round"
                                                    className={getProgressRingColor(progress)}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className={`text-xs font-bold ${getProgressColor(progress)}`}>
                                                    {progress}%
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500">Complete</span>
                                    </div>

                                    <button className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center">
                                        Continue
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
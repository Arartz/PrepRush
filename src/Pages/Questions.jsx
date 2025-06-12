import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

function Questions() {
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState({})
    const [score, setScore] = useState(0)
    const [showResults, setShowResults] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadQuestions()
    }, [id])

    const loadQuestions = () => {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem('token')
        if (!token) {
            setError('No authentication token found')
            setLoading(false)
            return
        }

        axios.get(`http://localhost:4000/get/next-questions/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            if (res.data.length === 0) {
                setError('No more questions available for this lesson')
                setLoading(false)
                return
            }
            setQuestions(res.data)
            setAnswers({})
            setShowResults(false)
            setLoading(false)
        })
        .catch(err => {
            console.error('Error loading questions:', err)
            setError('Failed to load questions')
            setLoading(false)
        })
    }

    const handleAnswerSelect = (questionId, optionId) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }))
    }

    const calculateGrade = (score) => {
        if (score >= 4) return 'A'
        if (score >= 3) return 'B'
        if (score >= 2) return 'C'
        return 'D'
    }

    const getComment = (grade) => {
        switch (grade) {
            case 'A': return 'Excellent! You have a great understanding of this topic!'
            case 'B': return 'Good job! Keep practicing to improve further.'
            case 'C': return 'You\'re on the right track. Review the material and try again.'
            default: return 'Keep studying! You\'ll get better with practice.'
        }
    }

    const handleSubmit = async () => {
        // Check if all questions are answered
        if (Object.keys(answers).length !== questions.length) {
            alert('Please answer all questions before submitting')
            return
        }

        let correctAnswers = 0
        questions.forEach(question => {
            const selectedOption = question.options.find(opt => opt.id === answers[question.id])
            if (selectedOption?.is_correct) {
                correctAnswers++
            }
        })

        setScore(correctAnswers)
        setShowResults(true)

        // Save progress
        const finalGrade = calculateGrade(correctAnswers)
        const token = localStorage.getItem('token')
        
        if (!token) {
            console.error('No authentication token found')
            alert('Please log in again to save your progress')
            return
        }

        // Log the data being sent
        const progressData = {
            lessonId: id,
            score: correctAnswers,
            totalQuestions: questions.length,
            grade: finalGrade
        }
        console.log('Saving progress:', progressData)

        try {
            const response = await axios.post('http://localhost:4000/save/progress', progressData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            console.log('Progress saved successfully:', response.data)
            
            // Show success message with progress details
            const { progress } = response.data
            alert(`Progress saved successfully!\nLesson Progress: ${Math.round(progress.lesson)}%\nModule Progress: ${Math.round(progress.module)}%\nOverall Progress: ${Math.round(progress.overall)}%`)
        } catch (err) {
            console.error('Error saving progress:', err.response?.data || err.message)
            const errorMessage = err.response?.data?.details || err.response?.data?.error || 'Failed to save progress. Please try again.'
            alert(`Error: ${errorMessage}`)
        }
    }

    const handleBackToMenu = () => {
        navigate(-1)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                    <p className="text-gray-400">Loading questions...</p>
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
                        onClick={handleBackToMenu}
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Back to Lessons
                    </button>
                </div>
            </div>
        )
    }

    if (questions.length === 0) {
        return (
            <div className="h-171 bg-gray-900 flex items-center justify-center">
                <div className="bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-700 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-100 mb-4">No Questions Available</h2>
                    <p className="text-gray-400 mb-6">No more questions available for this lesson</p>
                    <button 
                        onClick={handleBackToMenu}
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Back to Lessons
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="h-171 bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {!showResults ? (
                    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
                        <h2 className="text-2xl font-bold text-gray-100 mb-6">
                            Quiz Questions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {questions.map((question, index) => (
                                <div key={question.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                                    <p className="text-lg font-semibold text-gray-100 mb-4">
                                        Question {index + 1}: {question.content}
                                    </p>
                                    <div className="space-y-3">
                                        {question.options.map((option) => (
                                            <button
                                                key={option.id}
                                                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                                                    answers[question.id] === option.id
                                                        ? 'bg-blue-600 text-white border-blue-500'
                                                        : 'bg-gray-800 text-gray-100 border-gray-600 hover:bg-gray-700'
                                                }`}
                                                onClick={() => handleAnswerSelect(question.id, option.id)}
                                            >
                                                {option.content}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 flex justify-between items-center">
                            <button
                                onClick={handleBackToMenu}
                                className="bg-gray-700 text-white px-6 py-2.5 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Lessons
                            </button>
                            <button
                                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors flex items-center"
                                onClick={handleSubmit}
                                disabled={Object.keys(answers).length !== questions.length}
                            >
                                Submit Quiz
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
                        <h2 className="text-2xl font-bold text-gray-100 mb-6">Quiz Results</h2>
                        <div className="bg-gray-700/50 rounded-lg p-6 mb-6 border border-gray-600">
                            <p className="text-xl text-gray-100 mb-2">Score: {score} out of {questions.length}</p>
                            <p className="text-xl text-gray-100 mb-2">Grade: {calculateGrade(score)}</p>
                            <p className="text-lg text-gray-300">{getComment(calculateGrade(score))}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {questions.map((question, index) => {
                                const selectedOption = question.options.find(opt => opt.id === answers[question.id])
                                const correctOption = question.options.find(opt => opt.is_correct)
                                const isCorrect = selectedOption?.is_correct

                                return (
                                    <div key={question.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                                        <p className="text-lg font-semibold text-gray-100 mb-3">Question {index + 1}: {question.content}</p>
                                        <p className={`mb-2 text-base ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                            Your answer: {selectedOption?.content}
                                        </p>
                                        {!isCorrect && (
                                            <p className="text-green-400 text-base">
                                                Correct answer: {correctOption?.content}
                                            </p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="mt-8 flex justify-between">
                            <button
                                className="bg-gray-700 text-white px-6 py-2.5 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                                onClick={handleBackToMenu}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Lessons
                            </button>
                            <button
                                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                onClick={loadQuestions}
                            >
                                Try Another Quiz
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Questions
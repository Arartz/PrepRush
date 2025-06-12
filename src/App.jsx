import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Layout/Login'
import Register from './Layout/Register'
import Dashboard from './Pages/Dashboard'
import Quiz from './Pages/Quiz'
import Lessons from './Pages/Lessons'
import Questions from './Pages/Questions'
import Navbar from './Layout/Navbar'
import Footer from './Layout/Footer'
import Contact from './Pages/Contact'

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token')
    if (!token) {
        return <Navigate to="/" replace />
    }
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    )
}

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/quiz" 
                        element={
                            <ProtectedRoute>
                                <Quiz className='bg-gray-900'/>
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/lessons/:id" 
                        element={
                            <ProtectedRoute>
                                <Lessons />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/questions/:id" 
                        element={
                            <ProtectedRoute>
                                <Questions />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/contact" 
                        element={
                            <ProtectedRoute>
                                <Contact />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </div>
        </Router>
    )
}

export default App

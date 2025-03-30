import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import Profile from './components/Profile.jsx'
import CreatePost from './components/CreatePost.jsx'
import Pins from './components/Pins.jsx'
import SingleBoard from './components/SingleBoard.jsx'
import SinglePin from './components/SinglePin.jsx'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/CreatePost" element={<CreatePost />} />
        <Route path="/Pins" element={< Pins />} />
        <Route path="/SingleBoard/:boardId" element={<SingleBoard />} />
        <Route path="/post/:postId" element={<SinglePin />} /> 
        </Routes>
    </Router>
  )
}

export default App
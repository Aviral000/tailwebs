import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './components/Login'
import TeacherPortal from './components/TeacherPortal'

export default function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' Component={Login} />
          <Route path='/dashboard' Component={TeacherPortal} />
        </Routes>
      </Router>
    </div>
  )
}

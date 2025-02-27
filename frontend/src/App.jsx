import React from 'react'
import Hero from './pages/Hero'
import CourseAggregator from './components/CourseAggregator'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import StudentDashboard from './components/dashboard/StudentDashboard'
 const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/courses" element={<CourseAggregator />} />
      <Route path='/dashboard' element={<StudentDashboard />} />
    </Routes>
    </BrowserRouter>
  )
}
export default App

import React,{useState} from 'react'
import Hero from './pages/Hero'
import CourseAggregator from './components/CourseAggregator'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import ModernNavbar from './components/navigation/ModernNavbar'
import StudentDashboard from './components/dashboard/StudentDashboard'
import user from '../src/assets/user.jpg'
import CareerTest from './components/CareerTest'
import Gamification from './components/Gamification'
import ChatButton from './components/navigation/ChatButton'
 const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <BrowserRouter>
    <ModernNavbar 
        userName="Pravin Nandankar"
        userAvatar={user} 
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/courses" element={<CourseAggregator />} />
      <Route path="/gamify" element={<Gamification />} />
      <Route path='/career-test/:title' element={<CareerTest />} />
      <Route path='/dashboard' element={<StudentDashboard />} />
    </Routes>
    <ChatButton />
    </BrowserRouter>
  )
}
export default App

import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AuthForm from './components/AuthForm';
import NotFound from './pages/NotFound';
import Interview from './pages/Interview';
import Feedback from './pages/Feedback';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path='/login' element={<AuthForm method='login'/>} />
        <Route path='/register' element={<AuthForm method='register'/>} />
        <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>} />
        <Route path='/interview/:id' element={<ProtectedRoute><Interview/></ProtectedRoute>} />
        <Route path='/interview/:id/feedback/' element={<ProtectedRoute><Feedback/></ProtectedRoute>} />
        
        <Route path='*' element={<NotFound/>} />
      </Routes>
    </Router>
    </>
  )
}

export default App

import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './pages/login';
import Home from './pages/home';
import Register from './pages/register';
import CreateEvent from './pages/createEvent';
import { AuthProvider } from './context/auth';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Profile from './pages/profile';
import ProtectedRoute from './componets/protectedRoute';

import Chat from './pages/chat';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute component={ Profile } />} />
          <Route path="/createEvent" element={<ProtectedRoute component={ CreateEvent } />} />
          <Route path="/chat" element={<ProtectedRoute component={ Chat } />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>,
)

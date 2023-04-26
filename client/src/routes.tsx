import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Chat from './pages/Chat'
import Home from './pages/Home'
import Login from 'pages/Login'
import Signup from 'pages/Signup'

export const MyRoutes = (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </BrowserRouter>
)

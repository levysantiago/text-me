import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Chat from './pages/Chat'
import Home from './pages/Home'

export const MyRoutes = (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  </BrowserRouter>
)

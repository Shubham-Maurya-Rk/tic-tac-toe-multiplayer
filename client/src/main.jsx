import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'remixicon/fonts/remixicon.css'
import App from './App.jsx'
import UserContext from './context/UserContext.jsx'
import RoomContext from './context/RoomContext.jsx'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <UserContext>
    <RoomContext>
      <App />
      <ToastContainer
        position="top-right"
        theme='colored'
      />
    </RoomContext>
  </UserContext>
)

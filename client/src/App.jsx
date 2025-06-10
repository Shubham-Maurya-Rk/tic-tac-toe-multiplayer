import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Signup, Login, Home, Protector } from './pages'
import Game from './pages/Game'
import SocketError from './components/SocketError'
import WarsList from './pages/WarsList'
import SinglePlayer from './SinglePlayer'
import SinglePlayerHome from './pages/SinglePlayerHome'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Protector />}>
          <Route path='' element={<Home />} />
          <Route path='/single-player' element={<SinglePlayerHome />}></Route>
          <Route path='/single-player/:difficulty' element={<SinglePlayer />}></Route>
          <Route path='game' element={
            <Game />
          } />
          <Route path='/wars' element={<WarsList />}></Route>
        </Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/socket-error' element={<SocketError />} />
      </Routes>
    </Router>
  )
}

export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import NavBar from './NavBar'
import Home from './Home'
import Menu from './Menu'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <>
      <Router>
        <div className="app">
          <NavBar></NavBar>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  )
}

export default App

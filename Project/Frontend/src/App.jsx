import NavBar from './NavBar'
import Home from './Home'
import Menu from './Menu'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Container } from "@mui/material";
import Login from './Login'

function App() {
  return (
    <>
      <Container>
        <Router>
          <div className="app">
            <NavBar></NavBar>
            <div className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/login" element={<Login />}></Route>
              </Routes>
            </div>
          </div>
        </Router>
      </Container>
    </>
  )
}

export default App

import NavBar from './NavBar'
import Home from './Home'
import Menu from './Menu'
import Staff from './Staff'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Container } from "@mui/material";

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
                <Route path="/login" element={<Staff />}></Route>
              </Routes>
            </div>
          </div>
        </Router>
      </Container>
    </>
  )
}

export default App

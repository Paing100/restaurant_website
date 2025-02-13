import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from "@mui/material";
import NavBar from './NavBar';
import Home from './Home';
import Menu from './Menu';
import Staff from './Staff';
import Order from './Order';
import { CartProvider } from './CartContext';

function App() {
  return (
    <CartProvider>
      <Container>
        <Router>
          <div className="app">
            <NavBar />
            <div className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/order" element={<Order />} />
                <Route path="/login" element={<Staff />} />
              </Routes>
            </div>
          </div>
        </Router>
      </Container>
    </CartProvider>
  );
}

export default App;

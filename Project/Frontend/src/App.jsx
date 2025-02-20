import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './Home';
import Menu from './Menu';
import Login from './Login';
import Waiter from './Waiter';
import Order from './Order';
import { CartProvider } from './CartContext';
import sessionCheck from './sessionCheck'

function App() {

  return (
    <CartProvider>
      <Router>
        <div className="app">
          <NavBar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/order" element={<Order />} />
              <Route path="/login" element={<Login />} />
              <Route path="/waiter" element={<sessionCheck><Waiter /></sessionCheck>} />
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

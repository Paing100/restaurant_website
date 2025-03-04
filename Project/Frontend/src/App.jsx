import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './Home';
import Menu from './Menu';
import Login from './Login';
import Waiter from './Waiter';
import Order from './Order';
<<<<<<< HEAD
import { CartProvider } from './CartContext';

=======
import { CartProvider, CartContext } from './CartContext';
import CustomerModal from './CustomerModal';
import MenuWaiter from './MenuWaiter'; 
import EditMenu from './EditMenu'
>>>>>>> origin

function AppContent() {
  return (
    <div className="app">
      <NavBar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order" element={<Order />} />
          <Route path="/login" element={<Login />} />
          <Route path="/waiter" element={<sessionCheck><Waiter /></sessionCheck>} />
          <Route path="/waiter_menu" element={<sessionCheck><MenuWaiter /></sessionCheck>}/>
          <Route path="/watier_edit_menu/:id" element={<sessionCheck><EditMenu></EditMenu></sessionCheck>}/>
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './Home';
import Menu from './Menu';
import Login from './Login';
import Waiter from './Waiter';
import Order from './Order';
import AllOrders from './AllOrders'; // Corrected import
import { CartProvider } from './CartContext';
import MenuWaiter from './MenuWaiter';
import EditMenu from './EditMenu';
import KitchenStaff from "./KitchenStaff";
import Manager from "./Manager";
import Register from './Register';
import CalculatePrice from "./CalculatePrice";
import EmployeeData from './EmployeeData';

function AppContent() {
  return (
    <>
      <div className="app">
        <NavBar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/order" element={<Order />} />
            <Route path="/allorders" element={<AllOrders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/waiter" element={<sessionCheck><Waiter /></sessionCheck>} />
            <Route path="/waiter_menu" element={<sessionCheck><MenuWaiter /></sessionCheck>} />
            <Route path="/waiter_edit_menu/:id" element={<sessionCheck><EditMenu></EditMenu></sessionCheck>} />
            <Route path="/kitchen" element={<sessionCheck><KitchenStaff /></sessionCheck>} />
            <Route path="/manager" element={<sessionCheck><Manager /></sessionCheck>} />
            <Route path="/register" element={<Register></Register>} />
            <Route path="/calculatePrice" element={<CalculatePrice></CalculatePrice>} />
            <Route path="/employeeData" element={<EmployeeData></EmployeeData>} />
          </Routes>
        </div>
      </div>
    </>
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

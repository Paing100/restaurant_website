import { Snackbar, Alert } from "@mui/material";
import PropTypes from "prop-types";
import { useContext, useState, useEffect } from "react";
import { CartContext } from './CartContext/CartContextContext.jsx';
import CustomerModal from "./CustomerModal";
import NewOrderModal from "./NewOrderModal";
import { replaceSuggestion, createNewOrder, addItemToCart } from "./CartContext/cartUtils";
import CardItem from "./MenuCard/CardItem.jsx"; 
import axios from "axios";

function MenuCard({ item, isWaiterView }) {
  // Access cart-related functions and customer data from CartContext
  const { suggestions, menuItems, tableNum, setTableNum, setCustomer, setSuggestions, setCart, cart, customer } = useContext(CartContext);
  
  // state variables 
  const [message, setMessage] = useState(''); // snackbar message
  const [severity, setSeverity] = useState('success'); // snackbar severity
  const [quantity, setQuantity] = useState(1); // quanitty of the item add to cart
  const [showModal, setShowModal] = useState(false); // controls the visibility of the customer modal 
  const [pendingAdd, setPendingAdd] = useState(false); // tracks if an item is pending addition to the cart 
  const [openSnackbar, setOpenSnackbar] = useState(false); // controls the visibility of the snackbar 
  const [showNewOrderModal, setShowNewOrderModal] = useState(false); // controls the visibility of the new order modal 

  // Watch for customer changes to complete pending add
  useEffect(() => {
    if (customer && pendingAdd && !showNewOrderModal) {
      addItemToCart(customer, item.itemId, quantity, cart).then(setCart); // add item to cart
      setPendingAdd(false); // reset pending add state 
      setMessage("Item Added to Cart!"); // set success message
      setSeverity('success'); // set serverity for snackbar
      setOpenSnackbar(true); // show snackbar 
    }
  }, [customer, pendingAdd, item.itemId, quantity, addItemToCart, showNewOrderModal]);

  // handle adding an item to cart 
  const handleAddToCart = async () => {
    if (!customer) {
      setShowModal(true); // show customer modal if no customer is logged in
      setPendingAdd(true); // mark the item as pending addition 
      return;
    }

    if (customer.orderId === 0) {
      setShowNewOrderModal(true); // Show the new order modal if no order exists
      setPendingAdd(true); // Mark the item as pending addition
      return;
    }

    try {
      // Check if the current order is submitted
      const {data: orderData} = await axios.get(`http://localhost:8080/api/orders/${customer.orderId}/getOrder`);
      const isOrderSubmitted = orderData.orderStatus === 'SUBMITTED';

      if (isOrderSubmitted) {
        // Show the new order confirmation modal
        setShowNewOrderModal(true);
        setPendingAdd(true);
        return;
      }

      // If order is not submitted, add item directly
      const updatedCart = await addItemToCart(customer, item.itemId, quantity, cart);
      if (suggestions && suggestions.some(s => s.itemId === item.itemId)) {
        const newSuggestions = replaceSuggestion(cart, menuItems, suggestions, item.itemId);
        setSuggestions(newSuggestions);
      }
      setCart(updatedCart);
      setMessage("Item Added to Cart!");
      setSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error checking order status:', error);
      setMessage("Error adding item to cart");
      setSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleOnConfirm = async () => {
            try {
              const result = await createNewOrder(customer, tableNum);
              if (result.success) {
                setCart({ orderedItems: {} }); // Clear the cart for the new order
                setCustomer(prevCustomer => ({
                    ...prevCustomer,
                    orderId: result.orderId
                }));
                setTableNum(tableNum);
                setPendingAdd(true);
              } else {
                setMessage("Error creating new order");
                setSeverity('error');
                setOpenSnackbar(true);
              }
              setShowNewOrderModal(false);
            } catch (error) {
              console.error('Error in order creation process:', error);
              setMessage("Error in order creation process");
              setSeverity('error');
              setOpenSnackbar(true);
              setShowNewOrderModal(false);
              setPendingAdd(false);
            }
          };


  // handle closing the customer modal 
  const handleModalClose = () => {
    setShowModal(false);
    if (!customer) { setPendingAdd(false); }
  };

  // handle closing the snackbar 
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
    {/* Card for displaying menu item details */}
    <CardItem
      item={item}
      isWaiterView={isWaiterView}
      setQuantity={setQuantity}     
      handleAddToCart={handleAddToCart}
      quantity={quantity}
    />
      
      {/* Customer modal */}
      {showModal && <CustomerModal onClose={handleModalClose} />}
      {/* New order modal */}
      {showNewOrderModal && (
        <NewOrderModal
          open={showNewOrderModal}
          onClose={() => {
            setShowNewOrderModal(false);
            setPendingAdd(false);
          }}
          onConfirm={handleOnConfirm}
          title="Create New Order?"
          content="Would you like to create a new order to add more items?"
          confirmButtonText="Yes, Create New Order"
          cancelButtonText="No, Go Back"
        />
      )}

      {/* Snackbar for notifications */}
      <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>

  );
}

// PropTypes validation for the `item` and `isWaiterView` props
MenuCard.propTypes = {
  item: PropTypes.shape({
    itemId: PropTypes.number.isRequired,
    imagePath: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    calories: PropTypes.number.isRequired,
    allergens: PropTypes.arrayOf(PropTypes.string).isRequired,
    dietaryRestrictions: PropTypes.arrayOf(PropTypes.string).isRequired,
    available: PropTypes.bool.isRequired,
  }).isRequired,
  isWaiterView: PropTypes.bool.isRequired,
};

export default MenuCard;

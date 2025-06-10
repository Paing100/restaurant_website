import { Card, CardActionArea, CardContent, Typography, CardMedia, Button, Box, TextField, Snackbar, Alert } from "@mui/material";
import PropTypes from "prop-types";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "./CartContext";
import { Link } from "react-router-dom";
import CustomerModal from "./CustomerModal";
import NewOrderModal from "./NewOrderModal";
import { replaceSuggestion } from "./CartContext/cartUtils";

function MenuCard({ item, isWaiterView }) {
  // Access cart-related functions and customer data from CartContext
  const { suggestions, menuItems, setSuggestions, setCart, cart, addItemToCart, customer, createNewOrder } = useContext(CartContext);
  
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
      const response = await fetch(`http://localhost:8080/api/orders/${customer.orderId}/getOrder`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order status');
      }

      const orderData = await response.json();
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
    <Card sx={{ height: '100%', backgroundColor: '#3c3a3a', color: 'white' }}>
      <CardActionArea sx={{ height: '100%' }}>
        {/* Display the item's image */}
        <CardMedia
          component="img"
          height="200"
          image={item.imagePath}
          alt={item.name}
        />
        {/* Overlay for unavailable items */}
        {!item.available && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.6)', // Transparent overlay
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            Unavailable
          </Box>
        )}
        {/* Card content */}
        <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 'calc(100% - 200px)' }}>
          <Box>
            {/* Item details */}
            <Typography variant="h6" sx={{ color: 'white' }}>{item.name}</Typography>
            <Typography variant="body2" sx={{ color: 'lightgray' }}>
              {item.description}
            </Typography>
            <Typography variant="subtitle1" sx={{ marginTop: 1, color: 'white' }}>
              Price: {item.price}
            </Typography>
            <Typography variant="body2" sx={{ color: 'lightgray' }}>
              Calories: {item.calories} kcal
            </Typography>
            <Typography variant="body2" sx={{ color: 'lightgray' }}>
              Allergies: {item.allergens.join(", ")}
            </Typography>
            <Typography variant="body2" sx={{ color: 'lightgray' }}>
              Dietary Restrictions: {item.dietaryRestrictions.join(", ")}
            </Typography>
            </Box>
          {/* Add to cart button for customers */}
          {
            !isWaiterView && item.available && (
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  sx={{
                    width: 100,
                    marginRight: 2,
                    "& .MuiInputBase-input": { color: "white" },
                    "& .MuiInputLabel-root": { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "white" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                  }}
                  InputProps={{ inputProps: { min: 1 } }}
                />
                <Button variant="contained" sx={{ backgroundColor: "#333", color: "white", "&:hover": { backgroundColor: "darkgray" } }} onClick={handleAddToCart}>
                  Add to Cart
                </Button>
              </Box>
            )}
            {/* Edit button for waiters */}
            {isWaiterView && (
              <Link to={`/waiter_edit_menu/${item.itemId}`}>
                <Button>Edit</Button>
              </Link>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
      
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
          onConfirm={async () => {
            try {
              const result = await createNewOrder();
              if (result.success) {
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
          }}
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

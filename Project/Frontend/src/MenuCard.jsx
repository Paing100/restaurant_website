import { Card, CardActionArea, CardContent, Typography, CardMedia, Button, Box, TextField, Snackbar, Alert } from "@mui/material";
import PropTypes from "prop-types";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "./CartContext";
import { Link } from "react-router-dom";
import CustomerModal from "./CustomerModal";
import NewOrderModal from "./NewOrderModal";

function MenuCard({ item, isWaiterView }) {
  const { addItemToCart, customer, createNewOrder } = useContext(CartContext);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [pendingAdd, setPendingAdd] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  // Watch for customer changes to complete pending add
  useEffect(() => {
    if (customer && pendingAdd && !showNewOrderModal) {
      addItemToCart(item.itemId, quantity);
      setPendingAdd(false);
      setMessage("Item Added to Cart!");
      setSeverity('success');
      setOpenSnackbar(true);
    }
  }, [customer, pendingAdd, item.itemId, quantity, addItemToCart, showNewOrderModal]);

  const handleAddToCart = async () => {
    if (!customer) {
      setShowModal(true);
      setPendingAdd(true);
      return;
    }

    if (customer.orderId === 0) {
      setShowNewOrderModal(true);
      setPendingAdd(true);
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
      await addItemToCart(item.itemId, quantity);
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

  const handleModalClose = () => {
    setShowModal(false);
    if (!customer) {
      setPendingAdd(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
    <Card sx={{ height: '100%', backgroundColor: '#3c3a3a', color: 'white' }}>
      <CardActionArea sx={{ height: '100%' }}>
        <CardMedia
          component="img"
          height="200"
          image={item.imagePath}
          alt={item.name}
        />
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
        <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 'calc(100% - 200px)' }}>
          <Box>
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
            {isWaiterView && (
              <Link to={`/waiter_edit_menu/${item.itemId}`}>
                <Button>Edit</Button>
              </Link>
            )}
          </CardContent>
        </CardActionArea>
      </Card>

      {showModal && <CustomerModal onClose={handleModalClose} />}
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
        />
      )}

      <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
      
  );
}


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

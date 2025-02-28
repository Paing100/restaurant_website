/* eslint-disable */
import { Card, CardActionArea, CardContent, Typography, CardMedia, Button, Box, TextField } from "@mui/material";
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { CartContext } from './CartContext';
import { Link } from "react-router-dom";


function MenuCard({ item, isWaiterView }) {
  const { addItemToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (itemId, quantity) => {
    addItemToCart(itemId, quantity);
  };

  return (
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
            <Button
              variant="contained"
              sx={{ marginTop: 2, backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button> 
          )}
          {
            isWaiterView && (
              <Link to={`/watier_edit_menu/${item.itemId}`}>
                <Button>
                  Edit
                </Button>
              </Link>
            )
          }
        </CardContent>
      </CardActionArea>
    </Card>
  );
}


MenuCard.propTypes = {
  item: PropTypes.shape({
    itemId: PropTypes.number.isRequired, // Change 'id' to 'itemId'
    imagePath: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    calories: PropTypes.number.isRequired,
    allergens: PropTypes.arrayOf(PropTypes.string).isRequired,
    dietaryRestrictions: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default MenuCard;
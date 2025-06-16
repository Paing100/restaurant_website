import { Card, CardActionArea, CardContent, Typography, CardMedia, Button, Box, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {inputStyle} from '../useCommonInputStyle';

function CardItem ({item, isWaiterView, setQuantity, handleAddToCart, quantity}) {
  return (
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
                    ...inputStyle
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
  );
}
CardItem.propTypes = {
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
  setQuantity: PropTypes.func.isRequired,
  handleAddToCart: PropTypes.func.isRequired,
  quantity: PropTypes.number.isRequired
};
export default CardItem; 


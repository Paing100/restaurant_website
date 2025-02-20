import { Card, CardActionArea, CardContent, Typography, CardMedia, Button, Box } from "@mui/material";
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { CartContext } from './CartContext';

function MenuCard({ item }) {
  const { addItemToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addItemToCart(item);
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
          <Button
            variant="contained"
            sx={{ marginTop: 2, backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

MenuCard.propTypes = {
  item: PropTypes.shape({
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
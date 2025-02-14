import { Card, CardActionArea, CardContent, Typography, CardMedia, Button } from "@mui/material";
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { CartContext } from './CartContext';

function MenuCard({ item }) {
  const { addItemToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addItemToCart(item);
  };

  return (
    <Card>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={item.img}
          alt={item.name}
        />
        <CardContent>
          <Typography variant="h6">{item.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {item.description}
          </Typography>
          <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
            Price: {item.price}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Calories: {item.calories} kcal
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Allergies: {item.allergens.join(", ")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Dietary Restrictions: {item.dietaryRestrictions.join(", ")}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
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
    img: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    calories: PropTypes.number.isRequired,
    allergens: PropTypes.arrayOf(PropTypes.string).isRequired,
    dietaryRestrictions: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default MenuCard;
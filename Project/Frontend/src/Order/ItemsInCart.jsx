import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, Typography, List, ListItem, ListItemText, Box, CardMedia, IconButton } from '@mui/material';
import PropTypes from 'prop-types';

function ItemsInCart({orderedItems, decreaseItemQuantity, increaseItemQuantity, removeItemFromCart, customer, cart, fetchCart, setCart}) {
  return (
        <>
            <Typography variant="h5" sx={{ marginTop: 4, padding: '15px', borderBottom: '1px solid #333' }}>Ordered Items</Typography>
            <List sx={{ mb: 4 }}>
                {Object.entries(orderedItems).map(([itemName, item]) => {
                    const itemTotal = item.price * item.quantity;
                    return (
                        <ListItem key={itemName} sx={{ borderBottom: '1px solid #333' }}>
                            <CardMedia
                                component="img"
                                height="50"
                                image={item.imagePath}
                                sx={{ marginRight: 2, width: 50, borderRadius: "25%" }}
                            />
                            <ListItemText
                                primary={itemName}
                                secondary={`£${item.price.toFixed(2)} each • Total: £${itemTotal.toFixed(2)}`}
                                sx={{ color: 'white' }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                                <IconButton
                                    onClick={() => decreaseItemQuantity(item.itemId)}
                                    sx={{ color: 'white' }}
                                >
                                    <RemoveIcon />
                                </IconButton>
                                <Typography sx={{ margin: '0 10px', color: 'white' }}>
                                    {item.quantity}
                                </Typography>
                                <IconButton
                                    onClick={() => increaseItemQuantity(item.itemId)}
                                    sx={{ color: 'white' }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Box>
                            <Button
                                onClick={async () => {
                                    const result = await removeItemFromCart(customer, cart, item.itemId, true);
                                           if (result){
                                                fetchCart(customer).then(setCart);
                                            }
                                }}
                                sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
                            >
                                Remove All
                            </Button>


                        </ListItem>
                    );
                })}
            </List>
        </>
  );
}

ItemsInCart.propTypes = {
    orderedItems: PropTypes.object.isRequired,
    decreaseItemQuantity: PropTypes.func.isRequired,
    increaseItemQuantity: PropTypes.func.isRequired,
    removeItemFromCart: PropTypes.func.isRequired,
    customer: PropTypes.object.isRequired,
    cart: PropTypes.object.isRequired,
    fetchCart: PropTypes.func.isRequired,
    setCart: PropTypes.func.isRequired
}

export default ItemsInCart;
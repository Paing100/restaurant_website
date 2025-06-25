import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, Typography, List, ListItem, ListItemText, Box, CardMedia, IconButton, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useEffect, useRef, useCallback } from 'react';

function ItemsInCart({charLeft, setCharLeft, comment, setComment, orderedItems, decreaseItemQuantity, increaseItemQuantity, removeItemFromCart, customer, cart, fetchCart, setCart}) {
    
    const customerRef = useRef();

    function debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    }
    const debounceRef = useRef({});

    const saveCommentToDatabase = useCallback(async (itemId, messageComment, quantity) => {
        const currentCustomer = customerRef.current;
        if (!currentCustomer) {
            console.error('Customer is not set ' + JSON.stringify(currentCustomer));
            return;
        }
        try {
            await axios.post(`http://localhost:8080/api/orders/${currentCustomer.orderId}/addItems?itemId=${itemId}&quantity=${quantity}&comment=${messageComment}`);
            return fetchCart(currentCustomer).then(setCart);
        } catch (error) {
            console.error('Error adding comment for the item:', error);
            throw error;
        }
    },[fetchCart, setCart])

    const fetchComments = useCallback(async () => {
        try {
            const { data: currentComment } = await axios.get(`http://localhost:8080/api/${customerRef.current.orderId}/comments`);
            const newComment = {};
            const newCharLeft = {};
            const orderId = customerRef.current.orderId;

            Object.values(orderedItems).forEach(item => {
                const key = `${orderId} - ${item.itemId}`;
                const commentText = currentComment[key] || '';
                newComment[item.itemId] = commentText;
                newCharLeft[item.itemId] = 100 - commentText.length;   
            });
            setComment(newComment);
            setCharLeft(newCharLeft);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
    },[orderedItems, setCharLeft, setComment]);

    useEffect(() => {
        customerRef.current = customer;
    },[customer]);

    useEffect(() => {
        if (!customer?.orderId || Object.keys(orderedItems).length === 0) return; // wait for both customer and orderedItems
        customerRef.current = customer;
        fetchComments();
    }, [customer, orderedItems, fetchComments]);

    const handleSaveComment = useCallback((itemId, comment, quantity) => {
        if (!debounceRef.current[itemId]) {
            debounceRef.current[itemId] = debounce(saveCommentToDatabase, 700);
        }
        debounceRef.current[itemId](itemId, comment, quantity);
    }, [saveCommentToDatabase]);

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
                            <TextField
                                id="filled-multiline-flexible"
                                label="Comment"
                                helperText={`${charLeft[item.itemId]?? 100}`+" characters left"}
                                multiline
                                value={comment[item.itemId] || ''}
                                maxRows={4}
                                variant="filled"
                                inputProps={{maxLength:100}}
                                 sx={{
                                    input: { color: 'white' },
                                    textarea: { color: 'white' }, 
                                    label: { color: 'white' }, 
                                }}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setComment(prev => ({...prev, [item.itemId]: value})); 
                                    setCharLeft(prev => ({...prev, [item.itemId]: 100 - value.length}));
                                    handleSaveComment(item.itemId, value, item.quantity)
                                }}
                                
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                                <IconButton
                                    onClick={() => {
                                            decreaseItemQuantity(item.itemId)
                                        }
                                    }
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
    setCart: PropTypes.func.isRequired,
    charLeft: PropTypes.object.isRequired,
    setCharLeft: PropTypes.func.isRequired,
    comment: PropTypes.object,
    setComment: PropTypes.func,
}

export default ItemsInCart;
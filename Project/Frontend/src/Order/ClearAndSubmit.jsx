import PropTypes from 'prop-types';
import { Grid, Button, Box } from '@mui/material';
function ClearAndSubmit({clearCart, setCart, handleSubmit, customer, cart}){
  return(
    <>
            <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button
                            onClick={() => clearCart(customer, cart).then(setCart)}
                            sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
                            fullWidth
                        >
                            Clear Cart
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            sx={{ backgroundColor: '#5762d5', color: 'white', '&:hover': { backgroundColor: '#4751b3' } }}
                            fullWidth
                        >
                            Submit Order
                        </Button>
                    </Grid>
                </Grid>
            </Box>
    </>
  );
}


ClearAndSubmit.propTypes={
  clearCart: PropTypes.func.isRequired,
  setCart: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  customer: PropTypes.object.isRequired,
  cart: PropTypes.array.isRequired
}

export default ClearAndSubmit;
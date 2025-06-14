import { Button, Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';

function OrderButtons({tableNum, customer, alertOthers, hasCreatedOrder, setNewOrderModalOpen, setNewTableNum, setTableEditModalOpen}) {
  return(
    <>
            {/* Call assistance button to alert others */}
            <Button
                onClick={() => alertOthers(tableNum, customer.orderId)}
                variant="contained"
                sx={{ backgroundColor: '#5762d5', color: 'white', '&:hover': { backgroundColor: '#4751b3' }, display: 'block', marginLeft: 'auto', marginTop: 2 }}
            >
                Call Assistance
            </Button>
            
            {/* Section for displaying the tagble number and option to change it */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
                <Typography variant="h4">Place Your Order</Typography>
                {!hasCreatedOrder && (
                    <Button
                        onClick={() => setNewOrderModalOpen(true)}
                        variant="contained"
                        sx={{ backgroundColor: '#5762d5', color: 'white', '&:hover': { backgroundColor: '#4751b3' } }}
                    >
                        New Order
                    </Button>
                )}
            </Box>
            
            {/* Display current table number with option to edit */}
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '15px', gap: 2 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                    Your Table Number: {tableNum || 'Not set'}
                </Typography>
                <Button
                    onClick={() => {
                        setNewTableNum(tableNum?.toString() || '');
                        setTableEditModalOpen(true);
                    }}
                    sx={{ 
                        backgroundColor: '#333',
                        color: 'white',
                        '&:hover': { 
                            backgroundColor: 'darkgray' 
                        }
                    }}
                >
                    CHANGE
                </Button>
            </Box>
      </>
  );
}

OrderButtons.propTypes = {
    tableNum: PropTypes.string.isRequired, 
    customer: PropTypes.object.isRequired,  
    alertOthers: PropTypes.func.isRequired, 
    hasCreatedOrder: PropTypes.func.isRequired,
    setNewOrderModalOpen: PropTypes.func.isRequired,
    setNewTableNum: PropTypes.func.isRequired,
    setTableEditModalOpen: PropTypes.func.isRequired
}

export default OrderButtons;
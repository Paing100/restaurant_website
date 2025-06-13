import MenuCard from '../MenuCard';
import { Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';

function WaiterSuggestions({ suggestions, customer, orderedItems }) {

  return(
    <> 
            {suggestions && suggestions.length > 0 && customer?.orderId > 0 && Object.keys(orderedItems).length > 0 && (
                <Box sx={{
                    mb: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <Typography variant="h5" sx={{
                        padding: '15px',
                        borderBottom: '1px solid #333',
                        textAlign: 'center',
                        width: '100%'
                    }}>
                        Waiter&apos;s Suggestions
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            overflowX: 'auto',
                            pt: 2,
                            pb: 2,
                            width: '100%',
                            justifyContent: 'center',
                            '&::-webkit-scrollbar': {
                                height: 8,
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: '#333',
                                borderRadius: 4,
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#5762d5',
                                borderRadius: 4,
                            },
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            px: 2,
                            maxWidth: '1400px',
                            margin: '0 auto'
                        }}>
                            {suggestions.map((item) => (
                                <Box key={item.itemId} sx={{ minWidth: 260, maxWidth: 260, flexShrink: 0 }}>
                                    <MenuCard item={item} isWaiterView={false} />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            )}
    </>
  );
}

WaiterSuggestions.propTypes = {
    suggestions: PropTypes.array.isRequired,
    customer: PropTypes.object.isRequired,
    orderedItems: PropTypes.object.isRequired,
}

export default WaiterSuggestions;
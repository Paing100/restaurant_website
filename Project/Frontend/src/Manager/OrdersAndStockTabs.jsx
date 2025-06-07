import  { Tabs, Tab } from '@mui/material';
import PropTypes from 'prop-types';
function OrdersAndStockTabs({tabIndex, setTabIndex}) {
  return (
    <Tabs
        value={tabIndex}
        onChange={(event, newValue) => setTabIndex(newValue)}
        variant="fullWidth"
        TabIndicatorProps={{ style: { backgroundColor: '#5762d5' } }}
        sx={{
          paddingTop: 2,
          paddingBottom: 2,
          "& .MuiTab-root": {
            color: "darkgray",
            fontWeight: "bold",
          },
          "& .Mui-selected": {
            color: "#5762d5",
            textDecoration: "none",
          },
          "& .MuiTab-root:hover": {
            backgroundColor: "transparent",
          },
          "& .MuiTab-root:focus": {
            backgroundColor: "transparent",
          },
        }}
      >
        <Tab label="Outstanding Orders" />
        <Tab label="Stock Status" />
      </Tabs>
  );
}

OrdersAndStockTabs.propTypes = {
  tabIndex: PropTypes.number.isRequired, 
  setTabIndex: PropTypes.func.isRequired
}

export default OrdersAndStockTabs;
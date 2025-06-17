import { useState, useEffect } from "react";
import { Grid, Box, Tabs, Tab, Typography } from "@mui/material";
import MenuCard from './MenuCard.jsx'
import Filter from './Filter.jsx'
import PropTypes from 'prop-types';
import axios from 'axios';

function Menu({ isWaiterView }) {
  // State variables 
  const [selectedTab, setSelectedTab] = useState(0); // trackes currently selected tab 
  const [menuItems, setMenuItems] = useState([]); // stores the list of menu items 
  const [selectedFilter, setSelectedFilter] = useState([]); // stores the selected fitlers 

  // fetch all menu itmes when component loads 
  useEffect(() => {
    axios.get('http://localhost:8080/MenuItems')
      .then(response => response.data)
      .then(data => {
        setMenuItems(data); 
      })
      .catch(err => console.error(err));
  }, []);

  // categories for the menu tabs 
  const categories = ["Appetizers", "Mains", "Desserts", "Drinks"];

  // handle tab change (category selection)
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue); // update the selected tab 
  };

  // handle filter changes (dietary and allergens)
  const handleFilterChange = (event) => {
    const { dietaryRestrictions, allergens } = event.target.value;
    setSelectedFilter(dietaryRestrictions); // update the selected dietary restrctions 

    axios.post('http://localhost:8080/Menu/filter', {
        dietaryRestrictions: dietaryRestrictions.join(','),
        allergens: allergens.join(',')
    })
      .then(response => response.data)
      .then(data => {
        if (!Array.isArray(data)) {
          console.error("Unexpected API response structure:", data);
          setMenuItems([]); // clear menu item if response is invalid 
          return;
        }

        setMenuItems(data);
      })
      .catch(err => {
        console.error('Error fetching filtered menu:', err);
        setMenuItems([]); // clear menu item if response is invalid 
      });
  };

  return (
    <>
      <Box sx={{ padding: 3 }}>
        {/* Display the filter component if not in waiter view */}
        {!isWaiterView && (
          <Filter
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
          />
        )}

        {/* Tabs for menu categories */}
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          centered
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: '#5762d5' } }}
          sx={{
            '& .MuiTab-root': {
              color: 'white',
            },
            '& .Mui-selected': {
              color: '#5762d5',
            },
            "& .MuiTab-root:focus": {
              backgroundColor: "transparent",
            },
          }}
        >
          {/* Render a tab for each category */}
          {categories.map((category, index) => (
            <Tab key={index} label={category} />
          ))}
        </Tabs>

        {/* Display menu items or loading/error messages */}
        {menuItems === null ? (
          <Typography>Loading ...</Typography> // show loading while fetching data
        ) : menuItems.length === 0 ? (
          <Typography>No matching items found.</Typography> // show not found if no items match the filters
        ) : (
          <Grid container spacing={3} sx={{ marginTop: 2 }}>
            {/* Filter and display menu items based on the selected category */}
            {menuItems.filter((item) => item.category === selectedTab)
              .map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <MenuCard item={item} isWaiterView={isWaiterView}></MenuCard> {/* Render a MenuCard for each item */}
                </Grid>
              ))}
          </Grid>
        )}
      </Box>
    </>
  );
}

// PropTypes validation
Menu.propTypes = {
  isWaiterView: PropTypes.bool.isRequired
};

export default Menu;

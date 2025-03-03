/* eslint-disable */
import { useState, useEffect } from "react";
import { Grid, Box, Tabs, Tab, Typography } from "@mui/material";
import MenuCard from './MenuCard.jsx'
import Filter from './Filter.jsx'

function Menu({ isWaiterView }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/MenuItems')
      .then(response => response.json())
      .then(data => {
        setMenuItems(data);
      })
      .catch(err => console.error(err));
  }, []);

  const categories = ["Appetizers", "Mains", "Desserts", "Drinks"];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const handleFilterChange = (event) => {
    const { dietaryRestrictions, allergens } = event.target.value;
    setSelectedFilter(dietaryRestrictions);

    fetch('http://localhost:8080/Menu/filter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dietary_restrictions: dietaryRestrictions.join(','),
        allergens: allergens.join(',')
      })
    })
      .then(response => response.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.error("Unexpected API response structure:", data);
          setMenuItems([]);
          return;
        }

        setMenuItems(data);
      })
      .catch(err => {
        console.error('Error fetching filtered menu:', err);
        setMenuItems([]);
      });
  };


  return (
    <>
      <Box sx={{ padding: 3 }}>
        {!isWaiterView && (
          <Filter
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
          />
        )}
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
          }}
        >
          {categories.map((category, index) => (
            <Tab key={index} label={category} />
          ))}
        </Tabs>
        {menuItems === null ? (
          <Typography>Loading ...</Typography>
        ) : menuItems.length === 0 ? (
          <Typography>No matching items found.</Typography>
        ) : (
          <Grid container spacing={3} sx={{ marginTop: 2 }}>
            {menuItems.filter((item) => item.category === selectedTab)
              .map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <MenuCard item={item} isWaiterView={isWaiterView}></MenuCard>
                </Grid>
              ))}
          </Grid>
        )}
      </Box>
    </>
  );
}

export default Menu;

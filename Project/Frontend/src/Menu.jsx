import { useState, useEffect } from "react";
import { Grid, Box, Tabs, Tab, Typography } from "@mui/material";
import MenuCard from './MenuCard.jsx'
import Filter from './Filter.jsx'

function Menu() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState([]);

  useEffect(() => {
    fetch('http://localhost:2810/items')
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
    setSelectedFilter(event.target.value);
    console.log('Selected Filters:', event.target.value);
  };

  return (
    <>
      <Box sx={{ padding: 3 }}>
        <Filter
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
        />
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          {categories.map((category, index) => (
            <Tab key={index} label={category} />
          ))}
        </Tabs>
        {menuItems.length === 0 ? (
          <Typography>
            Loading ...
          </Typography>
        ) : (
          <Grid container spacing={3} sx={{ marginTop: 2 }}>
            {menuItems.filter((item) => item.category === selectedTab)
              .map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <MenuCard item={item}></MenuCard>
                </Grid>
              ))}
          </Grid>
        )}
      </Box>
    </>
  );
}

export default Menu;
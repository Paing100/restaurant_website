import React, { useState, useEffect } from "react";
import guacamoleImg from './assets/guacamole.jpg'
import churroImg from './assets/churro.jpg'
import cocktailImg from './assets/cocktail.jpg'
import tacoImg from './assets/taco.jpg'
import { Grid, Card, CardActionArea, CardContent, Typography, CardMedia, Box, Tabs, Tab, Button, Grid2} from "@mui/material";
import MenuCard from './MenuCard.jsx'
import Filter from './Filter.jsx'


function Menu() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [menuItems, setMenuItems] = useState([]);

  useEffect( () => {
    fetch('http://localhost:2810/items')
      .then(response => {
        return response.json();
      })
      .then((data) => {
        setMenuItems(data);
      })
  , []}

  )

  const categories = ["Appetizers", "Mains", "Desserts", "Drinks"];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <>
    <Box sx={{ padding: 3 }}>
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
  {menuItems.length === 0? (
    <Typography>
      Loading ... 
    </Typography>
  ): (
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

import React, { useState } from "react";
import guacamoleImg from './assets/guacamole.jpg'
import churroImg from './assets/churro.jpg'
import cocktailImg from './assets/cocktail.jpg'
import tacoImg from './assets/taco.jpg'
import { Grid, Card, CardActionArea, CardContent, Typography, CardMedia, Box, Tabs, Tab, Button,} from "@mui/material";

function Menu() {
  const [selectedTab, setSelectedTab] = useState(0);

  const categories = ["Appetizers", "Mains", "Desserts", "Drinks"];
  const menuItems = [
    {
      name: "Guacamole",
      description: "Classic Mexican dip made with avocados, cilantro, and lime.",
      price: "£5.99",
      img: guacamoleImg,
      calories: 150,
      allergies: ["Avocado", "Tomato"],
      category: 0,
    },
    {
      name: "Tacos",
      description: "Fresh tacos with your choice of meat or veggies.",
      price: "£8.99",
      img: tacoImg,
      calories: 300,
      allergies: ["Wheat", "Dairy"],
      category: 1,
    },
    {
      name: "Churros",
      description: "Sweet fried dough with a cinnamon-sugar coating.",
      price: "£4.99",
      img: churroImg,
      calories: 200,
      allergies: ["Wheat", "Egg"],
      category: 2,
    },
    {
      name: "Margarita",
      description: "Refreshing lime cocktail with a hint of salt.",
      price: "£6.99",
      img: cocktailImg,
      calories: 250,
      allergies: ["Citrus"],
      category: 3,
    },
  ];  

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
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
      <Grid container spacing={3} sx={{ marginTop: 2 }}>
  {menuItems
    .filter((item) => item.category === selectedTab)
    .map((item, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.img} 
                    alt={item.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.description}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
                      Price: {item.price}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Calories: {item.calories} kcal
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Allergies: {item.allergies.join(", ")}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}

export default Menu;

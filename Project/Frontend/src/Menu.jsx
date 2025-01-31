
import {Card, CardActionArea, Typography, CardContent} from "@mui/material";
import {useState} from "react";

function Menu() {
  return (
    <>
      <Card sx={{margin: 2}}>
        <CardActionArea height="140">
          <CardContent>
            <Typography>
              Sample Item
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}

export default Menu;
import React from "react";
import { useState, useEffect } from "react";
import { Grid, Box, Tabs, Tab, Typography } from "@mui/material";
import Menu from './Menu.jsx'

function MenuWaiter(){

  return (
    <Menu isWaiterView={true}></Menu>  
  );
}

export default MenuWaiter; 
import { Typography, Box } from "@mui/material";

function KitchenStaff() {
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  return (
    <Box>
      <Typography variant="h3">Welcome {userName}!</Typography>
      <Typography variant="h4">{userRole} Dashboard</Typography>
    </Box>
  );
}

export default KitchenStaff;

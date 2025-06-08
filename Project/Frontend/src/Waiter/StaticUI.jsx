import { Link } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import NotificationDrawer from "../NotificationDrawer";
import PropTypes from "prop-types";

function StaticUI({ userName, alerts, tables, selectedTab, handleTabChange, categories }) {
  return (
    <>
      <Typography variant="h3" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Welcome, {userName}!
      </Typography>

      {/* Notification drawer */}
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <NotificationDrawer notifications={alerts} />
      </Box>

      {/* Assigned tables */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          marginBottom: 3,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Your Assigned Tables:
        </Typography>
        <Typography variant="body1">
          {Array.from(
            new Set([...(tables.defaultTables || []), ...(tables.activeTables || [])])
          )
            .sort((a, b) => a - b)
            .join(", ")}
        </Typography>
      </Box>

      <Link to="/waiter_menu" style={{ textDecoration: "none" }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#5762d5",
            color: "white",
            "&:hover": { backgroundColor: "#4751b3" },
            marginBottom: 3,
          }}
        >
          Edit Menu
        </Button>
      </Link>

      {/* Tabs for order categories */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        centered
        textColor="inherit"
        TabIndicatorProps={{ style: { backgroundColor: "#5762d5" } }}
        sx={{
          "& .MuiTab-root": {
            color: "white",
          },
          "& .Mui-selected": {
            color: "#5762d5",
          },
        }}
      >
        {categories.map((category, index) => (
          <Tab key={index} label={category} />
        ))}
      </Tabs>
    
    </>
  );
}

StaticUI.propTypes = {
  userName: PropTypes.string.isRequired,
  alerts: PropTypes.array.isRequired,
  tables: PropTypes.object.isRequired,
  selectedTab: PropTypes.number.isRequired,
  handleTabChange: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
};

export default StaticUI; 
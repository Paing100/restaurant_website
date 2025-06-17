import { useState, useEffect } from "react";
import { Typography, Box, Card, CardContent } from "@mui/material";
import BackButton from "./BackButton";
import axios from 'axios';

function EmployeeData() {
  // state variable to store employee data fetched from server 
  const [employeeData, setEmployeeData] = useState([]);

  // function to fetch employee data 
  const fetchEmployeeData = async () => {
    try{
      const {data: data} = await axios.get("http://localhost:8080/Manager/getAllEmployeeData");
      // parse and set the fetched employee data 
      setEmployeeData(data);
      console.log("Data fetched successfully " + data);
    }
    catch(e) {
      console.log("Cannot fetch employee's data. Something went wrong!" + e);
    }
  };

  // useEffect to fetch employee data when the component is loaded 
  useEffect(() => {
    fetchEmployeeData();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>    
      {/* Back button */}
      <BackButton />
      
      {/* Page title */}
      <Typography variant="h3" sx={{ fontWeight: "bold", mt:10, marginBottom: 3 }}>
        Employee Data
      </Typography>

      {/* Display employee data if available */}
      {employeeData.length > 0 ? (
        employeeData.map((employee) => (
          <Card
            key={employee.employeeId} 
            sx={{
              marginBottom: 2,
              backgroundColor: "#211f1f",
              color: "white",
              borderRadius: 2,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent>
              {/* Employee name */}
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {employee.firstName} {employee.lastName}
              </Typography>

              {/* Employee ID */}
              <Typography variant="body1" sx={{ marginTop: 1 }}>
                Employee ID: {employee.employeeId}
              </Typography>

              {/* Employee role */}
              <Typography variant="body1">Role: {employee.role}</Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1" sx={{ color: "gray" }}>
          No employee data available.
        </Typography>
      )}
    </Box>
  );
}

export default EmployeeData;
import { useState, useEffect } from "react";
import { Typography, Box, Card, CardContent } from "@mui/material";

function EmployeeData() {
  // state variable to store employee data fetched from server 
  const [employeeData, setEmployeeData] = useState([]);

  // function to fetch employee data 
  const fetchEmployeeData = async () => {
    const response = await fetch("http://localhost:8080/Manager/getAllEmployeeData", {
      method: "GET",
    });
    if (!response.ok) {
      // error message in console log 
      console.log("Something went wrong " + response.statusText);
    } else {
      // parse and set the fetched employee data 
      const data = await response.json();
      setEmployeeData(data);
      console.log("Data fetched successfully " + data);
    }
  };

  // useEffect to fetch employee data when the component is loaded 
  useEffect(() => {
    fetchEmployeeData();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      {/* Page title */}
      <Typography variant="h3" sx={{ fontWeight: "bold", marginBottom: 3 }}>
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
import { useState, useEffect } from "react";
import { Typography, Box, Card, CardContent } from "@mui/material";

function EmployeeData() {
  const [employeeData, setEmployeeData] = useState([]);

  const fetchEmployeeData = async () => {
    const response = await fetch("http://localhost:8080/Manager/getAllEmployeeData", {
      method: "GET",
    });
    if (!response.ok) {
      console.log("Something went wrong " + response.statusText);
    } else {
      const data = await response.json();
      setEmployeeData(data);
      console.log("Data fetched successfully " + data);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", marginBottom: 3 }}>
        Employee Data
      </Typography>
      <Typography variant="h5" sx={{ marginBottom: 3 }}>
        Total Sales: £{localStorage.getItem("sales")}
      </Typography>
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
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {employee.firstName} {employee.lastName}
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 1 }}>
                Employee ID: {employee.employeeId}
              </Typography>
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
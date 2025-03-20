import { useState, useEffect } from "react";
import { Typography, Box} from "@mui/material";

function EmployeeData() {

  const [employeeData, setEmployeeData] = useState([]);

  const fetchEmployeeData = async () => {
    const response = await fetch("http://localhost:8080/Manager/getAllEmployeeData", {
      method: "GET",
    });
    if (!response.ok){
      console.log("Something went wrong " + response.statusText)
    }
    else{
      const data = await response.json();
      setEmployeeData(data);
      console.log("Data fetched successfully " + data);
    }
  }

  useEffect(() => {
    fetchEmployeeData();  
  }, [])

  return (
    <>
      <Typography variant="h3">Employee Data</Typography>
      <Typography variant="h5">Total Sales: {
        localStorage.getItem('sales')
      }</Typography>
      {
        employeeData.map((employee) => {
          return(
            <Box key={employee.employeeId} sx={{ padding: 2, border: "1px solid black", borderRadius: 1, marginBottom: 2 }}>
              <Typography variant="h5">{employee.firstName}</Typography>
              <Typography>{employee.lastName}</Typography>
              <Typography>{"Employee Id: " + employee.employeeId}</Typography>
              <Typography>Role: {employee.role}</Typography>
            </Box>
          );
        })
      
      }

    </>
  );
}

export default EmployeeData;
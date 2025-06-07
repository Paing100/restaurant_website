import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import PropTypes from 'prop-types';

function StockStatusTable({stock}) {
  return (
    <Box sx={{ marginTop: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                Stock Status:
              </Typography>
              {stock ? (
                <TableContainer component={Paper}>
                  <Table
                    sx={{
                      minWidth: 650,
                      backgroundColor: "#242424",
                      color: "white",
                    }}
                    aria-label="stock status table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Item</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stock.split("\n").map((line, index) => {
                        const [item, quantity] = line.split(":");
                        return (
                          <TableRow key={index}>
                            <TableCell sx={{ color: "white" }}>{item}</TableCell>
                            <TableCell sx={{ color: "white" }}>{quantity}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No stock data available.</Typography>
              )}
            </Box>
  )
}

StockStatusTable.propTypes = {
  stock: PropTypes.string.isRequired,
}

export default StockStatusTable;
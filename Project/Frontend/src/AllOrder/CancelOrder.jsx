import NewOrderModal from "../NewOrderModal";
import {Button} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const CancelOrder = ({orderId, fetchOrders}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, orderId.orderId]); 

  const handleCancelOrder = async() => {
    const status = await axios.get(`http://localhost:8080/api/orders/${orderId}/getOrderStatus`);
    if (status.data === "SUBMITTED") {
      console.log("CANCELLED: " + JSON.stringify(status));
      await axios.post(`http://localhost:8080/api/order/${orderId}/updateOrderStatus`, 
        {orderStatus: "CANCELLED"}
      );
    }   
    else{
      console.log("Can't be deleted");
    }
  }

  return (
    <>
      <Button variant="contained" 
        onClick={() => setOpen(true)}
      >
        CANCEL ORDER
      </Button>

      { open && (
        <NewOrderModal 
          open={open}
          onClose={() => {setOpen(false)}}
          onConfirm={() => {
              setOpen(false); 
              handleCancelOrder()
            }
          }
          title="Cancel Order"
          content="Are you sure you want to cancel this order?"
          confirmButtonText="Yes, Cancel"
          cancelButtonText="No, Keep Order"
        /> )
    } 
    </>
  );
}

CancelOrder.propTypes={
  orderId: PropTypes.string.isRequired,
  fetchOrders: PropTypes.func.isRequired
}

export default CancelOrder; 
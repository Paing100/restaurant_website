import * as React from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from "prop-types";
import alertSound from './assets/sound/alertNoti.mp3';
import { useWithSound } from './useWithSound';

import {
  styled,
  Box,
  Paper,
  Stack,
  Drawer,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
} from '@mui/material';
import { useEffect, useState, useRef } from "react";

import {
  AddAlert as AddAlertIcon
} from '@mui/icons-material';

// Styled component for notification items
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

function NotificationDrawer({ notifications = [] }) {

  const [alertStack, setalertStack] = useState(notifications);
  const ws = useRef(null);
  const { playSound } = useWithSound(alertSound); // Function to play alert sound
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

// Function to play an alert sound when a new notification arrives
  const handleAlertSound = () => {
    playSound();
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Function to remove a notification
  const removeAlert = async (index) => {
    const notiId = alertStack[index]?.notifId;
    const response = await fetch(`http://localhost:8080/api/notification/${notiId}/removeMessages`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setalertStack(alertStack.filter((_, i) => i !== index)); // Remove the alert from the UI

      // send WebSocket message to all waiters, remove the alert
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const messageDel = { notification_id: notiId, type: "REMOVE_ALERT", };
        try {
          const sendAlert = await fetch('http://localhost:8080/api/notification/send', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(messageDel),
          });

          if (!sendAlert.ok) {
            throw new Error("Failed to send an alert");
          }
        } catch (error) {
          console.error("Error from alert: " + error);
        }
      }
    }
  };
  // Fetch notifications and setup WebSocket connection
  useEffect(() => {
     // Fetch existing notifications from the server
    const getAlerts = async () => {
      const response = await fetch("http://localhost:8080/api/notification/getMessages", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setalertStack(data); // Update notifications in state
      }
    }
    getAlerts();
     // Setup WebSocket connection if not already established
    if (!ws.current) {
      ws.current = new WebSocket("ws://localhost:8080/ws/notifications")

      ws.current.onopen = () => {
        console.log('WebSocket connected', ws.current.readyState);
      };

      ws.current.onclose = () => {
        console.log("Websocket session is closed");
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          // Handle new alert notification
          if (message.type === "ALERT") {
            setalertStack((prevStack) => [...prevStack, message]);
            getAlerts();
            handleAlertSound();
            setSnackbarMessage(message.message);
            setSnackbarOpen(true);
          }
          // handle REMOVE_ALERT message
          if (message.type === "REMOVE_ALERT") {
            setalertStack((prevStack) => prevStack.filter(alert => alert.notification_id !== message.notification_id));
            getAlerts();
          }
        } catch (error) {
          console.log(error);
        }
      };
    }
    // Log WebSocket state
    if (ws.current) {
      getAlerts();
    }
  }, []);
  // State to manage drawer open/close
  const [state, setState] = React.useState({
    right: false,
  });

  // Function to toggle the drawer open/close
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

   // Function to render the notification list inside the drawer
  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
    >
      <List>
        {['Notifications'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
        {
          alertStack.length > 0 ? (
            alertStack.map((noti, index) => (
              <Box sx={{ width: '100%' }} key={index}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Item sx={{ flexGrow: 1 }}>
                    <ListItemText primary={noti.message} />
                  </Item>
                  <IconButton edge="end" onClick={() => removeAlert(index)}>
                    <CloseIcon />
                  </IconButton>
                </Stack>
              </Box>
            ))
          ) : (
            <Box sx={{ width: '100%' }}>
              <Stack>
                <Item>{"NO NEW NOTIFICATIONS!"}</Item>
              </Stack>
            </Box>
          )
        }

      </List>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer('right', true)}><AddAlertIcon /></Button>
      <Drawer
        anchor="right"
        open={state['right']}
        onClose={toggleDrawer('right', false)}
      >
        {list('right')}
      </Drawer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{
            width: '100%',
            backgroundColor: '#5762d5',
            color: 'white',
            borderRadius: '8px',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

NotificationDrawer.propTypes = {
  notifications: PropTypes.array,
};

export default NotificationDrawer;

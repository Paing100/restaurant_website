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
} from '@mui/material';
import { useEffect, useState, useRef } from "react";

import { 
  AddAlert as AddAlertIcon 
} from '@mui/icons-material';

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

function NotificationDrawer({ notifications = []}) {

  const [alertStack, setalertStack] = useState(notifications);
  const ws = useRef(null);
  const { playSound } = useWithSound(alertSound);

  const handleAlertSound = () => {
    playSound();
  }

  const removeAlert = async (index) => {
    const notiId = alertStack[index]?.notifId;
    console.log("Removing notification with id: " + notiId);
    const response = await fetch(`http://localhost:8080/api/notification/${notiId}/removeMessages`,{
      method: "DELETE", 
      headers: {"Content-Type":"application/json"},
    });

    if (response.ok){
      console.log("Notification deleted successfully");
      setalertStack(alertStack.filter((_, i) => i !== index));

      // send WebSocket message to all waiters, remove the alert
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const messageDel = { notification_id: notiId, type: "REMOVE_ALERT", };
        console.log("Delete message: " + JSON.stringify(messageDel));
        try {
          const sendAlert = await fetch('http://localhost:8080/api/notification/send', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(messageDel),
          });
    
          if (!sendAlert.ok) {
            throw new Error("Failed to send an alert");
          }
          console.log("Alert sent via server");
        } catch (error) {
          console.error("Error from alert: " + error);
        }
        console.log("Del message sent " + JSON.stringify(messageDel));
      }
    }
  };

    useEffect(() => {
      console.log("USE EFFECT RAN!");
      const getAlerts = async () => {
        const response = await fetch("http://localhost:8080/api/notification/getMessages", {
          method: "GET",
          headers: {"Content-Type":"application/json"},
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Data fetched: " + JSON.stringify(data));
          setalertStack(data);
        }
        console.log("Alerts fetched successfully");
        console.log("Alerts: " + JSON.stringify(alertStack));
      }
      getAlerts();
      if (!ws.current) {
        ws.current = new WebSocket("ws://localhost:8080/ws/notifications")
  
          ws.current.onopen = () => {
              console.log('WebSocket connected', ws.current.readyState);
          };
  
          ws.current.onclose = () => {
              console.log("Websocket session is closed");
          };
  
          ws.current.onmessage = (event) => {
              console.log("Event IN NOTIFICATION" + event.data);
              try {
                const message = JSON.parse(event.data);
                console.log("WebSocket message received: ", message); 
                if (message.type === "ALERT"){
                  setalertStack((prevStack) => [...prevStack, message]);
                  getAlerts();
                  handleAlertSound();
                }
                // handle REMOVE_ALERT message
                if (message.type === "REMOVE_ALERT") {
                  setalertStack((prevStack) => prevStack.filter(alert => alert.notification_id !== message.notification_id));
                  console.log("Alert removed via WebSocket: " + message.notifId);
                  getAlerts();
                }
              } catch (error) {
                  console.log(error);
              }
          };
      }
      if (ws.current) {
          console.log("WebSocket readyState after creation:", ws.current.readyState); // Logs current WebSocket state after instantiation
          getAlerts();  
      }
  }, []);
 
  const [state, setState] = React.useState({
    right: false,
  });


  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };


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
          ): (
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
    </div>
  );
}

NotificationDrawer.propTypes = {
  notifications: PropTypes.array,
};

export default NotificationDrawer;

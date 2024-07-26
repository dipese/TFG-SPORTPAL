/* eslint-disable react/prop-types */
import React from 'react';
import { Popup } from 'react-leaflet';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

const EventPopup = ({ event }) => {
  return (
    <Popup>
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {event.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {event.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Fecha: {new Date(event.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lugar: {event.location.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Más Información</Button>
        </CardActions>
      </Card>
    </Popup>
  );
};

export default EventPopup;
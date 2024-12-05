import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Card,
  CardContent,
} from '@mui/material';

function PopupCard({ data, open, onClose }) {
  console.log("form ppop", data)
  return (
    <Dialog open={open} onClose={onClose}>
      <Card>
        <DialogTitle>{data?.error ? "Error" : "Response"}</DialogTitle>
        <DialogContent>
          <CardContent>
            {data?.error ? (
              <Typography color="error" variant="body1">
                {data.error}
              </Typography>
            ) : (
              <Typography variant="body1">
                {data ? JSON.stringify(data) : "No response data"}
              </Typography>
            )}
          </CardContent>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Card>
    </Dialog>
  );
}

export default PopupCard;

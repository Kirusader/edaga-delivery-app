/** @format */

import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  Checkbox,
  CircularProgress,
} from "@mui/material";

import React, { useState } from "react";

const RiderToCompany = ({ order, handleCollect, calculateRouteToCustomer }) => {
  const [showItems, setShowItems] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleToggleItems = () => {
    setShowItems(!showItems);
  };

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };
  if (!order) {
    return (
      <Typography>No order selected or order data is unavailable.</Typography>
    );
  }
  return (
    <Grid
      container
      direction="column"
      alignItems={"center"}
      sx={{ width: "90%", mx: "auto" }}>
      <Grid item></Grid>
      <Grid item>
        <Typography variant="h2">#{order.orderId}</Typography>
      </Grid>
      <Grid item>
        <Grid container spacing={2}>
          <Grid item>
            <Checkbox
              checked={checked}
              onChange={handleCheckboxChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleToggleItems}>
              View Order Items
            </Button>
          </Grid>
        </Grid>
        {showItems && (
          <List>
            {order.items.map((item, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${item.quantity} * ${item.description}`}
                />
              </ListItem>
            ))}
          </List>
        )}
        <Button
          variant="contained"
          color="success"
          disabled={!checked}
          onClick={() => {
            handleCollect(order.id);

            calculateRouteToCustomer();
          }}>
          Collect Order
        </Button>
      </Grid>
    </Grid>
  );
};

export default RiderToCompany;

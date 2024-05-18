/** @format */

import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  Checkbox,
} from "@mui/material";

import React, { useState } from "react";

const RiderToCompany = ({ order, handleCollect }) => {
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
    <Grid container direction="column" sx={{ width: "70%", mx: "auto" }}>
      <Grid item sx={{ alignSelf: "center" }}>
        <Typography variant="h6">Collect Order</Typography>
      </Grid>
      <Grid
        item
        sx={{ border: "2px solid #A0DEFF", padding: 2, m: 4, borderRadius: 6 }}>
        <Grid item container direction={"column"}>
          <Grid item>
            <Typography variant="h6">Company Location</Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="subtitle2"
              sx={{ fontSize: "0.8rem", paddingLeft: 2 }}>
              112 Greame Street,M14 4RN, Manchester, UK
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="subtitle2"
              sx={{ fontSize: "0.8rem", paddingLeft: 2 }}>
              £5.43 total order fee
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        item
        direction={"column"}
        alignItems={"center"}
        spacing={2}
        sx={{ border: "2px solid #A0DEFF", padding: 2, m: 4, borderRadius: 6 }}>
        <Grid container item spacing={14} alignItems="center">
          <Grid item>
            <Typography variant="h2">Order #{order.orderId}</Typography>
          </Grid>
          <Grid item>
            <Checkbox
              checked={checked}
              onChange={handleCheckboxChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Grid>
        </Grid>
        <Grid item container direction="column" spacing={2}>
          <Grid item>
            <Button variant="contained" onClick={handleToggleItems}>
              View Order Items
            </Button>
          </Grid>
          <Grid item>
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
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="success"
              disabled={!checked}
              onClick={() => handleCollect(order.id)}>
              {checked ? "Collect Order" : "Tick To Continue"}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RiderToCompany;

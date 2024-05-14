/** @format */

import { useState } from "react";

import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  Checkbox,
} from "@mui/material";

const RiderToCustomer = ({ order, handleDeliver }) => {
  const [showItems, setShowItems] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleToggleItems = () => {
    setShowItems(!showItems);
  };

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };
  if (!order) {
    return <Typography>You have no active order at the moment.</Typography>;
  }
  return (
    <Grid container direction="column">
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
            handleDeliver(order.id);
          }}>
          Deliver to Customer
        </Button>
      </Grid>
    </Grid>
  );
};

export default RiderToCustomer;

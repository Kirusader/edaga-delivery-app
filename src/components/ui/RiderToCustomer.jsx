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
import PhoneIcon from "@mui/icons-material/Phone";
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
    <Grid container direction="column" sx={{ width: "70%", mx: "auto" }}>
      <Grid item sx={{ alignSelf: "center" }}>
        <Typography variant="h6">Deliver Order</Typography>
      </Grid>
      <Grid
        item
        sx={{ border: "2px solid #A0DEFF", padding: 2, m: 4, borderRadius: 6 }}>
        <Grid item container direction={"column"}>
          <Grid item>
            <Typography variant="h6">Customer Address</Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="subtitle2"
              sx={{ fontSize: "0.8rem", paddingLeft: 2 }}>
              {`${order.street},${order.postalCode},${order.city},${order.country}`}
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: "0.8rem",
                display: "flex",
                alignItems: "center",
                paddingLeft: 2,
                my: 2,
              }}>
              <PhoneIcon sx={{ marginRight: 1 }} /> {order.phone}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle2" sx={{ paddingLeft: 2 }}>
              Note:{" "}
              <span style={{ fontSize: "0.8rem" }}>{order.orderNote}</span>
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
              onClick={() => {
                handleDeliver(order.id);
              }}>
              {checked ? "Deliver To Customer" : "Tick To Continue"}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RiderToCustomer;

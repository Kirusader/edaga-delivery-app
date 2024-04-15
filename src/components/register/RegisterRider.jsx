/** @format */

import React from "react";
import { Grid, Typography, TextField, MenuItem } from "@mui/material";
import RidersPhotoImg from "../../assets/ridersPhoto.png";

const RegisterRider = () => {
  return (
    <Grid
      container
      direction="column"
      sx={{ width: "70%", mx: "auto" }}
      justifyContent="center">
      <Grid item>
        <Grid item container direction={"column"} alignItems={"center"}>
          <Grid item>
            <img src={RidersPhotoImg} alt="riders photo" />
          </Grid>
          <Grid item sx={{ my: 2 }}>
            <Typography variant="h4">Tell us about yourself</Typography>
          </Grid>

          <Grid item>
            <Typography variant="subtitle2">
              Please ensure that the first and last name you use to apply
              matches exactly with the first and last name on your govt. issued
              ID
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sx={{ my: 2 }}>
        <Grid item container direction={"column"}>
          <Grid item>
            <Typography variant="subtitle2">First name</Typography>
          </Grid>
          <Grid item>
            <TextField
              sx={{ my: 2 }}
              fullWidth
              label="First name"
              variant="outlined"
              placeholder="Enter your first name"
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item sx={{ my: 2 }}>
        <Grid item container direction={"column"}>
          <Grid item>
            <Typography variant="subtitle2">Last name</Typography>
          </Grid>
          <Grid item>
            <TextField
              sx={{ my: 2 }}
              fullWidth
              label="last name"
              variant="outlined"
              placeholder="Enter your last name"
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item sx={{ my: 2 }}>
        <Grid item container direction={"column"}>
          <Grid item>
            <Typography variant="subtitle2">Email address</Typography>
          </Grid>
          <Grid item>
            <TextField
              sx={{ my: 2 }}
              fullWidth
              type="email"
              label="email address"
              variant="outlined"
              placeholder="Enter your email address"
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item sx={{ my: 2 }}>
        <Grid item container direction={"column"}>
          <Grid item>
            <Typography variant="subtitle2">Phone number</Typography>
          </Grid>
          <Grid item>
            <TextField
              sx={{ my: 2 }}
              fullWidth
              type="phone"
              label="phone number"
              variant="outlined"
              placeholder="Enter your phone number"
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item sx={{ my: 2 }}>
        <Grid item container direction={"column"}>
          <Grid item>
            <Typography variant="subtitle2">Vehicle type</Typography>
          </Grid>
          <Grid item>
            <TextField
              sx={{ my: 2 }}
              fullWidth
              select
              type="phone"
              label="vehicle type"
              variant="outlined"
              placeholder="Enter your phone number">
              <MenuItem value="cycle">Cycle</MenuItem>
              <MenuItem value="motorbike">Motor bike</MenuItem>
              <MenuItem value="car">Car</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RegisterRider;

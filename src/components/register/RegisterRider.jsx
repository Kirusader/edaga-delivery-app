/** @format */

import React, { useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  Snackbar,
} from "@mui/material";
const RidersPhotoImg =
  "https://res.cloudinary.com/drnarknab/image/upload/v1714834840/ridersPhoto_nmajvw.png";
import { db } from "../../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

const RegisterRider = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    vehicleType: "",
  });
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.vehicleType
    ) {
      setError("All fields are required and must be filled out correctly.");
      setOpenSnackbar(true);
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      setOpenSnackbar(true);
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must be 10 digits.");
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        await addDoc(collection(db, "riderregister"), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          vehicleType: formData.vehicleType,
        });
        setError("");
        setOpenSnackbar(true);
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          vehicleType: "",
        });
      } catch (error) {
        console.error("Error adding document: ", error);
        setError("Failed to submit application.");
        setOpenSnackbar(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const getSnackbarColor = () => {
    return error ? "#FF3232" : "#4CAF50"; // Red for error, Green for success
  };

  return (
    <Grid
      container
      direction="column"
      sx={{ width: { xs: "90%", md: "70%" }, mx: "auto" }}
      justifyContent="center">
      <Grid item>
        <Grid item container direction={"column"} alignItems={"center"}>
          <Grid item>
            <img
              src={RidersPhotoImg}
              alt="riders photo"
              style={{ width: "100%", maxWidth: "600px" }}
            />
          </Grid>
          <Grid item sx={{ my: 2 }}>
            <Typography variant="h4" align="center">
              Tell us about yourself
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="subtitle2" align="center">
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
              name="firstName"
              sx={{ my: 2 }}
              fullWidth
              label="First name"
              variant="outlined"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
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
              name="lastName"
              sx={{ my: 2 }}
              fullWidth
              label="Last name"
              variant="outlined"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
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
              name="email"
              sx={{ my: 2 }}
              fullWidth
              type="email"
              label="Email address"
              variant="outlined"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
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
              name="phone"
              sx={{ my: 2 }}
              fullWidth
              type="phone"
              label="Phone number"
              variant="outlined"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
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
              name="vehicleType"
              sx={{ my: 2 }}
              fullWidth
              select
              label="Vehicle Type"
              variant="outlined"
              value={formData.vehicleType}
              onChange={handleChange}>
              <MenuItem value="cycle">Cycle</MenuItem>
              <MenuItem value="motorbike">Motor bike</MenuItem>
              <MenuItem value="car">Car</MenuItem>
            </TextField>
          </Grid>
          <Grid item>
            <Button
              onClick={handleSubmit}
              sx={{
                width: "100%",
                borderRadius: 14,
                bgcolor: "#6DCFF6",
                marginBottom: 3,
                height: 60,
                py: 3,
                "&:hover": { bgcolor: "#6DCFF5" },
              }}>
              <Typography variant="h4">Submit Application</Typography>
            </Button>
            <Snackbar
              ContentProps={{
                style: { backgroundColor: getSnackbarColor() },
              }}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              message={error || "Application submitted successfully!"}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RegisterRider;

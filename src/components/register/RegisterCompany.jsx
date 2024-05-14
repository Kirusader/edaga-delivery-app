/** @format */

import {
  Grid,
  TextField,
  Typography,
  Autocomplete,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  MenuItem,
  Button,
  Snackbar,
} from "@mui/material";
import { useState } from "react";
import { db } from "../../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

const companyTypes = [
  { label: "Food" },
  { label: "Electrical & home appliance" },
  { label: "Bed & Bath" },
  { label: "Beverages" },
  { label: "Home care" },
  { label: "Personal care" },
  { label: "Stationary" },
];

export default function RegisterCompany() {
  const [ownerType, setOwnerType] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState("");
  const [useOtherDeliveryService, setUseOtherDeliveryService] = useState("");
  const [companyDetails, setCompanyDetails] = useState({
    address: "",
    companyName: "",
    companyType: null,
    fullName: "",
    role: "",
    email: "",
    phone: "",
    errors: {
      address: "",
      companyName: "",
      email: "",
      phone: "",
      deliveryInfo: "",
      useOtherDeliveryService: "",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails((prev) => ({
      ...prev,
      [name]: value,
      errors: { ...prev.errors, [name]: "" },
    }));
  };

  const handleAutocompleteChange = (event, newValue) => {
    setCompanyDetails((prevDetails) => ({
      ...prevDetails,
      companyType: newValue,
    }));
  };

  const validate = () => {
    let isValid = true;
    const errors = {};

    if (!companyDetails.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    }
    if (!companyDetails.companyName.trim()) {
      errors.companyName = "Company name is required";
      isValid = false;
    }
    if (!companyDetails.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(companyDetails.email)) {
      errors.email = "Email format is incorrect";
      isValid = false;
    }
    if (!companyDetails.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(companyDetails.phone)) {
      errors.phone = "Phone number must be 10 digits";
      isValid = false;
    }
    if (!deliveryInfo) {
      errors.deliveryInfo = "Please select a delivery option";
      isValid = false;
    }
    if (!useOtherDeliveryService) {
      errors.useOtherDeliveryService =
        "Please select an option about using other delivery services";
      isValid = false;
    }

    setCompanyDetails((prev) => ({ ...prev, errors }));
    return isValid;
  };
  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    if (name === "deliveryInfo") {
      setDeliveryInfo(value);
      setCompanyDetails((prev) => ({
        ...prev,
        errors: { ...prev.errors, deliveryInfo: "" },
      }));
    } else if (name === "useOtherDeliveryService") {
      setUseOtherDeliveryService(value);
      setCompanyDetails((prev) => ({
        ...prev,
        errors: { ...prev.errors, useOtherDeliveryService: "" },
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      try {
        await addDoc(collection(db, "registercompany"), {
          address: companyDetails.address,
          companyName: companyDetails.companyName,
          companyType: companyDetails.companyType?.label,
          fullName: companyDetails.fullName,
          role: ownerType,
          email: companyDetails.email,
          phone: companyDetails.phone,
          deliveryInfo,
          useOtherDeliveryService,
        });
        alert("Company registered successfully!");
        setCompanyDetails({
          address: "",
          companyName: "",
          companyType: null,
          fullName: "",
          role: "",
          email: "",
          phone: "",
          errors: {
            address: "",
            companyName: "",
            email: "",
            phone: "",
            deliveryInfo: "",
            useOtherDeliveryService: "",
          },
        });
        setDeliveryInfo("");
        setUseOtherDeliveryService("");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  return (
    <Grid
      container
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{ width: "100%", bgcolor: "#6DCFF6" }}>
      <Grid item>
        <Typography variant="h2">Let&apos;s get started</Typography>
      </Grid>
      <Grid item>
        <Typography variant="subtitle2">
          We help you serve genuine customers far and wide. Ready to partner
          with us and grow your business!!
        </Typography>
      </Grid>
      <Grid
        item
        sx={{
          width: "90%",
          mx: "auto",
          backgroundColor: "background.paper",
          borderRadius: 2,
          px: 4,
          my: 3,
        }}>
        <Grid item container direction={"column"}>
          <Grid item>
            <Grid
              item
              container
              direction={"column"}
              justifyContent={"space-between"}>
              <Grid item>
                <Typography variant="h2">
                  Enter your company’s street address
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle2">
                  Company’s street address
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  label="Address"
                  variant="outlined"
                  name="address"
                  value={companyDetails.address}
                  onChange={handleInputChange}
                  error={!!companyDetails.errors.address}
                  helperText={companyDetails.errors.address}
                  sx={{ width: "80%", my: 2 }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              item
              container
              direction={"column"}
              justifyContent={"space-around"}>
              <Grid item>
                <Typography variant="h2">Enter your company details</Typography>
              </Grid>
              <Grid item>
                <Grid item container justifyContent={"space-between"}>
                  <Grid item>
                    <Grid item container direction={"column"}>
                      <Grid item>
                        <Typography variant="subtitle2">
                          Company name
                        </Typography>
                      </Grid>
                      <Grid item>
                        <TextField
                          fullWidth
                          label="Company Name"
                          variant="outlined"
                          name="companyName"
                          value={companyDetails.companyName}
                          onChange={handleInputChange}
                          error={!!companyDetails.errors.companyName}
                          helperText={companyDetails.errors.companyName}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item>
                    <Grid item container direction={"column"}>
                      <Grid item>
                        <Typography variant="subtitle2">
                          Company type
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          sx={{ width: 300, my: 2 }}
                          value={companyDetails.companyType}
                          onChange={handleAutocompleteChange}
                          options={companyTypes}
                          getOptionLabel={(option) => option.label}
                          isOptionEqualToValue={(option, value) =>
                            option.label === value.label
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Choose company type"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid item container direction={"column"}>
              <Grid item>
                <Typography variant="h2">About your company</Typography>
              </Grid>
              <Grid item sx={{ width: "100%" }}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    name="deliveryInfo"
                    value={deliveryInfo}
                    onChange={handleRadioChange}>
                    <Grid item container justifyContent={"space-around"}>
                      <Grid item lg={6}>
                        <FormControlLabel
                          value="no delivery"
                          control={<Radio />}
                          label="Does not deliver"
                        />
                      </Grid>
                      <Grid item lg={6}>
                        <FormControlLabel
                          value="has delivery"
                          control={<Radio />}
                          label="Handles own deliveries"
                        />
                      </Grid>
                    </Grid>
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid item container direction={"column"}>
              <Grid item>
                <Typography variant="h2">
                  Are you using any other company for delivery service?
                </Typography>
              </Grid>
              <Grid item sx={{ width: "100%" }}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    name="useOtherDeliveryService"
                    value={useOtherDeliveryService}
                    onChange={handleRadioChange}>
                    <Grid
                      item
                      container
                      justifyContent={"space-around"}
                      sx={{ width: "100%" }}>
                      <Grid item>
                        <FormControlLabel
                          value="has delivery partner"
                          control={<Radio />}
                          label="Uses other delivery partner"
                        />
                      </Grid>
                      <Grid item>
                        <FormControlLabel
                          value="has no delivery partner"
                          control={<Radio />}
                          label="No delivery partner"
                        />
                      </Grid>
                    </Grid>
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Grid item container direction={"column"}>
              <Grid item>
                <Typography variant="h2">Enter your contact details</Typography>
              </Grid>
              <Grid item>
                <Grid item container justifyContent={"space-between"}>
                  <Grid item>
                    <Grid item container direction={"column"}>
                      <Grid item>
                        <Grid item container direction={"column"}>
                          <Grid item>
                            <Typography variant="subtitle2">
                              Full name
                            </Typography>
                          </Grid>
                          <Grid item>
                            <TextField
                              fullWidth
                              sx={{ width: 400, my: 2 }}
                              variant="outlined"
                              label="full name"
                              placeholder="Enter your full name"
                              name="fullName"
                              value={companyDetails.fullName}
                              onChange={handleInputChange}
                              error={!!companyDetails.errors.address}
                              helperText={companyDetails.errors.address}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Grid item container direction={"column"}>
                          <Grid item>
                            <Typography variant="subtitle2">
                              Your role
                            </Typography>
                          </Grid>
                          <Grid item>
                            <TextField
                              sx={{ width: 400, my: 2 }}
                              select
                              variant="outlined"
                              label="role"
                              placeholder="Enter your role"
                              value={ownerType}
                              onChange={(event) =>
                                setOwnerType(event.target.value)
                              }>
                              <MenuItem value="owner">Owner</MenuItem>
                              <MenuItem value="other">Other</MenuItem>
                            </TextField>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid item container direction={"column"}>
                      <Grid item>
                        <Grid item container direction={"column"}>
                          <Grid item>
                            <Typography variant="subtitle2">
                              Email address
                            </Typography>
                          </Grid>
                          <Grid item>
                            <TextField
                              fullWidth
                              label="Email Address"
                              type="email"
                              variant="outlined"
                              name="email"
                              value={companyDetails.email}
                              onChange={handleInputChange}
                              error={!!companyDetails.errors.email}
                              helperText={companyDetails.errors.email}
                              sx={{ width: 400, my: 2 }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Grid item container direction={"column"}>
                          <Grid item>
                            <Typography variant="subtitle2">
                              Phone number
                            </Typography>
                          </Grid>
                          <Grid item>
                            <TextField
                              fullWidth
                              label="Phone Number"
                              variant="outlined"
                              name="phone"
                              value={companyDetails.phone}
                              onChange={handleInputChange}
                              error={!!companyDetails.errors.phone}
                              helperText={companyDetails.errors.phone}
                              sx={{ mb: 2 }}
                            />
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
                              <Typography variant="h4">Submit</Typography>
                            </Button>
                            {Object.values(companyDetails.errors).map(
                              (error, index) =>
                                error && (
                                  <Snackbar
                                    ContentProps={{
                                      style: { backgroundColor: "#FF3232" },
                                    }}
                                    anchorOrigin={{
                                      vertical: "top",
                                      horizontal: "center",
                                    }}
                                    key={index}
                                    open={true}
                                    autoHideDuration={6000}
                                    message={error}
                                  />
                                )
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

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
} from "@mui/material";

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
  return (
    <Grid
      container
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{ width: "100%", bgcolor: "#6DCFF6" }}>
      <Grid item>
        <Typography variant="h2">Let's get started</Typography>
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
                  sx={{ width: "80%", my: 2 }}
                  label="enter your address"
                  variant="outlined"
                  placeholder="enter your address"
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
                          sx={{ width: 300, my: 1 }}
                          label="company name"
                          variant="outlined"
                          placeholder="enter your company's name"
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
                        {" "}
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={companyTypes}
                          sx={{ width: 300, my: 1 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="choose company type"
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
                <FormControl>
                  <RadioGroup name="radio-buttons-group">
                    <Grid item container justifyContent={"space-around"}>
                      <Grid item lg={6}>
                        <FormControlLabel
                          value="female"
                          control={<Radio />}
                          label="My Restaurant does not deliver or utilise delivery services."
                        />
                      </Grid>
                      <Grid item lg={6}>
                        <FormControlLabel
                          value="male"
                          control={<Radio />}
                          label="My Restaurant does it's own deliveries."
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
                <FormControl>
                  <RadioGroup name="radio-buttons-group">
                    <Grid
                      item
                      container
                      justifyContent={"space-around"}
                      sx={{ width: "100%" }}>
                      <Grid item>
                        <FormControlLabel
                          value="female"
                          control={<Radio />}
                          label="Yes, My Company currently uses other delivery partner."
                        />
                      </Grid>
                      <Grid item>
                        <FormControlLabel
                          value="male"
                          control={<Radio />}
                          label="No, I don’t currently have a delivery partner."
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
                              sx={{ width: 400, my: 2 }}
                              variant="outlined"
                              label="full name"
                              placeholder="Enter your full name"
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
                              placeholder="Enter your role">
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
                              sx={{ width: 400, my: 2 }}
                              variant="outlined"
                              label="email"
                              type="email"
                              placeholder="Enter your email address"
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
                              sx={{ width: 400, my: 2 }}
                              variant="outlined"
                              label="phone"
                              type="phone"
                              placeholder="Enter your phone numaber"
                            />
                          </Grid>
                          <Grid item>
                            <Button
                              sx={{
                                width: "100%",
                                borderRadius: 14,
                                bgcolor: "#6DCFF6",
                                marginBottom: 3,
                                height: 60,
                                py: 3,
                              }}>
                              <Typography variant="h4">Submit</Typography>
                            </Button>
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

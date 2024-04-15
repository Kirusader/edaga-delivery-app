/** @format */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ButtonArrow from "./ui/ButtonArrow";
import background from "../assets/background.jpg";
import mobileBackground from "../assets/mobileBackground.jpg";
import { useTheme, styled } from "@mui/material/styles";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import phoneIcon from "../assets/phone.svg";
import emailIcon from "../assets/email.svg";
import airplane from "../assets/send.svg";

const StyledOrderNow = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.common.blue,
  color: theme.palette.common.blue,
  borderWidth: 2,
  textTransform: "none",
  borderRadius: 50,
  fontFamily: "Roboto",
  fontWeight: "bold",
  fontSize: "0.9rem",
  height: 45,
  width: 145,
  [theme.breakpoints.down("sm")]: {
    marginBottom: "2em",
    marginTop: "1em",
  },
}));
const StyledButton = styled(Button)(({ theme }) => ({
  ...theme.typography.mainButton,
  backgroundColor: theme.palette.common.orange,
  borderRadius: 50,
  height: 45,
  width: 135,
  marginBottom: 10,
  "&:hover": {
    backgroundColor: theme.palette.secondary.light,
  },
}));
export default function Contact() {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailHelper, setEmailHelper] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneHelper, setPhoneHelper] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    backgroundColor: "",
  });
  const onChange = (event) => {
    let valid;
    switch (event.target.id) {
      case "email":
        setEmail(event.target.value);
        valid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
          event.target.value
        );
        if (!valid) {
          setEmailHelper("Invalid email");
        } else {
          setEmailHelper("");
        }
        break;
      case "phone":
        setPhone(event.target.value);
        valid = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
          event.target.value
        );
        if (!valid) {
          setPhoneHelper("Invalid Phone Number");
        } else {
          setPhoneHelper("");
        }
        break;
      default:
        break;
    }
  };
  const onConfirm = () => {
    setLoading(true);
    axios
      .get("https://us-central1-edaga-delivery.cloudfunctions.net/sendEmail", {
        params: {
          name: name,
          email: email,
          phone: phone,
          message: message,
        },
      })
      .then((res) => {
        setLoading(false);
        setOpen(false);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setAlert({
          open: true,
          message: "Message sent successfully!",
          backgroundColor: "#4BB543",
        });
      })
      .catch((err) => {
        setLoading(false);
        setAlert({
          open: true,
          message: "Something went wrong, please try again!",
          backgroundColor: "#FF3232",
        });
      });
  };
  const buttonContents = (
    <>
      Send Message{" "}
      <img src={airplane} alt="airplane" style={{ marginLeft: "1em" }} />
    </>
  );
  return (
    <Grid container direction="row">
      <Grid
        item
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        lg={4}
        xl={3}
        sx={{
          marginBottom: matchesMD ? "5em" : 0,
          marginTop: matchesMD ? "5em" : 0,
        }}>
        <Grid item>
          <Grid container direction="column">
            <Grid item>
              <Typography
                align={matchesMD ? "center" : undefined}
                variant="h2"
                sx={{ lineHeight: 1 }}>
                Contact Us
              </Typography>
              <Typography
                align={matchesMD ? "center" : undefined}
                variant="subtitle2"
                sx={{ color: theme.palette.common.blue }}>
                We're waiting
              </Typography>
            </Grid>
            <Grid item container sx={{ marginTop: "2em" }}>
              <Grid item>
                <img
                  src={phoneIcon}
                  alt="phone"
                  style={{ marginRight: "0.5em", verticalAlign: "bottom" }}
                />
              </Grid>
              <Grid item>
                <Typography
                  variant="subtitle2"
                  style={{
                    fontSize: "1.5rem",
                  }}>
                  <a
                    href="tel:5555555555"
                    style={{ textDecoration: "none", color: "inherit" }}>
                    (555) 555-5555
                  </a>
                </Typography>
              </Grid>
            </Grid>
            <Grid item container sx={{ marginBottom: "2em" }}>
              <Grid item>
                <img
                  src={emailIcon}
                  alt="envelope"
                  style={{ marginRight: "0.5em", verticalAlign: "bottom" }}
                />
              </Grid>
              <Grid item>
                <Typography
                  variant="subtitle2"
                  style={{
                    fontSize: "1.5rem",
                    verticalAlign: "bottom",
                  }}>
                  <a
                    href="edagadelivery2024@gmail.com"
                    style={{ textDecoration: "none", color: "inherit" }}>
                    edagadelivery2024@gmail.com
                  </a>
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction="column"
              style={{ maxWidth: "20em" }}>
              <Grid item>
                <TextField
                  fullWidth
                  sx={{ marginTop: "1em", marginBottom: "1em" }}
                  label="Name"
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item sx={{ marginTop: "1em", marginBottom: "1em" }}>
                <TextField
                  fullWidth
                  label="Email"
                  helperText={emailHelper}
                  error={emailHelper.length !== 0}
                  type="email"
                  value={email}
                  id="email"
                  onChange={onChange}
                />
              </Grid>
              <Grid item sx={{ marginTop: "1em", marginBottom: "1em" }}>
                <TextField
                  fullWidth
                  error={phoneHelper.length !== 0}
                  helperText={phoneHelper}
                  label="Phone"
                  type="phone"
                  value={phone}
                  id="phone"
                  onChange={onChange}
                />
              </Grid>
            </Grid>
            <Grid item>
              <TextField
                sx={{
                  border: `2px solid ${theme.palette.common.blue}`,
                  marginTop: "5rem",
                  marginBottom: "1rem",
                  borderRadius: 5,
                  maxWidth: 300,
                  "& .MuiInput-underline:before": {
                    borderBottom: "none",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottom: "none",
                  },
                  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                    borderBottom: "none",
                  },
                }}
                InputProps={{
                  // Use InputProps instead of inputProps
                  disableUnderline: true,
                }}
                multiline
                fullWidth
                variant="standard"
                label="Message"
                value={message}
                rows={10}
                id="message"
                onChange={(e) => setMessage(e.target.value)}
              />
            </Grid>
            <Grid item container justifyContent="center">
              <Button
                onClick={() => setOpen(true)}
                disabled={
                  name.length === 0 ||
                  message.length === 0 ||
                  phoneHelper.length !== 0 ||
                  emailHelper.length !== 0
                }
                variant="contained"
                sx={{
                  ...theme.typography.estimate,
                  borderRadius: 50,
                  height: 45,
                  width: 245,
                  fontSize: "1rem",
                  marginBottom: "1rem",
                  backgroundColor: theme.palette.common.orange,
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.light,
                  },
                }}>
                {buttonContents}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        fullScreen={matchesXS}
        sx={{ zIndex: 1302 }}
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          style: {
            paddingTop: matchesXS ? "1em" : "3em",
            paddingBottom: matchesXS ? "1em" : "3em",
            paddingLeft: matchesXS ? 0 : matchesSM ? "0.6" : "2em",
            paddingRight: matchesXS ? 0 : matchesSM ? "0.6em" : "2em",
          },
        }}>
        <DialogContent>
          <Grid container direction="column">
            <Grid item>
              <Typography variant="h4" gutterBottom>
                Confirm Message
              </Typography>
            </Grid>
            <Grid item container direction="column" justifyContent="center">
              <Grid
                item
                container
                direction="column"
                style={{ maxWidth: "20em" }}>
                <Grid item>
                  <TextField
                    fullWidth
                    sx={{ marginTop: "1em", marginBottom: "1em" }}
                    label="Name"
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item sx={{ marginTop: "1em", marginBottom: "1em" }}>
                  <TextField
                    fullWidth
                    label="Email"
                    helperText={emailHelper}
                    error={emailHelper.length !== 0}
                    type="email"
                    value={email}
                    id="email"
                    onChange={onChange}
                  />
                </Grid>
                <Grid item sx={{ marginTop: "1em", marginBottom: "1em" }}>
                  <TextField
                    fullWidth
                    error={phoneHelper.length !== 0}
                    helperText={phoneHelper}
                    label="Phone"
                    type="phone"
                    value={phone}
                    id="phone"
                    onChange={onChange}
                  />
                </Grid>
                <Grid item style={{ maxWidth: matchesXS ? "100%" : "20em" }}>
                  <TextField
                    sx={{
                      border: `2px solid ${theme.palette.common.blue}`,
                      marginTop: "5rem",
                      marginBottom: "1rem",
                      borderRadius: 5,
                    }}
                    InputProps={{
                      disableUnderline: true,
                    }}
                    multiline
                    label="Message"
                    value={message}
                    rows={10}
                    id="message"
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Grid>
                <Grid
                  item
                  container
                  direction={matchesSM ? "column" : "row"}
                  justifyContent="space-around"
                  spacing={1}>
                  <Grid item sm={6}>
                    <StyledButton onClick={() => setOpen(false)}>
                      Cancel
                    </StyledButton>
                  </Grid>
                  <Grid item sm={6}>
                    <StyledButton onClick={onConfirm}>
                      {" "}
                      {loading ? (
                        <CircularProgress size={30} />
                      ) : (
                        buttonContents
                      )}
                    </StyledButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={alert.open}
        message={alert.message}
        ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setAlert({ ...alert, open: false })}
        autoHideDuration={4000}
      />
      <Grid
        item
        container
        direction={matchesMD ? "column" : "row"}
        sx={{
          backgroundImage: `url(${background})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "60em",
        }}
        justifyContent={matchesMD ? "center" : undefined}
        lg={8}
        xl={9}>
        <Grid
          container
          sx={{
            backgroundImage: `url(${background})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            height: "60em",
            width: "100%",
            backgroundAttachment: "fixed",
            [theme.breakpoints.down("md")]: {
              backgroundImage: `url(${mobileBackground})`,
              backgroundAttachment: "inherit",
            },
          }}
          alignItems="center"
          justifyContent={matchesSM ? "center" : "space-between"}
          direction={matchesSM ? "column" : "row"}>
          <Grid
            item
            style={{
              marginLeft: matchesSM ? 0 : "5rem",
              textAlign: matchesSM ? "center" : "inherit",
            }}>
            <Grid container direction="column">
              <Grid item>
                <Typography
                  sx={{ color: theme.palette.common.blue, fontWeight: 600 }}
                  align={matchesMD ? "center" : undefined}
                  variant="h2">
                  Easy To Order.
                  <br />
                  Guaranteed Quick Delivery.
                </Typography>
                <Typography
                  align={matchesMD ? "center" : undefined}
                  variant="subtitle2"
                  sx={{ fontSize: "1.5rem", color: theme.palette.common.blue }}>
                  Take advantage of the 21st Century.
                </Typography>
              </Grid>
              <Grid
                item
                container
                justifyContent={matchesSM ? "center" : undefined}>
                <StyledOrderNow component={Link} to="/food" variant="outlined">
                  <span style={{ marginRight: 5 }}>Order now</span>
                  <ButtonArrow
                    width={15}
                    height={15}
                    fill={theme.palette.common.blue}
                  />
                </StyledOrderNow>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

/** @format */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle,
  signInWithFacebook,
} from "../../firebaseConfig.js";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  InputAdornment,
  TextField,
  Button,
  Box,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Close as CloseIcon,
} from "@mui/icons-material";
import Google from "../../assets/google.png";
import Facebook from "../../assets/facebook.png";

function Login() {
  const [err, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState(null);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(true);
  };
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
          distanceFilter: 10,
        }
      );
    }
  }, []);
  useEffect(() => {
    if (loading) return;
    if (user) {
      const uid = user.uid;
      if (uid === import.meta.env.VITE_ADMIN) {
        navigate("/admin");
      } else if (uid === import.meta.env.VITE_RIDER) {
        navigate("/riderpage");
      } else {
        navigate("/");
      }
    }
  }, [user, loading, navigate]);

  const handleLogin = async (method) => {
    switch (method) {
      case "logInWithEmailAndPassword":
        try {
          setErrors([]);
          let errors = [];
          let testingString =
            /^(([^<>()[\],;:\s@"']+(\.[^<>()[\],;:\s@"']+)*)|(".+"))@(([^<>()[\],;:\s@"']+\.)+[^<>()[\],;:\s@"']{2,})$/i;

          if (!email) {
            errors.push("Email required.");
          } else if (!testingString.test(email)) {
            errors.push("Email invalid.");
          }

          if (!password) {
            errors.push("Password required.");
          } else if (password.length < 3) {
            errors.push("Password too short.");
          }

          if (errors.length > 0) {
            errors.map((err, i) =>
              setErrors((prevErrors) => [...prevErrors, err])
            );
          } else {
            await logInWithEmailAndPassword(email, password);
          }
        } catch (error) {
          console.log(error.message);
          switch (error.message) {
            case "Firebase: Error (auth/user-not-found).":
              setErrors("User is not found. ");
              break;
            case "Firebase: Error (auth/wrong-password).":
              setErrors("Password is incorrect. ");
              break;

            case "Firebase: Error (auth/internal-error).":
              setErrors("Login fields are not valid. ");
              break;

            case "Firebase: Error (auth/invalid-email).":
              setErrors("Login fields are not valid. ");
              break;
            case "Firebase: Error (auth/invalid-credential).":
              setErrors("Email or Password is invalide.");
              break;
            case "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).":
              setErrors(
                "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. "
              );
              break;

            default:
              break;
          }
        }
        break;

      case "signInWithGoogle":
        console.log("Opening google login popup.");
        await signInWithGoogle(position.lat, position.lng);
        break;
      case "signInWithFacebook":
        console.log("Opening facebook login popup.");
        await signInWithFacebook(position.lat, position.lng);
        break;

      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        m: 1,
        p: 2,
        animation: "fadeUP2 1s ease-in-out",
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
        "&:hover": {
          boxShadow: 6,
        },
      }}>
      <TextField
        label="Email Address"
        type="email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ my: 1, fontSize: "1.1rem" }}
      />
      <TextField
        id="outlined-adornment-password"
        type={showPassword ? "text" : "password"}
        variant="outlined"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{
          my: 1,
          "& .MuiInputBase-input": {
            fontSize: "1.25rem",
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        label="Password"
      />

      <Button
        variant="contained"
        onClick={() => {
          handleLogin("logInWithEmailAndPassword");
          navigate("/");
        }}
        sx={{
          my: 1,
          "& .MuiInputBase-input": {
            fontSize: "1.25rem",
          },
        }}>
        Login
      </Button>

      {err && err.length > 0 && (
        <Typography
          variant="subtitle2"
          color="error"
          sx={{ mt: 3, animation: "fadeUP1 1s ease-in-out" }}>
          🔻{err}
        </Typography>
      )}

      <Typography variant="h4" my={5}>
        - OR -
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          justifyContent: "center",
        }}>
        <Button
          onClick={() => {
            handleLogin("signInWithGoogle");
            navigate("/");
          }}>
          <img
            src={Google}
            alt="Google"
            style={{ width: "40px", height: "40px" }}
          />
        </Button>
        <Button
          onClick={() => {
            handleLogin("signInWithFacebook");
            navigate("/");
          }}>
          <img
            src={Facebook}
            alt="Facebook"
            style={{ width: "100px", height: "100px" }}
          />
        </Button>
      </Box>

      <Box mt={4}>
        <Typography
          variant="h4"
          component={Link}
          to="/reset"
          underline="hover"
          sx={{ textDecoration: "none" }}>
          Forgot Password
        </Typography>
      </Box>
      <Typography variant="h4" my={4}>
        Don &apos; t have an account?{" "}
        <Typography
          variant="h4"
          component={Link}
          to="/register"
          underline="hover"
          sx={{ textDecoration: "none", color: "red" }}>
          {" "}
          Register
        </Typography>{" "}
        now.
      </Typography>
      <Button onClick={() => setOpen(true)} sx={{ my: 4 }}>
        Privacy Policy
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="privacy-policy-title"
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiDialog-container": {
            alignItems: "flex-start",
            marginTop: "5vh",
          },
        }}>
        <DialogContent sx={{ bgcolor: "gray.100", p: 3 }}>
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Privacy Policy for Edaga delivery 2024
          </Typography>
          <Typography gutterBottom>
            Welcome to Edaga delivery service, owned by Kiros enterprise
            (&quot;Owner&quot;). This Privacy Policy explains how we collect,
            use, and protect your personal data when you use our web app.
          </Typography>

          <Typography variant="subtitle2" fontWeight="bold">
            Data Collection
          </Typography>
          <Typography gutterBottom>
            We collect personal data that you voluntarily provide to us,
            including your name and email address. This data is protected on
            Google servers and handled according to Google data protection
            guidelines.
          </Typography>

          <Typography variant="subtitle2" fontWeight="bold">
            Data Usage
          </Typography>
          <Typography gutterBottom>
            We use your personal data to personalize your experience on Edaga.
            We do not share your data with any third parties, except for the
            Solent University teachers. We may also use your data for analytics
            and to improve the app experience.
          </Typography>

          <Typography variant="subtitle2" fontWeight="bold">
            Data Sharing
          </Typography>
          <Typography gutterBottom>
            We do not share your personal data with anyone except for Solent
            University teachers.
          </Typography>

          <Typography variant="subtitle2" fontWeight="bold">
            Data Security
          </Typography>
          <Typography gutterBottom>
            We take appropriate technical and organizational measures to protect
            your personal data from unauthorized access, accidental loss, or
            destruction. Your data is protected by Google and stored on its
            servers.
          </Typography>

          <Typography variant="subtitle2" fontWeight="bold">
            User Rights
          </Typography>
          <Typography gutterBottom>
            If you would like to make any changes or if you have any questions
            or concerns regarding your data, please don&apos;t hesitate to
            contact us on edagadelivery2024@gmail.com.
          </Typography>

          <Typography variant="subtitle2" fontWeight="bold">
            Legal Compliance
          </Typography>
          <Typography gutterBottom>
            We comply with the General Data Protection Regulation (GDPR) and all
            other applicable data privacy laws. Please refer to the GDPR website
            for more information.
          </Typography>

          <Typography variant="subtitle2" fontWeight="bold">
            Cookies
          </Typography>
          <Typography gutterBottom>
            We use non-identifying cookies that Google and Facebook use to keep
            track of the user presence on Edaga.
          </Typography>

          <Typography variant="subtitle2" fontWeight="bold">
            Contact Information
          </Typography>
          <Typography gutterBottom>
            If you have any questions or concerns regarding your data, please
            contact us at edagadelivery2024@gmail.com.
          </Typography>

          <Typography variant="subtitle2" fontWeight="bold">
            Changes to This Privacy Policy
          </Typography>
          <Typography gutterBottom>
            We reserve the right to update this Privacy Policy from time to
            time. We will notify you of any changes by posting the new Privacy
            Policy on this page.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Login;

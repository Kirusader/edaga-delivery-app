/** @format */

import React, { useEffect, useState } from "react";
import Google from "../../assets/google.png";
import Facebook from "../../assets/facebook.png";
import { NavLink, Link } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
  signInWithFacebook,
} from "../../firebaseConfig.js";

function Register() {
  const [user, loading, error] = useAuthState(auth);
  const [errors, setErrors] = useState([]);
  const [position, setPosition] = useState(null);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setValues({
      ...values,
      [name]: value,
    });
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
  const register = async () => {
    setErrors([]);
    let errors = [];
    let testingString =
      /^(([^<>()[\],;:\s@"']+(\.[^<>()[\],;:\s@"']+)*)|(".+"))@(([^<>()[\],;:\s@"']+\.)+[^<>()[\],;:\s@"']{2,})$/i;

    if (!values.name) {
      errors.push("Name required.");
    } else if (values.name.length < 3) {
      errors.push("Name too short.");
    }
    if (!values.email) {
      errors.push("Email required.");
    } else if (!testingString.test(values.email)) {
      errors.push("Email invalid.");
    }

    if (!values.password) {
      errors.push("Password required.");
    } else if (values.password.length < 6) {
      errors.push("Password too short.");
    }
    if (!position) {
      errors.push("Turn on location and consent your location data. ");
    }
    if (errors.length > 0) {
      errors.map((err, i) => setErrors((prevErrors) => [...prevErrors, err]));
    } else {
      console.log("Registering user");
      const regMe = await registerWithEmailAndPassword(
        values.name,
        values.email,
        values.password,
        position.lat,
        position.lng
      );
      if (regMe != "Success") setErrors(regMe);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/");
  }, [user, loading, error, errors, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        m: 1,
        p: 2,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
        animation: "fadeUP2 1s ease-in-out",
        "&:hover": {
          boxShadow: 6,
        },
      }}>
      <TextField
        label="Full Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={values.name}
        onChange={handleChange}
        placeholder="Full Name"
        name="name"
        sx={{ my: 1 }}
      />
      <TextField
        label="E-mail Address"
        variant="outlined"
        fullWidth
        margin="normal"
        type="email"
        value={values.email}
        onChange={handleChange}
        placeholder="E-mail Address"
        name="email"
        sx={{ my: 1 }}
      />
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        value={values.password}
        onChange={handleChange}
        placeholder="Password"
        name="password"
        sx={{ my: 1 }}
      />
      <Button variant="contained" onClick={register} sx={{ my: 1 }}>
        Register
      </Button>

      {errors && (
        <Box sx={{ my: 2 }}>
          {errors.map((err, index) => (
            <Typography key={index} color="error">
              🔻{err}
            </Typography>
          ))}
        </Box>
      )}

      <Typography my={5}>- or -</Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          justifyContent: "center",
        }}>
        <Button onClick={signInWithGoogle} sx={{ mx: 1 }}>
          <img
            src={Google}
            alt="Google"
            style={{ width: "40px", height: "40px" }}
          />
        </Button>
        <Button onClick={signInWithFacebook} sx={{ mx: 1 }}>
          <img
            src={Facebook}
            alt="Facebook"
            style={{ width: "100px", height: "100px" }}
          />
        </Button>
      </Box>

      <Typography my={2}>
        Already have an account?{" "}
        <Link
          component={NavLink}
          to="/login"
          underline="hover"
          sx={{ color: "#ff5858" }}>
          Login
        </Link>{" "}
        now.
      </Typography>
    </Box>
  );
}

export default Register;

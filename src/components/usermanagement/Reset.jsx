/** @format */

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import { auth, sendPasswordReset } from "../../firebaseConfig";
function Reset() {
  const [err, setErrors] = useState(false);
  const [email, setEmail] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/");
  }, [user, loading, navigate]);

  const handleSubmit = () => {
    setErrors(false);
    let testingString =
      /^(([^<>()[\],;:\s@"']+(\.[^<>()[\],;:\s@"']+)*)|(".+"))@(([^<>()[\],;:\s@"']+\.)+[^<>()[\],;:\s@"']{2,})$/i;

    if (!email) {
      setErrors("Email required.");
    } else if (!testingString.test(email)) {
      setErrors("Email invalid.");
    }
    sendPasswordReset(email);
    navigate("/login");
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        animation: "fadeUP2 1s ease-in-out",
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
        "&:hover": {
          boxShadow: 6,
        },
        my: 1,
      }}>
      <TextField
        label="E-mail Address"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        sx={{ my: 1 }}
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ my: 1 }}>
        Send password reset email
      </Button>

      {err && (
        <Typography color="error" sx={{ my: 2 }}>
          🔻{err}
        </Typography>
      )}

      <Typography variant="h4">
        Don &apos; t have an account?{" "}
        <Typography
          variant="h4"
          component={Link}
          to="/register"
          sx={{ color: "#ff5858", my: 1 }}>
          Register
        </Typography>{" "}
        now.
      </Typography>
    </Box>
  );
}

export default Reset;

/** @format */

import { createTheme } from "@mui/material/styles";
const arcBlue = "#0B72B9";
const arcOrange = "#FFBA60";
const arcGrey = "#868686";
const theme = createTheme({
  palette: {
    common: {
      blue: arcBlue,
      orange: arcOrange,
      grey: arcGrey,
    },
    primary: {
      main: arcBlue,
    },
    secondary: {
      main: arcOrange,
    },
  },
  typography: {
    tab: {
      fontFamily: "Roboto",
      textTransform: "none",
      fontWeight: 600,
      color: "#000",
      fontSize: "1rem",
    },
    mainButton: {
      fontFamily: "Pacifico",
      fontSize: "1.2rem",
      textTransform: "none",
      color: "white",
      backgroundColor: "#FA8232",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "Roboto",
      fontWeight: 700,
      fontSize: "2.5rem",
      marginBottom: "3rem",
      marginTop: "2rem",
      color: "#000",
      lineHeight: 1.5,
      textDecoration: "none",
      textTransform: "none",
    },
    h3: {
      fontFamily: "Roboto",
      fontSize: "1.5rem",
      color: "#fff",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "Roboto",
      fontSize: "1.5rem",
      color: "#000",
      fontWeight: 600,
      textTransform: "none",
    },
    h6: {
      fontWeight: 500,
      fontFamily: "Roboto",
      color: "#000",
    },
    subtitle1: {
      textTransform: "none",
      fontSize: "0.8rem",
      fontWeight: 400,
      color: "#fff",
      "&:hover": { color: arcOrange },
    },
    footer: {
      color: "#000",
      fontSize: "0.70rem",
      fontFamily: "Roboto",
      textTransform: "none",
      fontWeight: 300,
    },
    subtitle2: {
      color: "#000",
      fontSize: "1.2rem",
      fontFamily: "Roboto",
      textTransform: "none",
      fontWeight: 400,
    },
    body1: {
      fontSize: "10px",
      color: "#000",
      fontWeight: 500,
    },
    caption: {
      fontSize: "1rem",
      fontWeight: 300,
      color: arcGrey,
    },
    orderNow: {
      borderColor: arcBlue,
      borderWidth: 2,
      textTransform: "none",
      color: arcBlue,
      borderRadius: 50,
      fontFamily: "Roboto",
      fontWeight: "bold",
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#000",
          fontSize: "1rem",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          color: arcGrey,
          fontWeight: 600,
          fontFamily: "Roboto",
          fontSize: "3rem",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          color: "#000",
          fontWeight: 300,
        },
        underline: {
          "&:before": {
            borderBottom: `2px solid ${"#000"}`,
          },
          "&:hover:not(.Mui-disabled):not(.Mui-focused):not(.Mui-error):before":
            {
              borderBottom: `2px solid ${"#000"}`,
            },
        },
      },
    },
  },
});

export default theme;

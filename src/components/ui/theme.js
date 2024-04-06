/** @format */

import { createTheme } from "@mui/material/styles";

// Define the main colors for your theme
const arcBlue = "#0B72B9";
const arcOrange = "#FFBA60";
const arcGrey = "#868686";

// Create a theme instance
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
      color: "#000",
      lineHeight: 1.5,
      marginLeft: "2rem",
      textDecoration: "none",
    },
    h3: {
      fontFamily: "Pacifico",
      fontSize: "2.5rem",
      color: arcBlue,
    },
    h4: {
      fontFamily: "Raleway",
      fontSize: "1.75rem",
      color: arcBlue,
      fontWeight: 700,
    },
    h6: {
      fontWeight: 500,
      fontFamily: "Roboto",
      color: "#000",
    },
    subtitle1: {
      fontSize: "1.25rem",
      fontWeight: 300,
      color: "#fff",
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
      fontSize: "0.78rem",
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
    // Example of component style overrides
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: arcBlue,
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
          color: arcGrey,
          fontWeight: 300,
        },
        underline: {
          "&:before": {
            borderBottom: `2px solid ${arcBlue}`,
          },
          "&:hover:not(.Mui-disabled):not(.Mui-focused):not(.Mui-error):before":
            {
              borderBottom: `2px solid ${arcBlue}`,
            },
        },
      },
    },
  },
});

export default theme;

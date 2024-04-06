/** @format */

import {
  AppBar,
  Toolbar,
  Tab,
  Tabs,
  Typography,
  Box,
  ListItem,
  List,
  ListItemIcon,
  InputBase,
  Button,
  IconButton,
  Drawer,
  Divider,
  ListItemText,
  ListItemButton,
  ListSubheader,
} from "@mui/material";

import { Search as SearchIcon, Menu as MenuIcon } from "@mui/icons-material";
import { useTheme, alpha, styled } from "@mui/material/styles";
import { useState } from "react";
import { Link } from "react-router-dom";
import closeButton from "../../assets/closebutton.svg";
const StyledTab = styled(Tab)(({ theme }) => ({
  ...theme.typography.tab,
  margin: "0.5rem",
  padding: "2px",
  opacity: 0.7,
  "&:hover": {
    opacity: 1,
  },
}));
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  flexGrow: 1,
  height: "34px",
  display: "flex",
  alignItems: "center",
  borderRadius: 30,
  backgroundColor: alpha(theme.palette.common.grey, 0.24),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.grey, 0.6),
  },
  marginLeft: 4,
  width: "50%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  fontSize: "1.1rem",
  color: "#000",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "15ch",
      "&:focus": {
        width: "20ch",
      },
    },
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
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.common.orange,
  height: 45,
  width: 50,
  marginLeft: 40,
  "&:hover": {
    backgroundColor: theme.palette.secondary.light,
  },
}));
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  fontWeight: 600,
  fontFamily: "Roboto",
  fontSize: "3rem",
}));
export default function Header() {
  const [value, setValue] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const theme = useTheme();
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static" elevation={0} sx={{ width: "95%", mx: "auto" }}>
        <Toolbar disableGutters>
          <Button
            onClick={() => setValue(0)}
            component={Link}
            to="/"
            sx={{ marginRight: 3, marginLeft: 0 }}
            disableRipple>
            <Typography variant="h2" sx={{ color: "#FFBA60" }}>
              ዕዳጋ
            </Typography>
          </Button>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search for products…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Tabs
            value={value}
            onChange={handleTabChange}
            indicatorColor="transparent">
            <StyledTab label="Home" component={Link} to="/" />
            <StyledTab
              label="Register your company"
              component={Link}
              to="/registercompany"
            />
            <StyledTab
              label="Become a rider"
              component={Link}
              to="/riderapply"
            />
            <StyledTab label="Login" component={Link} to="/login" />
          </Tabs>
          <StyledButton
            onClick={() => setValue(4)}
            variant="contained"
            component={Link}
            to="/signup">
            SignUp
          </StyledButton>
          <StyledIconButton
            onClick={() => {
              setValue(5);
              setOpenDrawer(true);
            }}
            component={Link}
            to="/account"
            size="large"
            edge="end"
            color="inherit">
            <MenuIcon />
          </StyledIconButton>
        </Toolbar>
      </AppBar>
      <Box>
        <Drawer
          sx={{
            "& .MuiDrawer-paper": {
              width: 350,
              height: "auto",
              bgcolor: "background.paper",
              border: "1px solid #ccc",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
            },
          }}
          anchor="right"
          variant="temporary"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}>
          <DrawerHeader>
            <IconButton
              component={Link}
              to="/"
              onClick={() => {
                setOpenDrawer(false);
                setValue(0);
              }}>
              <img src={closeButton} alt="close" />
            </IconButton>
          </DrawerHeader>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
            <ListSubheader>Account</ListSubheader>
            {[
              { option: "Careers", link: "/careers" },
              { option: "Become a rider", link: "/riderapply" },
              { option: "Register your company", link: "/registercompany" },
              { option: "Help", link: "/help" },
            ].map((text, index) => (
              <ListItem key={text} sx={{ display: "block", margin: "auto" }}>
                <ListItemButton
                  component={Link}
                  to={text.link}
                  sx={{
                    minHeight: 48,
                    justifyContent: openDrawer ? "initial" : "center",
                    px: 2.5,
                  }}>
                  <ListItemText primary={text.option} />
                  <Divider />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <StyledButton
              onClick={() => setValue(3)}
              variant="contained"
              component={Link}
              to="/login">
              LogIn
            </StyledButton>
            <StyledButton
              onClick={() => setValue(4)}
              variant="contained"
              component={Link}
              to="/signup">
              SignUp
            </StyledButton>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
}

/** @format */
import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Tab,
  Tabs,
  Typography,
  Box,
  ListItem,
  List,
  InputBase,
  Button,
  IconButton,
  Drawer,
  Divider,
  ListItemText,
  ListItemButton,
  ListSubheader,
  Badge,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  RemoveCircleOutline,
  AddCircleOutline,
} from "@mui/icons-material";
import { useTheme, alpha, styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import CartContext from "../../store/CartContext";
import { query, collection, getDocs, where, addDoc } from "firebase/firestore";
import { currencyFormatter } from "../../util/formatting";
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
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 20,
    top: 3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
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
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Header() {
  const [value, setValue] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [shipingAddress, setShippingAddress] = useState({
    phone: "",
    orderNote: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const cartCtxt = useContext(CartContext);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const totalCartItems = cartCtxt.items.reduce((totalNumberOfItems, item) => {
    return totalNumberOfItems + item.quantity;
  }, 0);
  const cartTotal = cartCtxt.items.reduce((totalPrice, item) => {
    return totalPrice + item.quantity * item.price;
  }, 0);
  const fetchUserData = async () => {
    if (!user) return;
    try {
      const q = await query(
        collection(db, "users"),
        where("uid", "==", user?.uid)
      );
      const doc = await getDocs(q);

      const data = await doc.docs[0].data();
      return data;
    } catch (err) {
      console.error(err);
      console.log("An error occured while fetching rooms data");
    }
  };
  const handleShippingAddressChange = (event) => {
    const { name, value } = event.target;
    setShippingAddress((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmitOrder = async () => {
    const userData = await fetchUserData();
    try {
      const docRef = await addDoc(collection(db, "orders"), {
        name: userData.name,
        email: userData.email,
        phone: shipingAddress.phone,
        orderNote: shipingAddress.orderNote,
        street: shipingAddress.street,
        city: shipingAddress.city,
        postalCode: shipingAddress.postalCode,
        country: shipingAddress.country,
        items: cartCtxt.items,
        total: cartTotal,
        createdAt: new Date(),
      });
      console.log("Document written with ID: ", docRef.id);
      cartCtxt.clearCart();
      alert(`Order has been placed. Your order number is ${docRef.id}`);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
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
          <StyledTab label="Home" component={Link} to="/" value={0} />
          <StyledTab
            label="Register your company"
            component={Link}
            to="/registercompany"
            value={1}
          />
          <StyledTab
            label="Become a rider"
            component={Link}
            to="/riderapply"
            value={2}
          />
          {user ? (
            <StyledTab label="Logout" component={Link} to="/logout" value={3} />
          ) : (
            <StyledTab label="Login" component={Link} to="/login" value={3} />
          )}
          {!user && (
            <StyledButton
              onClick={() => setValue(6)}
              variant="contained"
              component={Link}
              to="/register">
              SignUp
            </StyledButton>
          )}
          {user && (
            <StyledBadge badgeContent={totalCartItems} color="primary" showZero>
              <IconButton onClick={() => setDialogOpen(true)}>
                <ShoppingCartIcon color="error" />
              </IconButton>
            </StyledBadge>
          )}
          <StyledIconButton
            onClick={() => {
              setValue(7);
              setOpenDrawer(true);
            }}
            component={Link}
            to="/account"
            size="large"
            edge="end"
            color="inherit">
            <MenuIcon />
          </StyledIconButton>
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            PaperProps={{
              style: { minWidth: 700, py: "3em", px: "2em" },
            }}>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      marginBottom: 2,
                    }}>
                    Your Cart {!totalCartItems && <span>is Empty</span>}
                  </Typography>
                </Grid>
                {cartCtxt.items.map((item) => (
                  <Grid item key={item.id}>
                    <Grid item container justifyContent="space-around">
                      <Grid item>
                        <img
                          src={item.imageurl}
                          alt={item.description}
                          style={{ width: 100, heighte: 100 }}
                        />
                      </Grid>
                      <Grid item>
                        <Typography
                          variant="subtitle2"
                          component={"div"}
                          sx={{
                            width: 300,
                            textAlign: "left",
                            paddingBottom: 2,
                          }}>
                          {item.description} {item.quantity}{" "}
                          <span> items with individual price </span>{" "}
                          {currencyFormatter.format(item.price)}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        sx={{
                          width: "auto",
                          alignSelf: "right",
                          marginLeft: 2,
                        }}>
                        <Grid
                          item
                          container
                          justifyContent="space-around"
                          alignItems="center">
                          <Grid item>
                            <IconButton
                              onClick={() => cartCtxt.removeItem(item.id)}>
                              <RemoveCircleOutline color="primary" />
                            </IconButton>
                          </Grid>
                          <Grid item>
                            <Typography variant="subtitle2" component={"span"}>
                              {item.quantity}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <IconButton onClick={() => cartCtxt.addItem(item)}>
                              <AddCircleOutline color="primary" />
                            </IconButton>
                          </Grid>
                          <Grid item>
                            <IconButton
                              onClick={() => cartCtxt.deleteItem(item.id)}>
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
                <Grid item>
                  <Grid item container justifyContent={"space-around"}>
                    <Grid item>
                      <Typography
                        variant="h4"
                        component={"div"}
                        sx={{ paddingRight: 3 }}>
                        Total Price
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="h4"
                        component={"div"}
                        textAlign="right"
                        sx={{ paddingRight: 3 }}>
                        {currencyFormatter.format(cartTotal)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid
                    item
                    container
                    justifyContent={"space-around"}
                    sx={{ my: 2 }}>
                    <Grid item>
                      <Button onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item>
                      {cartCtxt.items.length > 0 && (
                        <Button
                          onClick={() => {
                            setCheckoutDialogOpen(true);
                            setDialogOpen(false);
                          }}>
                          Checkout
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
          <Dialog
            open={checkoutDialogOpen}
            onClose={() => {
              setCheckoutDialogOpen(false);
              setManualEntry(false);
            }}>
            <DialogTitle>Welcome to Checkout</DialogTitle>
            <DialogContent>
              {cartCtxt.items.map((item) => (
                <Grid item key={item.id}>
                  <Grid item container justifyContent="space-around">
                    <Grid item>
                      <img
                        src={item.imageurl}
                        alt={item.description}
                        style={{ width: 100, height: 100 }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="subtitle2"
                        component={"div"}
                        sx={{
                          width: 300,
                          textAlign: "left",
                          paddingBottom: 2,
                        }}>
                        {item.description} {item.quantity}{" "}
                        <span> items with individual price </span>{" "}
                        {currencyFormatter.format(item.price)}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{
                        width: "auto",
                        alignSelf: "right",
                        marginLeft: 2,
                      }}>
                      <Grid
                        item
                        container
                        justifyContent="space-around"
                        alignItems="center">
                        <Grid item>
                          <IconButton
                            onClick={() => cartCtxt.deleteItem(item.id)}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
              <Grid item>
                <Grid item container justifyContent={"space-around"}>
                  <Grid item>
                    <Typography
                      variant="h4"
                      component={"div"}
                      sx={{ paddingRight: 3 }}>
                      Total Price
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="h4"
                      component={"div"}
                      textAlign="right"
                      sx={{ paddingRight: 3 }}>
                      {currencyFormatter.format(cartTotal)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Typography variant="subtitle2">Order Note</Typography>
              <TextField
                autoFocus
                margin="dense"
                name="orderNote"
                label="Order Note"
                type="text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={shipingAddress.orderNote}
                onChange={handleShippingAddressChange}
              />
              <Typography variant="subtitle2">Phone</Typography>
              <TextField
                autoFocus
                margin="dense"
                name="phone"
                label="Phone Number"
                type="text"
                fullWidth
                variant="outlined"
                value={shipingAddress.phone}
                onChange={handleShippingAddressChange}
              />
              <>
                <TextField
                  label="Street"
                  fullWidth
                  name="street"
                  variant="outlined"
                  value={shipingAddress.street}
                  onChange={handleShippingAddressChange}
                  margin="normal"
                  required
                />
                <TextField
                  label="City"
                  fullWidth
                  variant="outlined"
                  name="city"
                  value={shipingAddress.city}
                  onChange={handleShippingAddressChange}
                  margin="normal"
                  required
                />
                <TextField
                  label="Postal Code"
                  fullWidth
                  name="postalCode"
                  variant="outlined"
                  value={shipingAddress.postalCode}
                  onChange={handleShippingAddressChange}
                  margin="normal"
                  required
                />
                <TextField
                  label="Country"
                  fullWidth
                  name="country"
                  variant="outlined"
                  value={shipingAddress.country}
                  onChange={handleShippingAddressChange}
                  margin="normal"
                  required
                />
              </>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: 20,
                }}>
                <Button
                  onClick={() => setCheckoutDialogOpen(false)}
                  color="primary"
                  variant="contained">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleSubmitOrder();
                    setCheckoutDialogOpen(false);
                  }}
                  color="primary"
                  variant="contained">
                  Submit Order
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
          onClose={() => {
            setOpenDrawer(false);
          }}>
          <Box sx={{ overflow: "auto", maxHeight: "100vh" }}>
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
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
              }}>
              <ListSubheader>Categories</ListSubheader>
              <Divider />
              {[
                { option: "Bed & Bath", link: "/bedbath" },
                { option: "Beverage", link: "/beverages" },
                {
                  option: "Electronics & Home Appliance",
                  link: "/electronicsappliance",
                },
                { option: "Food", link: "/food" },
                { option: "Home Care", link: "/homecare" },
                { option: "Personal Care", link: "/personalcare" },
                { option: "Stationary", link: "/stationary" },
              ].map((text) => (
                <ListItem
                  key={crypto.randomUUID()}
                  sx={{ display: "block", margin: "auto" }}>
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
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
              }}>
              <ListSubheader>Account</ListSubheader>
              <Divider />
              {[
                { option: "Your orders", link: "/orders" },
                { option: "Become a rider", link: "/riderapply" },
                { option: "Careers", link: "/careers" },
                { option: "Help", link: "/help" },
                { option: "Register your company", link: "/registercompany" },
              ].map((text) => (
                <ListItem
                  key={crypto.randomUUID()}
                  sx={{ display: "block", margin: "auto" }}>
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
              {user ? (
                <>
                  <StyledButton
                    onClick={() => setValue(3)}
                    variant="contained"
                    component={Link}
                    to="/logout">
                    LogOut
                  </StyledButton>
                </>
              ) : (
                <>
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
                    to="/register">
                    SignUp
                  </StyledButton>
                </>
              )}
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
}

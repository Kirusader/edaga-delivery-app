/** @format */
import React, { useState, useContext, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
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
  Snackbar,
  Avatar,
  ListItemAvatar,
} from "@mui/material";
import axios from "axios";
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  RemoveCircleOutline,
  AddCircleOutline,
} from "@mui/icons-material";
import { useTheme, alpha, styled } from "@mui/material/styles";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import CartContext from "../../store/CartContext";
import defaultImage from "../../assets/default.png";
import {
  doc,
  query,
  collection,
  getDocs,
  where,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { currencyFormatter } from "../../util/formatting";
import closeButton from "../../assets/closebutton.svg";
const logoImage =
  "https://res.cloudinary.com/drnarknab/image/upload/v1714834837/logo_h8nky1.png";
const ActiveStyle = {
  fontWeight: "bold",
  color: "primary",
};
const StyledNavLink = styled(NavLink)(({ theme }) => ({
  ...theme.typography.subtitle2,
  textDecoration: "none",
  margin: theme.spacing(1),
  "&.active": {
    fontWeight: "bold",
    color: theme.palette.common.blue,
  },
}));
const StyledNavButton = styled(Button)(({ theme }) => ({
  ...theme.typography.subtitle2,
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
  const [openDrawer, setOpenDrawer] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    backgroundColor: "",
  });
  const [shippingAddress, setShippingAddress] = useState({
    cardNumber: "",
    phone: "",
    orderNote: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const searchResultsRef = useRef(null);
  const cartCtxt = useContext(CartContext);

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

      const data = doc.docs[0].data();
      return data;
    } catch (err) {
      console.error(err);
      console.log("An error occured while fetching data");
    }
  };
  const handleShippingAddressChange = (event) => {
    const { name, value } = event.target;
    setShippingAddress((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  useEffect(() => {
    const collectionNames = [
      "bedbath",
      "beverage",
      "electrical",
      "homecare",
      "food",
      "personalcare",
      "stationary",
    ];
    async function combineData() {
      let allData = [];
      for (const name of collectionNames) {
        const querySnapshot = await getDocs(collection(db, name));
        const collectionData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        allData.push(...collectionData);
      }
      setAllProducts(allData);
    }
    combineData();
  }, []);
  const searchResults = allProducts.filter((product) =>
    product.description.toLowerCase().includes(searchText.toLowerCase())
  );
  const handleNavigation = (product) => {
    navigate(`/product/${product.id}`);
    setSearchText("");
  };
  const generateRandomNumber = () => {
    // Generates a 5-digit random number as string
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join(
      ""
    );
  };

  // Define possible choices for the additional character in the order number
  const possibleChoices = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "K",
    "L",
    "M",
    "N",
    "T",
    "Y",
    "Z",
  ];

  // Select a random character from possibleChoices
  const randomCharacter =
    possibleChoices[Math.floor(Math.random() * possibleChoices.length)];

  // Generate a random order number by combining the random number with the random character
  const randomOrderNumber = `${randomCharacter}${generateRandomNumber()}`;
  const initialShippingAddress = {
    cardNumber: "",
    phone: "",
    orderNote: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  };
  const handleSubmitOrder = async () => {
    try {
      const userData = await fetchUserData();
      const cardsQuery = query(
        collection(db, "cards"),
        where("cardnumber", "==", shippingAddress.cardNumber)
      );
      const cardsSnapshot = await getDocs(cardsQuery);

      if (!cardsSnapshot.empty) {
        const cardData = cardsSnapshot.docs[0].data();
        const cardRef = doc(db, "cards", cardsSnapshot.docs[0].id);
        const newBalance = cardData.balance - cartTotal;

        if (cardData.balance >= cartTotal) {
          await updateDoc(cardRef, {
            balance: newBalance,
            active: newBalance > 0,
          });
          await addDoc(collection(db, "orders"), {
            uid: user?.uid,
            name: userData.name,
            email: userData.email,
            phone: shippingAddress.phone,
            orderNote: shippingAddress.orderNote,
            cardNumber: shippingAddress.cardNumber,
            street: shippingAddress.street,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
            items: cartCtxt.items,
            total: cartTotal,
            status: "pending",
            driverId: null,
            orderId: randomOrderNumber,
            deliverToCustomer:false,
            createdAt: new Date(),
          });
          setShippingAddress(initialShippingAddress);
          console.log("Document written with ID: ", randomOrderNumber);
          cartCtxt.clearCart();
          setAlert({
            open: true,
            message: `Order has been placed. Your order number is ${randomOrderNumber}`,
            backgroundColor: "#4BB543",
          });
        } else {
          setAlert({
            open: true,
            message: "You have insufficient balance for this purchase!",
            backgroundColor: "#FF3232",
          });
        }
      } else {
        setAlert({
          open: true,
          message:
            "Card number not valid. Please,enter a valid voucher number.",
          backgroundColor: "#FF3232",
        });
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      setAlert({
        open: true,
        message: "An error occurred while processing your order.",
        backgroundColor: "#FF3232",
      });
    }
  };
  const onConfirm = async () => {
    const userData = await fetchUserData();
    if (userData) {
      axios
        .get(
          "https://us-central1-edaga-delivery.cloudfunctions.net/sendOrder",
          {
            params: {
              name: userData.name,
              email: userData.email,
              phone: shippingAddress.phone,
              cartData: JSON.stringify(cartCtxt.items),
              orderId: randomOrderNumber,
            },
          }
        )
        .then((res) => {
          setShippingAddress(initialShippingAddress);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static" elevation={0} sx={{ width: "95%", mx: "auto" }}>
        <Toolbar disableGutters>
          <StyledNavLink to="/">
            <StyledNavButton
              sx={{ marginRight: 3, marginLeft: 0 }}
              disableRipple>
              <img
                src={logoImage}
                alt="logo"
                width={"150px"}
                height={"150px"}
              />
            </StyledNavButton>
          </StyledNavLink>
          {user ? (
            user.uid === import.meta.env.VITE_RIDER ? (
              <>
                <StyledNavLink to="/riderpage">View Orders</StyledNavLink>
                <StyledNavLink
                  to="/logout"
                  style={({ isActive }) =>
                    isActive ? ActiveStyle : undefined
                  }>
                  <StyledNavButton
                    onClick={() => {
                      cartCtxt.clearCart();
                    }}
                    variant="text">
                    Logout
                  </StyledNavButton>
                </StyledNavLink>
              </>
            ) : user.uid === import.meta.env.VITE_ADMIN ? (
              <>
                <StyledNavLink to="/admin">Manage Orders</StyledNavLink>
                <StyledNavLink
                  to="/logout"
                  style={({ isActive }) =>
                    isActive ? ActiveStyle : undefined
                  }>
                  <StyledNavButton
                    onClick={() => {
                      cartCtxt.clearCart();
                    }}
                    variant="text">
                    Logout
                  </StyledNavButton>
                </StyledNavLink>
              </>
            ) : (
              <>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search for products…"
                    inputProps={{ "aria-label": "search" }}
                  />
                </Search>
                <Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}>
                  <StyledNavLink to="/">Home</StyledNavLink>
                  <StyledNavLink to="/riderapply">Become a rider</StyledNavLink>
                  <StyledNavLink to="/registercompany">
                    Register your company
                  </StyledNavLink>
                  <StyledNavLink
                    to="/logout"
                    style={({ isActive }) =>
                      isActive ? ActiveStyle : undefined
                    }>
                    <StyledNavButton
                      onClick={() => {
                        cartCtxt.clearCart();
                      }}
                      variant="text">
                      Logout
                    </StyledNavButton>
                  </StyledNavLink>
                </Box>
                <StyledBadge
                  badgeContent={totalCartItems}
                  color="primary"
                  showZero>
                  <IconButton onClick={() => setDialogOpen(true)}>
                    <ShoppingCartIcon color="error" />
                  </IconButton>
                </StyledBadge>
                <StyledIconButton
                  onClick={() => {
                    setOpenDrawer(true);
                  }}
                  component={Link}
                  to="/account"
                  size="large"
                  edge="end"
                  color="inherit">
                  <MenuIcon />
                </StyledIconButton>
                <Snackbar
                  open={alert.open}
                  message={alert.message}
                  ContentProps={{
                    style: { backgroundColor: alert.backgroundColor },
                  }}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  onClose={() => setAlert({ ...alert, open: false })}
                  autoHideDuration={4000}
                />
              </>
            )
          ) : (
            <>
              <StyledNavLink
                to="/login"
                style={({ isActive }) => (isActive ? ActiveStyle : undefined)}>
                Login
              </StyledNavLink>
              <StyledNavLink
                to="/register"
                style={({ isActive }) => (isActive ? ActiveStyle : undefined)}>
                SignUp
              </StyledNavLink>
            </>
          )}

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
              <Typography variant="subtitle2">Card voucher number</Typography>
              <TextField
                autoFocus
                margin="dense"
                name="cardNumber"
                label="Voucher Number"
                type="text"
                fullWidth
                variant="outlined"
                value={shippingAddress.cardNumber}
                onChange={handleShippingAddressChange}
                required
              />
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
                value={shippingAddress.orderNote}
                onChange={handleShippingAddressChange}
                required
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
                value={shippingAddress.phone}
                onChange={handleShippingAddressChange}
                required
              />
              <>
                <TextField
                  label="Street"
                  fullWidth
                  name="street"
                  variant="outlined"
                  value={shippingAddress.street}
                  onChange={handleShippingAddressChange}
                  margin="normal"
                  required
                />
                <TextField
                  label="City"
                  fullWidth
                  variant="outlined"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleShippingAddressChange}
                  margin="normal"
                  required
                />
                <TextField
                  label="Postal Code"
                  fullWidth
                  name="postalCode"
                  variant="outlined"
                  value={shippingAddress.postalCode}
                  onChange={handleShippingAddressChange}
                  margin="normal"
                  required
                />
                <TextField
                  label="Country"
                  fullWidth
                  name="country"
                  variant="outlined"
                  value={shippingAddress.country}
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
                    onConfirm();
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
      {searchText !== "" && (
        <List
          ref={searchResultsRef}
          sx={{
            marginLeft: 27,
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
          }}>
          {searchResults.length > 0 ? (
            searchResults.slice(0, 12).map((product) => (
              <ListItem
                alignItems="flex-start"
                key={product.id}
                onClick={() => handleNavigation(product)}
                sx={{ cursor: "pointer" }}>
                <ListItemAvatar>
                  <Avatar alt="Product Image" src={product.imageurl} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body1" noWrap>
                      {product.description}
                    </Typography>
                  }
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No results found" />
            </ListItem>
          )}
        </List>
      )}
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
                }}>
                <img src={closeButton} alt="close" />
              </IconButton>
            </DrawerHeader>
            <Grid container justifyContent="center" sx={{ width: "100%" }}>
              <Grid item xs={12} md={6} sx={{ textAlign: "center", mt: 2 }}>
                <Avatar
                  src={defaultImage}
                  sx={{ width: 100, height: 100, mx: "auto" }}
                />
                <Typography variant="h5" sx={{ mt: 1 }}>
                  {user ? user.displayName : ""}
                </Typography>
                <Typography variant="subtitle2">
                  {user ? user.email : ""}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                  {user ? (
                    <>
                      <StyledButton
                        onClick={() => {
                          cartCtxt.clearCart();
                        }}
                        variant="contained"
                        component={Link}
                        to="/logout">
                        SignOut
                      </StyledButton>
                    </>
                  ) : (
                    <>
                      <StyledButton
                        variant="contained"
                        component={Link}
                        to="/login">
                        LogIn
                      </StyledButton>
                      <StyledButton
                        variant="contained"
                        component={Link}
                        to="/register">
                        SignUp
                      </StyledButton>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
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
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
}

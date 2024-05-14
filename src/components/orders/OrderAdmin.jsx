/** @format */

import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDocs,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
const StyledButton = styled(Button)(({ theme }) => ({
  ...theme.typography.mainButton,
  backgroundColor: theme.palette.common.orange,
  borderRadius: 50,
  height: 60,
  width: 200,
  margin: 20,
  "&:hover": {
    backgroundColor: theme.palette.secondary.light,
  },
}));
const OrderAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const [cardCount, setCardCount] = useState(0);
  const [activeCardCount, setActiveCardCount] = useState(0);

  useEffect(() => {
    // Subscribing to orders
    const ordersRef = collection(db, "orders");
    const unsubscribeOrders = onSnapshot(ordersRef, (snapshot) => {
      setOrders(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    // Subscribing to active cards count
    const cardsRef = query(
      collection(db, "cards"),
      where("active", "==", true)
    );
    const unsubscribeCards = onSnapshot(cardsRef, (snapshot) => {
      setActiveCardCount(snapshot.size);
    });

    // Cleanup function to unsubscribe from the listeners
    return () => {
      unsubscribeOrders();
      unsubscribeCards();
    };
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const orderDocRef = doc(db, "orders", orderId);
    await updateDoc(orderDocRef, {
      status: newStatus,
    });
  };

  // Function to generate a random 10-digit card number
  function generateRandomCardNumber() {
    return Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
  }

  // Function to check and add a card if it does not exist
  async function createUniqueCard() {
    const randomCardNumber = generateRandomCardNumber();
    const cardsQuery = query(
      collection(db, "cards"),
      where("cardnumber", "==", randomCardNumber)
    );

    const q = await getDocs(cardsQuery);
    // Check if card number exists
    if (q.docs.length > 0) {
      console.log("Card number already exists, generating a new one...");
      return createUniqueCard(); // Recursively generate a new number if found
    }

    // Define possible balances
    const possibleBalances = [1000, 5000, 10000, 20000];
    const randomBalance =
      possibleBalances[Math.floor(Math.random() * possibleBalances.length)];

    // Add the card to the database
    await addDoc(collection(db, "cards"), {
      cardnumber: randomCardNumber,
      balance: randomBalance,
      active: true,
    });

    console.log(
      `Card with number ${randomCardNumber} added with balance $${randomBalance}`
    );
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ maxWidth: "100%" }} aria-label="order details table">
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Total Price (Nakfa)</TableCell>
              <TableCell>Order Note</TableCell>
              <TableCell>Items Ordered</TableCell>
              <TableCell>Order Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell component="th" scope="row">
                  {order.name}
                </TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell>{`${order.street}, ${order.city}, ${order.postalCode}, ${order.country}`}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{order.orderNote}</TableCell>
                <TableCell>
                  <List>
                    {order.items.map((item) => (
                      <ListItem key={item.id}>
                        <ListItemAvatar>
                          <Avatar src={item.imageurl} alt={item.description} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.description}
                          secondary={`Quantity: ${item.quantity} - Price: £${item.price}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          width: "90%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}>
        <StyledButton onClick={() => createUniqueCard()}>
          Generate New Cards
        </StyledButton>
        <Typography variant="h4">
          Available Active Cards: {activeCardCount}
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderAdmin;

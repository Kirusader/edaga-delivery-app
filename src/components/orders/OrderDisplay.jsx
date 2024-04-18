/** @format */

import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
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
} from "@mui/material";
const OrderDisplay = () => {
  const [orders, setOrders] = useState([]);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    async function getOrders() {
      const ordersCollectionRef = await query(
        collection(db, "orders"),
        where("uid", "==", user?.uid)
      );
      const unsubscribe = onSnapshot(ordersCollectionRef, (snapshot) => {
        setOrders(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });

      return () => unsubscribe();
    }
    getOrders();
  }, []);
  console.log(orders);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ maxWidth: "100%" }} aria-label="order details table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Total Price (£)</TableCell>
            <TableCell>Order Note</TableCell>
            <TableCell>Items Ordered</TableCell>
            <TableCell>Order Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
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
              <TableCell>{order.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderDisplay;

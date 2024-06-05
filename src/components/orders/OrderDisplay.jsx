/** @format */

import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import personIcon from "../../assets/person.svg";
import driverIcon from "../../assets/driver.svg";
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
  Box,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";
import {
  GoogleMap,
  MarkerF,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
const libraries = ["places"];
const OrderDisplay = () => {
  const [orders, setOrders] = useState([]);
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [customerAddress, setCustomerAddress] = useState(null);
  const [address, setAddress] = useState("");
  const [destinationPosition, setDestinationPosition] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);
  const [user] = useAuthState(auth);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBE5toRhLbV5gPCwpGCM-jyPz1o7a7NEEM",
    libraries,
  });
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
  useEffect(() => {
    if (user) {
      // Define the query to search for the orders associated with the user
      const orderRef = collection(db, "orders");
      const orderQueryRef = query(
        orderRef,
        where("uid", "==", user?.uid),
        where("status", "==", "collected")
      );

      // Listen for real-time updates using the order query
      const orderUnsubscribe = onSnapshot(
        orderQueryRef,
        (orderQuerySnapshot) => {
          if (!orderQuerySnapshot.empty) {
            const orderData = orderQuerySnapshot.docs[0].data();

            setRiderLocation({ lat: orderData.lat, lng: orderData.lng });
            setCustomerAddress(
              `${orderData.street},${orderData.postalCode},${orderData.city},${orderData.country}`
            );
          } else {
            setRiderLocation(null);
          }
        },
        (orderError) => {
          console.error("Firestore error:", orderError);
        }
      );

      return () => {
        orderUnsubscribe();
      };
    }
  }, [user]);
  useEffect(() => {
    if (!isLoaded) return;
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
        }
      );
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !position || !riderLocation) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: riderLocation }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          console.log("No results found");
        }
      } else {
        console.log("Geocoder failed due to: " + status);
      }
    });
  }, [position, isLoaded, riderLocation]);
  useEffect(() => {
    if (!isLoaded || !customerAddress) return;

    // Initialize the Geocoder
    const geocoder = new window.google.maps.Geocoder();

    // Call the geocode method with the address
    geocoder.geocode({ address: customerAddress }, (results, status) => {
      if (status === "OK") {
        // Extract latitude and longitude from the first result
        const location = results[0].geometry.location;
        const latitude = location.lat();
        const longitude = location.lng();

        // Set the destination position to the obtained latitude and longitude
        setDestinationPosition({ lat: latitude, lng: longitude });
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  }, [isLoaded, customerAddress]);

  let options;
  if (isLoaded) {
    options = {
      zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT,
        // ...otherOptions
      },
    };
  }

  if (!isLoaded || !position) {
    return <CircularProgress />;
  }
  async function viewOrderLocation() {
    const directionsService = new google.maps.DirectionsService();
    if (!position || !riderLocation) return;
    const results = await directionsService.route({
      origin: address,
      destination: customerAddress,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
  }

  const handleLoad = (mapInstance) => {
    setMap(mapInstance);
  };
  const handleUnmount = () => {
    setMap(null);
    console.log("Map unmounted");
  };

  return (
    <>
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
                <TableCell component="th" scope="row">
                  {order.orderId}
                </TableCell>
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
      {orders.length > 0 && riderLocation !== null && (
        <Box>
          <Button variant="contained" color="success" onClick={() => viewOrderLocation()} sx={{m:4,marginBottom:0}}>
            <Typography variant="subtitle2">View Order Location</Typography>
          </Button>
        </Box>
      )}

      <Box sx={{ mx: "auto", my: 4 }}>
        <Box
          sx={{
            height: "50vh",
            width: "100%",
          }}>
          <GoogleMap
            center={
              directionsResponse
                ? {
                    lat:
                      (directionsResponse.routes[0].legs[0].end_location.lat() +
                        directionsResponse.routes[0].legs[0].start_location.lat()) /
                      2,
                    lng:
                      (directionsResponse.routes[0].legs[0].end_location.lng() +
                        directionsResponse.routes[0].legs[0].start_location.lng()) /
                      2,
                  }
                : { lat: 53.48, lng: -2.24 }
            }
            zoom={13}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            onLoad={handleLoad}
            onUnmount={handleUnmount}
            options={{
              streetViewControl: true,
              scaleControl: true,
              mapTypeControl: true,
              panControl: true,
              rotateControl: true,
              fullscreenControl: true,
            }}>
            {orders.length > 0 &&
              riderLocation !== null &&
              directionsResponse &&
              destinationPosition && (
                <DirectionsRenderer
                  directions={directionsResponse}
                  options={{
                    markerOptions: { icon: personIcon },
                    polylineOptions: {
                      strokeColor: "#FF0000",
                      strokeOpacity: 0.8,
                      strokeWeight: 4,
                    },
                    suppressMarkers: true,
                    suppressInfoWindows: true,
                  }}
                />
              )}
            {directionsResponse && (
              <MarkerF position={riderLocation} icon={driverIcon} />
            )}
            {directionsResponse && (
              <MarkerF position={destinationPosition} icon={personIcon} />
            )}
          </GoogleMap>
        </Box>
      </Box>
    </>
  );
};

export default OrderDisplay;

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

import { useLocationData } from "../../store/LocationContext";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
const libraries = ["places"];
const OrderDisplay = () => {
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState([]);
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [address, setAddress] = useState("");
  const [destinationPosition, setDestinationPosition] = useState(null);
  const [user, loading, error] = useAuthState(auth);
  const { locationInfo } = useLocationData();
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
    async function getActiveOrder() {
      if (!locationInfo) return;
      const ordersCollectionRef = await query(
        collection(db, "orders"),
        where("driverId", "==", locationInfo.riderId)
      );
    }
    getActiveOrder();
  }, [locationInfo]);
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
    if (!isLoaded || !position) return; // Check if API is loaded and position is available

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: locationInfo.location }, (results, status) => {
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
  }, [position, isLoaded]);
  useEffect(() => {
    if (!directionsResponse) return;

    const geocoder = new window.google.maps.Geocoder();
    const end_address = directionsResponse.routes[0].legs[0].end_address;
    geocoder.geocode({ address: end_address }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          setDestinationPosition({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          });
        } else {
          console.log("No results found");
        }
      } else {
        console.log("Geocoder failed due to: " + status);
      }
    });
  }, [directionsResponse]);

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
    const results = await directionsService.route({
      origin: address,
      destination: "344 Great Western Street, Mosside, Manchester M18 7HJ, UK",
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  const handleLoad = (mapInstance) => {
    setMap(mapInstance);
  };
  const handleUnmount = () => {
    setMap(null);
    console.log("Map unmounted");
  };
  console.log(locationInfo.location);
  console.log(locationInfo);
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
      <Box>
        <Button onClick={() => viewOrderLocation()}>
          <Typography variant="subtitle2">View Order Location</Typography>
        </Button>
      </Box>
      <Box sx={{ mx: "auto", my: 4 }}>
        <Box
          sx={{
            height: "50vh", // Adjusted for demonstration
            width: "100%", // Use 100% to fill the container width
          }}>
          <GoogleMap
            center={{ lat: 53.48, lng: -2.24 }}
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
            {directionsResponse && destinationPosition && (
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
              <MarkerF position={locationInfo.location} icon={driverIcon} />
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

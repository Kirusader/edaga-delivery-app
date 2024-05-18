/** @format */

import personIcon from "../assets/person.svg";
import restaurantIcon from "../assets/restaurant.svg";
import { useEffect, useState } from "react";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import {
  Grid,
  Box,
  Button,
  CircularProgress,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
} from "@mui/material";
import RiderToCompany from "./ui/RiderToCompany";
import RiderToCustomer from "./ui/RiderToCustomer";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebaseConfig";

const libraries = ["places"];

const RiderPage2 = () => {
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [address, setAddress] = useState("");
  const [destinationPosition, setDestinationPosition] = useState(null);
  const [open, setOpen] = useState(false);
  const [isRiderActive, setIsRiderActive] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [collectedOrders, setCollectedOrders] = useState([]);
  const [deliverToCustomer, setDeliverToCustomer] = useState(false);
  const [customerAddress, setCustomerAddress] = useState(null);
  const [companyAddress, setCompanyAddress] = useState(null);
  const [user] = useAuthState(auth);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBE5toRhLbV5gPCwpGCM-jyPz1o7a7NEEM",
    libraries,
  });

  useEffect(() => {
    if (!isLoaded) return;
    const myGeocoder = new window.google.maps.Geocoder();
    const storeAddress = "104 Greame Street,M14 4RN, Manchester, UK";
    myGeocoder.geocode({ address: storeAddress }, (results, status) => {
      if (status === "OK" && results[0]) {
        setCompanyAddress({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        });
      }
    });
  }, [isLoaded]);

  useEffect(() => {
    if (user) {
      const usersRef = collection(db, "users");
      const userQueryRef = query(usersRef, where("uid", "==", user.uid));
      const userUnsubscribe = onSnapshot(userQueryRef, (userQuerySnapshot) => {
        if (!userQuerySnapshot.empty) {
          const userData = userQuerySnapshot.docs[0].data();
          setIsRiderActive(userData.isActive);
        }
      });
      const orderRef = collection(db, "orders");
      const orderQueryRef = query(orderRef, where("driverId", "==", user.uid));
      const orderUnsubscribe = onSnapshot(
        orderQueryRef,
        (orderQuerySnapshot) => {
          if (!orderQuerySnapshot.empty) {
            const orderData = orderQuerySnapshot.docs[0].data();
            setDeliverToCustomer(orderData.deliverToCustomer);
          }
        }
      );
      return () => {
        userUnsubscribe();
        orderUnsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    if (!isRiderActive) {
      const q = query(collection(db, "orders"), where("driverId", "==", null));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
      });
      return () => unsubscribe();
    }
  }, [isRiderActive]);

  useEffect(() => {
    if (user) {
      const ordersQuery = query(
        collection(db, "orders"),
        where("driverId", "==", user.uid),
        where("status", "==", "pending")
      );
      const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (ordersData.length > 0) {
          setActiveOrders(ordersData);
          const firstOrder = ordersData[0];
          setCustomerAddress(
            `${firstOrder.street || ""},${firstOrder.postalCode || ""},${
              firstOrder.city || ""
            },${firstOrder.country || ""}`
          );
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const ordersQuery = query(
        collection(db, "orders"),
        where("driverId", "==", user.uid),
        where("status", "==", "collected")
      );
      const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (ordersData.length > 0) {
          setCollectedOrders(ordersData);
          const firstOrder = ordersData[0];
          setCustomerAddress(
            `${firstOrder.street || ""},${firstOrder.postalCode || ""},${
              firstOrder.city || ""
            },${firstOrder.country || ""}`
          );
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (orders.length > 0 && !isRiderActive) {
      setOpen(true);
    }
  }, [orders, isRiderActive]);

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
        (err) => console.error(err)
      );
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !position) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: position }, (results, status) => {
      if (status === "OK" && results[0]) {
        setAddress(results[0].formatted_address);
      }
    });
  }, [position, isLoaded]);

  useEffect(() => {
    if (!isLoaded || collectedOrders.length === 0) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: customerAddress }, (results, status) => {
      if (status === "OK" && results[0]) {
        setDestinationPosition({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        });
      }
    });
  }, [collectedOrders, isLoaded]);

  useEffect(() => {
    async function calculateRoute() {
      if (!address || !isLoaded) return;
      const directionsService = new google.maps.DirectionsService();
      let results;
      if (isRiderActive && !deliverToCustomer) {
        results = await directionsService.route({
          origin: address,
          destination: "112 Greame Street,M14 4RN, Manchester, UK",
          travelMode: google.maps.TravelMode.DRIVING,
        });
        setDirectionsResponse(results);
        fitBoundsToRoute(results);
      } else if (deliverToCustomer) {
        if (!customerAddress || !address) return;
        results = await directionsService.route({
          origin: address,
          destination: customerAddress,
          travelMode: google.maps.TravelMode.DRIVING,
        });
        setDirectionsResponse(results);
        fitBoundsToRoute(results);
      }
    }
    calculateRoute();
  }, [address, isLoaded, customerAddress]);

  const fitBoundsToRoute = (results) => {
    if (!results || !map) return;
    const bounds = new window.google.maps.LatLngBounds();
    results.routes[0].legs.forEach((leg) => {
      bounds.extend(leg.start_location);
      bounds.extend(leg.end_location);
    });
    console.log("Fitting bounds to:", bounds);
    map.fitBounds(bounds);
  };

  useEffect(() => {
    const getPosition = async () => {
      if (position) {
        const ordersQuery = query(
          collection(db, "orders"),
          where("driverId", "==", user.uid),
          where("status", "==", "collected")
        );
        const unsubscribe = onSnapshot(ordersQuery, async (querySnapshot) => {
          querySnapshot.forEach(async (snapshot) => {
            const orderDocId = snapshot.id;
            const orderDocRef = doc(db, "orders", orderDocId);
            try {
              await updateDoc(orderDocRef, {
                lat: position.lat,
                lng: position.lng,
              });
            } catch (error) {
              console.error("Failed to update order:", error);
            }
          });
        });
        return unsubscribe;
      }
    };
    getPosition();
  }, [db, user, position]);

  if (!isLoaded || !position) {
    return <CircularProgress />;
  }

  const handleLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const handleUnmount = () => {
    setMap(null);
  };

  const acceptOrder = async (orderId) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      driverId: user.uid,
    });
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDocId = querySnapshot.docs[0].id;
      const userDocRef = doc(db, "users", userDocId);
      await updateDoc(userDocRef, {
        isActive: true,
      });
      setIsRiderActive(true);
      setOpen(false);
    }
    window.location.reload();
  };

  const handleCollect = async () => {
    const orderRef = collection(db, "orders");
    const q = query(orderRef, where("driverId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const orderDocId = querySnapshot.docs[0].id;
      const orderDocRef = doc(db, "orders", orderDocId);
      await updateDoc(orderDocRef, {
        status: "collected",
        deliverToCustomer: true,
      });
    }
    window.location.reload();
  };

  const handleDeliver = async (orderId) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: "delivered",
        deliverToCustomer: false,
        lat: 0,
        lng: 0,
      });
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDocId = querySnapshot.docs[0].id;
        const userDocRef = doc(db, "users", userDocId);
        await updateDoc(userDocRef, {
          isActive: false,
        });
        setIsRiderActive(false);
        setOpen(false);
      }
    } catch (error) {
      console.error("Failed to deliver order:", error);
    }
    window.location.reload();
  };

  return (
    <Box sx={{ mx: "auto", my: 4 }}>
      <Box sx={{ height: "60vh", width: "100%" }}>
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
          zoom={10}
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
          <MarkerF
            position={position}
            icon={personIcon}
            onClick={() => setShowInfoWindow(true)}>
            {showInfoWindow && (
              <InfoWindowF position={position}>
                <Typography>
                  Current position Latitude: {position.lat}, Longitude:{" "}
                  {position.lng}
                </Typography>
                <Button onClick={() => setShowInfoWindow(false)}>Close</Button>
              </InfoWindowF>
            )}
          </MarkerF>
          {directionsResponse && (
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
            <MarkerF position={position} icon={personIcon} />
          )}
          {directionsResponse && (
            <MarkerF
              position={
                isRiderActive && !deliverToCustomer
                  ? companyAddress
                  : destinationPosition
              }
              icon={restaurantIcon}
            />
          )}
        </GoogleMap>
      </Box>
      <Box sx={{ width: "100%", mt: 2 }}>
        {deliverToCustomer ? (
          <RiderToCustomer
            order={collectedOrders[0]}
            handleDeliver={handleDeliver}
          />
        ) : (
          <>
            <Dialog
              open={!isRiderActive && open && orders.length > 0}
              onClose={() => setOpen(false)}>
              <DialogTitle sx={{ alignSelf: "center" }}>
                Available Orders
              </DialogTitle>
              <DialogContent>
                <List>
                  {orders.length > 0 && !isRiderActive ? (
                    <ListItem>
                      <Grid
                        container
                        direction={"column"}
                        alignItems={"center"}>
                        <Grid item>
                          <Typography variant="h4">
                            Customer Location
                          </Typography>
                        </Grid>
                        <Grid item>
                          {" "}
                          <Typography variant="h6" sx={{ my: 4 }}>
                            {orders[0].street},{orders[0].postalCode},
                            {orders[0].city}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="subititle1">
                            Total Item in the Order:
                            <span style={{ alignSelf: "center" }}>
                              {" "}
                              {orders[0].items[0].quantity}
                            </span>
                          </Typography>
                        </Grid>
                        <Grid item> </Grid>
                      </Grid>
                    </ListItem>
                  ) : (
                    <ListItem>
                      <Typography>
                        {isRiderActive
                          ? "You have already accepted an order. Complete this delivery first!"
                          : "No available orders"}
                      </Typography>
                    </ListItem>
                  )}
                </List>
              </DialogContent>
              <DialogActions>
                <Button
                  sx={{ marginRight: 4 }}
                  variant="contained"
                  color="success"
                  onClick={() => {
                    acceptOrder(orders[0].id);
                  }}>
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setOpen(false)}
                  color="primary">
                  Reject Order
                </Button>
              </DialogActions>
            </Dialog>
            {!isRiderActive && orders.length === 0 && (
              <Box sx={{ m: 2 }}>
                <Typography variant="h6" align="center">
                  There are no available orders. We are searching...
                </Typography>
              </Box>
            )}
            {activeOrders.length > 0 && !deliverToCustomer && isRiderActive && (
              <RiderToCompany
                order={activeOrders[0]}
                handleCollect={handleCollect}
              />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default RiderPage2;

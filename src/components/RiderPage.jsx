/** @format */

import personIcon from "../assets/person.svg";
import restaurantIcon from "../assets/restaurant.svg";
import { useEffect, useState, useCallback } from "react";
import {
  GoogleMap,
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
  limit,
  orderBy,
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

const RiderPage = () => {
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
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
  const [mapKey, setMapKey] = useState(0);
  const [directionsKey, setDirectionsKey] = useState(0);
  const [showDirections, setShowDirections] = useState(true);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [user] = useAuthState(auth);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBE5toRhLbV5gPCwpGCM-jyPz1o7a7NEEM",
    libraries,
    region: "UK",
    language: "en",
  });

  const fetchCompanyAddress = useCallback(() => {
    if (!isLoaded) return;
    const geocoder = new window.google.maps.Geocoder();
    const storeAddress = "104 Greame Street, M14 4RN, Manchester, UK";
    geocoder.geocode({ address: storeAddress }, (results, status) => {
      if (status === "OK" && results[0]) {
        setCompanyAddress({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        });
      } else {
        console.error("Geocode error: ", status);
      }
    });
  }, [isLoaded]);

  const fetchUserData = useCallback(() => {
    if (!user) return;
    const usersRef = collection(db, "users");
    const userQueryRef = query(usersRef, where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(userQueryRef, (snapshot) => {
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        setIsRiderActive(userData.isActive);
      }
    });
    return unsubscribe;
  }, [user]);

  const fetchLatestOrder = useCallback(() => {
    if (!user) return;
    const orderRef = collection(db, "orders");
    const orderQueryRef = query(
      orderRef,
      where("driverId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const unsubscribe = onSnapshot(orderQueryRef, (snapshot) => {
      if (!snapshot.empty) {
        const orderData = snapshot.docs[0].data();
        setDeliverToCustomer(orderData.deliverToCustomer);
        setActiveOrderId(orderData.orderId);
      }
    });
    return unsubscribe;
  }, [user]);

  const fetchAvailableOrders = useCallback(() => {
    if (isRiderActive) return;
    const q = query(collection(db, "orders"), where("driverId", "==", null));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
    });
    return unsubscribe;
  }, [isRiderActive]);

  const fetchPendingOrders = useCallback(() => {
    if (!user) return;
    const ordersQuery = query(
      collection(db, "orders"),
      where("driverId", "==", user.uid),
      where("status", "==", "pending"),
      where("orderId", "==", activeOrderId),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
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
    return unsubscribe;
  }, [user, activeOrderId]);

  const fetchCollectedOrders = useCallback(() => {
    if (!user) return;
    const ordersQuery = query(
      collection(db, "orders"),
      where("driverId", "==", user.uid),
      where("status", "==", "collected"),
      where("orderId", "==", activeOrderId),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
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
    return unsubscribe;
  }, [user, activeOrderId]);

  useEffect(() => {
    fetchCompanyAddress();
  }, [fetchCompanyAddress]);

  useEffect(() => {
    const unsubscribeUser = fetchUserData();
    return () => unsubscribeUser && unsubscribeUser();
  }, [fetchUserData]);

  useEffect(() => {
    const unsubscribeOrder = fetchLatestOrder();
    return () => unsubscribeOrder && unsubscribeOrder();
  }, [fetchLatestOrder]);

  useEffect(() => {
    const unsubscribeAvailableOrders = fetchAvailableOrders();
    return () => unsubscribeAvailableOrders && unsubscribeAvailableOrders();
  }, [fetchAvailableOrders]);

  useEffect(() => {
    const unsubscribePendingOrders = fetchPendingOrders();
    return () => unsubscribePendingOrders && unsubscribePendingOrders();
  }, [fetchPendingOrders]);

  useEffect(() => {
    const unsubscribeCollectedOrders = fetchCollectedOrders();
    return () => unsubscribeCollectedOrders && unsubscribeCollectedOrders();
  }, [fetchCollectedOrders]);

  useEffect(() => {
    if (orders.length > 0 && !isRiderActive) {
      setOpen(true);
    }
  }, [orders, isRiderActive]);

  useEffect(() => {
    if (!isLoaded) return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
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
      } else {
        console.error("Geocode error: ", status);
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
      } else {
        console.error("Geocode error: ", status);
      }
    });
  }, [collectedOrders, isLoaded, customerAddress]);

  useEffect(() => {
    const calculateRoute = async () => {
      if (!address || !isLoaded) return;
      const directionsService = new google.maps.DirectionsService();
      try {
        let results;
        if (isRiderActive && !deliverToCustomer) {
          results = await directionsService.route({
            origin: address,
            destination: "112 Greame Street, M14 4RN, Manchester, UK",
            travelMode: google.maps.TravelMode.DRIVING,
          });
        } else if (deliverToCustomer && customerAddress) {
          results = await directionsService.route({
            origin: address,
            destination: customerAddress,
            travelMode: google.maps.TravelMode.DRIVING,
          });
        }
        if (results) {
          setDirectionsResponse(results);
          setDirectionsKey((prevKey) => prevKey + 1);
          fitBoundsToRoute(results);
        }
      } catch (error) {
        console.error("Error calculating route:", error);
      }
    };
    calculateRoute();
  }, [address, isLoaded, customerAddress, isRiderActive, deliverToCustomer]);

  const fitBoundsToRoute = (results) => {
    if (!results || !map) return;
    const bounds = new window.google.maps.LatLngBounds();
    results.routes[0].legs.forEach((leg) => {
      bounds.extend(leg.start_location);
      bounds.extend(leg.end_location);
    });
    map.fitBounds(bounds);
  };

  useEffect(() => {
    const updateOrderPosition = async () => {
      if (position && activeOrderId) {
        const ordersQuery = query(
          collection(db, "orders"),
          where("driverId", "==", user.uid),
          where("status", "==", "collected"),
          where("orderId", "==", activeOrderId)
        );
        const unsubscribe = onSnapshot(ordersQuery, async (snapshot) => {
          for (const docSnapshot of snapshot.docs) {
            const orderDocRef = doc(db, "orders", docSnapshot.id);
            try {
              await updateDoc(orderDocRef, {
                lat: position.lat,
                lng: position.lng,
              });
            } catch (error) {
              console.error("Failed to update order:", error);
            }
          }
        });
        return unsubscribe;
      }
    };
    updateOrderPosition();
  }, [position, user, activeOrderId]);

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
    setMapKey((prevKey) => prevKey + 1);
    setDirectionsKey((prevKey) => prevKey + 1);
    setShowDirections(true);
  };

  const handleCollect = async () => {
    const orderRef = collection(db, "orders");
    const q = query(
      orderRef,
      where("driverId", "==", user.uid),
      where("status", "==", "pending"),
      where("orderId", "==", activeOrderId),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const orderDocId = querySnapshot.docs[0].id;
      const orderDocRef = doc(db, "orders", orderDocId);
      await updateDoc(orderDocRef, {
        status: "collected",
        deliverToCustomer: true,
      });
      console.log("Order collected:", orderDocId);
    }
    setMapKey((prevKey) => prevKey + 1);
    setDirectionsKey((prevKey) => prevKey + 1);
    console.log(
      "Map and Directions keys updated after collect:",
      mapKey,
      directionsKey
    );
  };

  const handleDeliver = async () => {
    try {
      const orderRef = collection(db, "orders");
      const orderQuery = query(
        orderRef,
        where("driverId", "==", user.uid),
        where("status", "==", "collected"),
        where("orderId", "==", activeOrderId),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const querySnapshotOrder = await getDocs(orderQuery);
      if (!querySnapshotOrder.empty) {
        const orderDocId = querySnapshotOrder.docs[0].id;
        const orderDocRef = doc(db, "orders", orderDocId);
        await updateDoc(orderDocRef, {
          status: "delivered",
          deliverToCustomer: false,
          lat: 0,
          lng: 0,
        });
      }
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
      setMapKey((prevKey) => prevKey + 1);
      setDirectionsKey((prevKey) => prevKey + 1);
      setShowDirections(false);
    } catch (error) {
      console.error("Failed to deliver order:", error);
      alert(
        "An error occurred while trying to deliver the order. Please try again."
      );
    }
  };

  return (
    <Box sx={{ mx: "auto", my: 4 }}>
      <Box sx={{ height: "60vh", width: "100%" }}>
        <GoogleMap
          key={mapKey}
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
          {showDirections && directionsResponse && (
            <DirectionsRenderer
              key={directionsKey}
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
                          <Typography variant="h6" sx={{ my: 4 }}>
                            {orders[0].street},{orders[0].postalCode},
                            {orders[0].city}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="subtitle1">
                            Total Item in the Order:
                            <span style={{ alignSelf: "center" }}>
                              {orders[0].items[0].quantity}
                            </span>
                          </Typography>
                        </Grid>
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

export default RiderPage;

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
  doc,
  getDocs,
} from "firebase/firestore";
import {
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
import { useLocationData } from "../store/LocationContext";
const libraries = ["places"];
const RiderPage = () => {
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [address, setAddress] = useState("");
  const [destinationPosition, setDestinationPosition] = useState(null);
  const [open, setOpen] = useState(true);
  const [isRiderActive, setIsRiderActive] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [collectedOrders, setCollectedOrders] = useState([]);
  const [deliverToCustomer, setDeliverToCustomer] = useState(
    localStorage.getItem("deliverToCustomer") === "false"
  );
  const { locationInfo, setLocationInfo } = useLocationData();
  const [user] = useAuthState(auth);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBE5toRhLbV5gPCwpGCM-jyPz1o7a7NEEM",
    libraries,
  });
  useEffect(() => {
    if (user) {
      // Define the query to search for the user document by the uid field
      const usersRef = collection(db, "users");
      const queryRef = query(usersRef, where("uid", "==", user.uid));

      // Listen for real-time updates using the defined query
      const unsubscribe = onSnapshot(
        queryRef,
        (querySnapshot) => {
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            console.log("User data found:", userData);
            setIsRiderActive(userData.isActive);
          } else {
            console.error("No user document found for UID:", user.uid);
            setIsRiderActive(false);
          }
        },
        (error) => {
          console.error("Firestore error:", error);
        }
      );
      return () => unsubscribe();
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

        setActiveOrders(ordersData);
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

        setCollectedOrders(ordersData);
      });

      return () => unsubscribe();
    }
  }, [user]);
  const handleClose = () => {
    setOpen(false);
  };

  const acceptOrder = async (orderId) => {
    // Reference to the order to update the driverId
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      driverId: user.uid,
    });

    // Query to find the user's document by UID
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    // Check if we found the user document
    if (!querySnapshot.empty) {
      const userDocId = querySnapshot.docs[0].id; // Get the document ID
      const userDocRef = doc(db, "users", userDocId); // Reference to the user document

      // Update the user's isActive status
      await updateDoc(userDocRef, {
        isActive: true,
      });

      setIsRiderActive(true);

      handleClose();
      localStorage.setItem("deliverToCustomer", "false");
    } else {
      console.error("User not found");
    }
  };
  const handleCollect = async () => {
    const orderRef = collection(db, "orders");
    const q = query(orderRef, where("driverId", "==", user.uid));
    const querySnapshot = await getDocs(q);

    // Check if we found the user document
    if (!querySnapshot.empty) {
      const orderDocId = querySnapshot.docs[0].id;
      const orderDocRef = doc(db, "orders", orderDocId);

      // Update the order's status
      await updateDoc(orderDocRef, {
        status: "collected",
      });
      setDeliverToCustomer(true);
      localStorage.setItem("deliverToCustomer", "true");
    }
  };

  const handleDeliver = async (orderId) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      // Update the order status to 'delivered'
      await updateDoc(orderRef, {
        status: "delivered",
      });

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDocId = querySnapshot.docs[0].id;
        const userDocRef = doc(db, "users", userDocId);

        // Update the user's isActive status to false
        await updateDoc(userDocRef, {
          isActive: false,
        });

        console.log("Order delivered and user deactivated.");
        localStorage.setItem("deliverToCustomer", "false");
        setIsRiderActive(false);
        handleClose();
      } else {
        console.error("User document not found.");
      }
    } catch (error) {
      console.error("Failed to deliver order:", error);
    }
  };

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
    geocoder.geocode({ location: position }, (results, status) => {
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
  useEffect(() => {
    if (!isLoaded || !position) return;
    setLocationInfo({
      location: position,
      riderId: user.uid,
    });
    console.log("LocationInfo updated in RiderPage2:", locationInfo);
  }, [isLoaded, position]);
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
  async function calculateRouteToCompany() {
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
  async function calculateRouteToCustomer() {
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: address,
      destination: "230A Mile End Road,London,E1 4LJ,UK",
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

  console.log(deliverToCustomer);
  console.log(locationInfo);
  return (
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
            <MarkerF position={position} icon={personIcon} />
          )}
          {directionsResponse && (
            <MarkerF position={destinationPosition} icon={restaurantIcon} />
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
              open={!isRiderActive && open}
              onClose={() => setOpen(false)}>
              <DialogTitle>Available Orders</DialogTitle>
              <DialogContent>
                <List>
                  {orders.length > 0 && !isRiderActive ? (
                    <ListItem>
                      <Typography>
                        Order #{orders[0].orderId}: {orders[0].total} -{" "}
                        {orders[0].city}
                        <Button
                          onClick={() => {
                            acceptOrder(orders[0].id);
                            calculateRouteToCompany();
                          }}>
                          Accept
                        </Button>
                      </Typography>
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
                <Button onClick={() => setOpen(false)} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            {activeOrders.length > 0 && !deliverToCustomer && (
              <RiderToCompany
                order={activeOrders[0]}
                handleCollect={handleCollect}
                calculateRouteToCustomer={calculateRouteToCustomer}
              />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default RiderPage;

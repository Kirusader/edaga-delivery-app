/** @format */

import React, { useContext, useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Pagination,
  IconButton,
  Snackbar,
} from "@mui/material";
import { AddShoppingCart as AddShoppingCartIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import CartContext from "../../store/CartContext";
import { useNavigate } from "react-router-dom";
export default function Stationary() {
  const theme = useTheme();
  const [stationaries, setStationaries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    backgroundColor: "",
  });
  const navigate = useNavigate();
  const itemsPerPage = 9;
  const stationaryCollectionRef = collection(db, "stationary");
  const CartCtxt = useContext(CartContext);
  useEffect(() => {
    const unsubscribe = onSnapshot(stationaryCollectionRef, (snapshot) => {
      setStationaries(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const pageCount = Math.ceil(stationaries.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStationaries = stationaries.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleCardSelect = (id) => {
    setSelectedCard(id);
  };
  return (
    <Grid
      container
      direction={"column"}
      alignItems={"center"}
      sx={{ width: "90%", mx: "auto", marginBottom: 2 }}>
      <Grid item sx={{ width: "90%", textAlign: "left" }}>
        <Typography variant="h2" component={"div"}>
          All Offers
        </Typography>
      </Grid>
      <Grid item sx={{ my: 2 }}>
        <Grid
          item
          container
          spacing={1}
          justifyContent={"space-around"}
          alignItems={"center"}>
          {currentStationaries.map((stationary) => (
            <Card
              key={stationary.id}
              sx={{
                my: 2,
                width: 350,
                height: 450,
                boxShadow: theme.shadows[13],
                borderRadius: 2,
                padding: "0.5em",
                transform:
                  selectedCard === stationary.id ? "scale(1.05)" : "none",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  cursor: "pointer",
                },
                [theme.breakpoints.down("sm")]: {
                  paddingTop: "0.5em",
                  paddingBottom: "0.5em",
                  paddingLeft: 0,
                  paddingRight: 0,
                  borderRadius: 0,
                },
              }}
              onClick={() => {
                handleCardSelect(stationary.id);
                navigate(`/product/${stationary.id}`);
              }}>
              <Grid item sx={{ my: 1 }}>
                <Grid item container direction={"column"}>
                  <Grid item>
                    <CardMedia
                      component="img"
                      height="240"
                      width="240"
                      image={stationary.imageurl}
                      alt={stationary.description}
                    />
                  </Grid>
                  <CardContent>
                    <Grid item>
                      <Typography
                        variant="h4"
                        component={"div"}
                        sx={{ maxWidth: "300", m: 1 }}>
                        {stationary.description}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Grid
                        item
                        container
                        justifyContent={"space-around"}
                        alignItems={"center"}>
                        <Grid item>
                          <ReactStars
                            count={5}
                            value={stationary.star}
                            size={24}
                            activeColor="#d4af37"
                            isHalf={true}
                          />
                        </Grid>
                        <Grid item>
                          <Typography variant="subtitle2">
                            Excellent ({Math.floor(stationary.star * 100)}
                            <sup>+</sup>)
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid
                        item
                        container
                        justifyContent={"space-around"}
                        alignItems={"center"}>
                        <Grid item>
                          <Typography variant="subtitle2">
                            {stationary.price} Nakifa
                          </Typography>
                        </Grid>
                        <Grid item>
                          <IconButton
                            onClick={() => {
                              CartCtxt.addItem(stationary);
                              setAlert({
                                open: true,
                                message: "Product added to cart successfully!",
                                backgroundColor: "#4BB543",
                              });
                            }}>
                            <AddShoppingCartIcon color="primary" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Grid>
      </Grid>
      <Snackbar
        open={alert.open}
        message={alert.message}
        ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setAlert({ ...alert, open: false })}
        autoHideDuration={2000}
      />
      <Grid item>
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Grid>
    </Grid>
  );
}

/** @format */

import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Container,
  Snackbar,
} from "@mui/material";
import RatingIcon from "@mui/icons-material/StarRate";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import CartContext from "../store/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    backgroundColor: "",
  });
  const cartCtx = useContext(CartContext);

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

    async function fetchData() {
      try {
        const allData = [];
        for (const name of collectionNames) {
          const querySnapshot = await getDocs(collection(db, name));
          allData.push(
            ...querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        }
        setProduct(allData.find((p) => p.id === id));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [id]);
  const handleAddToCart = () => {
    if (!isProductAdded(product.id)) {
      cartCtx.addItem(product);
      setAlert({
        open: true,
        message: "Item added to cart successfully!!",
        backgroundColor: "#4BB543",
      });
    } else {
      cartCtx.removeItem(product.id);
      setAlert({
        open: true,
        message: "Item removed from cart successfully!!",
        backgroundColor: "#FF3232",
      });
    }
  };

  const isProductAdded = (itemId) => {
    return cartCtx.items.some((item) => item.id === itemId);
  };
  return (
    <Container sx={{ py: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              image={product?.imageurl}
              alt={`Image of ${product?.description}`}
            />
          </Card>
        </Grid>
        <Snackbar
          open={alert.open}
          message={alert.message}
          ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={() => setAlert({ ...alert, open: false })}
          autoHideDuration={4000}
        />
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {product?.description}
              </Typography>
              <Box sx={{ my: 2, display: "flex", alignItems: "center" }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <RatingIcon
                    key={i}
                    sx={{ color: i < product?.star ? "gold" : "grey" }}
                  />
                ))}
                <Typography sx={{ ml: 1 }}>
                  {product ? `(${product.star})` : ""}
                </Typography>
              </Box>
              <Typography variant="h6">Price: ${product?.price}</Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => handleAddToCart()}>
                Add Item or Remove from Cart
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductDetail;

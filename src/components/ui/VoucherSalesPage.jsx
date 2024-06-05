/** @format */

import React, { useState } from "react";
import {
  Typography,
  Button,
  TextField,
  Grid,
  Container,
  Alert,
} from "@mui/material";
import { db } from "../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
const cardsImage =
  "https://res.cloudinary.com/drnarknab/image/upload/v1714834841/vouchercard_oe6lcr.png";

function VoucherSalesPage() {
  const [cardNumber, setCardNumber] = useState("");
  const [balance, setBalance] = useState(null);
  const [validity, setValidity] = useState(null);
  const [error, setError] = useState("");

  const handleCheckBalance = async () => {
    if (!cardNumber.trim()) {
      setError("Please enter a card number.");
      setBalance(null);
      setValidity(null);
      return;
    }

    const cardCollectionRef = query(
      collection(db, "cards"),
      where("cardnumber", "==", cardNumber.trim())
    );
    const querySnapshot = await getDocs(cardCollectionRef);

    if (!querySnapshot.empty) {
      const cardData = querySnapshot.docs[0].data();
      setBalance(
        `Your card has ${cardData.balance} Nakfa balance. Enjoy shopping with us!!`
      );
      setValidity("Your card is valid at the moment.");
      setError("");
    } else {
      setValidity(null);
      setBalance(null);
      setError("No card found with that number. Please check and try again.");
    }
  };

  return (
    <Container>
      <Grid
        container
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{ my: 2 }}>
        <Grid item>
          <Typography variant="h4" align="center" gutterBottom>
            Edaga Market Voucher Cards
          </Typography>
        </Grid>
        <Grid item>
          <img
            src={cardsImage}
            alt="Voucher Cards"
            height={"auto"}
            width={"90%"}
            style={{ alignSelf: "center", marginLeft: 16 }}
          />
        </Grid>
        <Grid item>
          <Typography
            variant="h4"
            align="center"
            sx={{ fontFamily: "Pacifico", my: 2 }}>
            Purchase a voucher card today and enjoy shopping with us!
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Check Your Card Balance
          </Typography>
          <TextField
            label="Card Number"
            variant="outlined"
            fullWidth
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCheckBalance}
            sx={{ mt: 2 }}>
            Check Balance
          </Button>
          {balance && (
            <Typography variant="h5" align="center" sx={{ mt: 2 }}>
              {balance}
            </Typography>
          )}
          {validity && <Typography variant="h5" align="center">{validity}</Typography>}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default VoucherSalesPage;

/** @format */

import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
const OrderDisplay = () => {
  const [orders, setOrders] = useState([]);
  const ordersCollectionRef = collection(db, "orders");
  useEffect(() => {
    const unsubscribe = onSnapshot(ordersCollectionRef, (snapshot) => {
      setOrders(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return () => unsubscribe();
  }, []);
  return <div>OrderDisplay</div>;
};

export default OrderDisplay;

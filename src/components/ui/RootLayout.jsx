/** @format */

import React from "react";
import { Outlet } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "./Header";
import Footer from "./Footer";
const RootLayout = () => {
  const [user, loading, error] = useAuthState(auth);
  return (
    <>
      <Header />

      <Outlet />
      <Footer />
    </>
  );
};

export default RootLayout;

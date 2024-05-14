/** @format */

import { ThemeProvider } from "@mui/material";
import theme from "./ui/theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Food from "./categories/Food";
import Stationary from "./categories/Stationary";
import HomeCare from "./categories/HomeCare";
import PersonalCare from "./categories/PersonalCare";
import BedBath from "./categories/BedBath";
import ElectricalAppliance from "./categories/ElectricalAppliance";
import Beverage from "./categories/Beverage";
import RegisterCompany from "./register/RegisterCompany";
import RegisterRider from "./register/RegisterRider";
import Contact from "./Contact";
import Register from "./usermanagement/Register";
import Login from "./usermanagement/Login";
import Reset from "./usermanagement/Reset";
import Logout from "./usermanagement/Logout";
import RootLayout from "./ui/RootLayout";
import { auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { CartContextProvider } from "../store/CartContext";
import OrderDisplay from "./orders/OrderDisplay";
import OrderAdmin from "./orders/OrderAdmin";
import ProductDetail from "./ProductDetail";
import RiderPage from "./RiderPage";
import VoucherSalesPage from "./ui/VoucherSalesPage";
import RiderPage2 from "./RiderPage2";
import { LocationProvider } from "../store/LocationContext";
function App() {
  const [user, loading, error] = useAuthState(auth);
  return (
    <ThemeProvider theme={theme}>
      <LocationProvider>
        <CartContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RootLayout />}>
                <Route path="/" element={<LandingPage />} />
                {user ? (
                  user.uid === import.meta.env.VITE_ADMIN ? (
                    <Route path="/admin" element={<OrderAdmin />} />
                  ) : user.uid === import.meta.env.VITE_RIDER ? (
                    <Route path="/riderpage" element={<RiderPage2 />} />
                  ) : (
                    <>
                      <Route path="/food" element={<Food />} />
                      <Route path="/stationary" element={<Stationary />} />
                      <Route path="/homecare" element={<HomeCare />} />
                      <Route path="/personalcare" element={<PersonalCare />} />
                      <Route path="/bedbath" element={<BedBath />} />
                      <Route
                        path="/electronicsappliance"
                        element={<ElectricalAppliance />}
                      />
                      <Route path="/beverages" element={<Beverage />} />
                      <Route
                        path="/registercompany"
                        element={<RegisterCompany />}
                      />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/orders" element={<OrderDisplay />} />
                      <Route path="/riderapply" element={<RegisterRider />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/card" element={<VoucherSalesPage />} />
                    </>
                  )
                ) : (
                  <>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/reset" element={<Reset />} />
                  </>
                )}
                <Route path="/logout" element={<Logout />} />
                <Route path="*" element={<LandingPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartContextProvider>
      </LocationProvider>
    </ThemeProvider>
  );
}

export default App;

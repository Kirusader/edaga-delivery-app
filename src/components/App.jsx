/** @format */

import { ThemeProvider } from "@mui/material";
import theme from "./ui/theme";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import CareerPage from "./CareerPage";
import HelpPage from "./HelpPage";
import AboutPage from "./AboutPage";
import ReturnPolicyPage from "./ui/ReturnPolicyPage.jsx";
import VisionPage from "./ui/VisionPage.jsx";
import TermsPage from "./ui/TermsPage.jsx";

const adminUIDs = [
  import.meta.env.VITE_ADMIN || "JdP7xcdJgZXTZnNXsZy8DflBqAv1",
  import.meta.env.VITE_ADMIN_FALLBACK || "GDVyKPKyLQYZWUSbBCY48qMMAKh2",
];

const riderUIDs = [
  import.meta.env.VITE_RIDER || "6BpfmiDB6dR35ieb5BG3guumHRI3",
  import.meta.env.VITE_RIDER_FALLBACK || "tLvvgeVWM1d3faKgyHpPuQEBfTH3",
];

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CartContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route path="/" element={<LandingPage />} />
              {user ? (
                <>
                  {adminUIDs.includes(user.uid) && (
                    <Route path="/admin" element={<OrderAdmin />} />
                  )}
                  {riderUIDs.includes(user.uid) && (
                    <Route path="/riderpage" element={<RiderPage />} />
                  )}
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
                  <Route path="/careers" element={<CareerPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/return" element={<ReturnPolicyPage />} />
                  <Route path="/vision" element={<VisionPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                </>
              ) : (
                <>
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/reset" element={<Reset />} />
                  <Route path="*" element={<Navigate to="/login" />} />
                </>
              )}
              <Route path="/logout" element={<Logout />} />
              <Route path="*" element={<LandingPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartContextProvider>
    </ThemeProvider>
  );
}

export default App;

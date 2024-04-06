/** @format */

import { ThemeProvider } from "@mui/material";
import theme from "./ui/theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./ui/Header";
import LandingPage from "./LandingPage";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

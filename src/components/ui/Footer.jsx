/** @format */

import { Button, Grid, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import AppStoreImg from "../../assets/appstore.jpg";
import PlayStoreImg from "../../assets/playstore.jpg";
import {
  Twitter,
  Facebook as FacebookIcon,
  Instagram,
  MusicNote,
} from "@mui/icons-material";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: "white",
  width: 80,
  height: 80,
}));
const categories = [
  { menu: "Bed & Bath", link: "/bedbath" },
  { menu: "Beverage", link: "/beverages" },
  { menu: "Electronics & Home Appliance", link: "/electronicsappliance" },
  { menu: "Food", link: "/food" },
  { menu: "Home Care", link: "/homecare" },
  { menu: "Personal Care", link: "/personalcare" },
  { menu: "Stationary", link: "/stationary" },
];
export default function Footer() {
  const navigate = useNavigate();
  return (
    <Grid
      container
      justifyContent={"space-around"}
      sx={{ backgroundColor: "#1a1d1d", width: "100%" }}>
      <Grid
        item
        sx={{
          backgroundColor: "#2e3333",
          color: "#fff",
          p: 2,
          my: 3,
          borderRadius: 3,
        }}>
        <Grid item container direction={"column"} justifyContent={"flex-start"}>
          <Grid item>
            <Typography variant="h3" component={"div"}>
              Categories
            </Typography>
          </Grid>
          {categories.map((category, index) => (
            <Grid item key={index}>
              <Button component={Link} to={category.link}>
                <Typography variant="subtitle1">{category.menu}</Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid
        item
        sx={{
          backgroundColor: "#2e3333",
          color: "#fff",
          p: 2,
          my: 3,
          borderRadius: 3,
        }}>
        <Grid item container direction={"column"}>
          <Grid item>
            <Typography variant="h3" component={"div"}>
              Join Us
            </Typography>
          </Grid>
          <Grid item>
            <Button component={Link} to="/registercompany">
              <Typography variant="subtitle1">Register your company</Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button component={Link} to="/riderapply">
              <Typography variant="subtitle1">Become a rider</Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button component={Link} to="/careers">
              <Typography variant="subtitle1">Careers</Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button component={Link} to="/contact">
              <Typography variant="subtitle1">Contact us</Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                navigate("/return");
              }}>
              <Typography variant="subtitle1">Return policy</Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        sx={{
          backgroundColor: "#2e3333",
          color: "#fff",
          p: 2,
          my: 3,
          borderRadius: 3,
        }}>
        <Grid
          item
          container
          direction={"column"}
          justifyContent={"center"}
          alignItems={"flex-start"}
          textAlign={"left"}>
          <Grid item>
            <Typography variant="h3" component={"div"}>
              Discover Edaga
            </Typography>
          </Grid>
          <Grid item>
            <Button component={Link} to="/about">
              <Typography variant="subtitle1">About us</Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button component={Link} to="/vision">
              <Typography variant="subtitle1">Vision</Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button component={Link} to="/terms">
              <Typography variant="subtitle1">Terms and conditions</Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button component={Link} to="/help">
              <Typography variant="subtitle1">FAQs</Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        sx={{
          backgroundColor: "#2e3333",
          color: "#fff",
          p: 2,
          my: 3,
          borderRadius: 3,
          maxWidth: 400,
        }}>
        <Grid item container direction={"column"}>
          <Grid item>
            <Grid item container direction={"column"}>
              <Grid item>
                <Typography variant="h3" component={"div"}>
                  {" "}
                  Connect with us
                </Typography>
              </Grid>
              <Grid
                item
                container
                justifyContent={"space-around"}
                alignItems={"center "}>
                <Grid item>
                  <StyledIconButton
                    rel="noopener noreferrer"
                    target="_blank"
                    component={Link}
                    to="http://www.twitter.com">
                    <Twitter />
                  </StyledIconButton>
                </Grid>
                <Grid item>
                  <StyledIconButton
                    rel="noopener noreferrer"
                    target="_blank"
                    component={Link}
                    to="http://www.facebook.com">
                    <FacebookIcon />
                  </StyledIconButton>
                </Grid>
                <Grid item>
                  <StyledIconButton
                    rel="noopener noreferrer"
                    target="_blank"
                    component={Link}
                    to="http://www.tiktok.com">
                    <MusicNote />
                  </StyledIconButton>
                </Grid>
                <Grid item>
                  <StyledIconButton
                    rel="noopener noreferrer"
                    target="_blank"
                    component={Link}
                    to="http://www.instagram.com">
                    <Instagram />
                  </StyledIconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid item container direction={"column"}>
              <Grid item>
                <Typography
                  variant="h3"
                  component={"div"}
                  sx={{ marginBottom: 2 }}>
                  Download the app
                </Typography>
              </Grid>
              <Grid
                item
                container
                direction={"column"}
                justifyContent={"center"}
                alignItems={"center"}>
                <Grid item>
                  <Button
                    rel="noopener noreferrer"
                    target="_blank"
                    component={Link}
                    to="https://play.google.com">
                    <img
                      src={PlayStoreImg}
                      alt="play store"
                      style={{ width: "90%", borderRadius: 10 }}
                    />
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    rel="noopener noreferrer"
                    target="_blank"
                    component={Link}
                    to="https://www.apple.com/app-store">
                    <img
                      src={AppStoreImg}
                      alt="play store"
                      style={{ width: "90%", borderRadius: 10 }}
                    />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

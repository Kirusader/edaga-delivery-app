/** @format */

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Grid, Box, Typography, Paper, Button } from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ButtonArrow from "./ui/ButtonArrow";
import forwardArrow from "../assets/forwardArrow.svg";
import backArrow from "../assets/backArrow.svg";
import EritreanFoodImg from "../assets/eritreanFood.png";
import PersonalCareImg from "../assets/Personal Care.png";
import HomeCareImg from "../assets/Home Care.png";
import ElectronicsApplianceImg from "../assets/Electronics and Home Appliance.png";
import StationaryImg from "../assets/Stationary.png";
import BeverageImg from "../assets/Beverage.png";
import BedBathImg from "../assets/Bed and Bath.png";
import CardImg from "../assets/card.png";
import CheckenImg from "../assets/checken.png";
import TrackOrderImg from "../assets/trackdelivery.png";
import RegisterCompanyImg from "../assets/registercompany.png";
import RiderImg from "../assets/rider.png";
const StyledOrderNowButton = styled(Button)(({ theme }) => ({
  ...theme.typography.orderNow,
  fontSize: "0.9rem",
  height: 40,
  marginLeft: 30,
  width: 140,
  [theme.breakpoints.down("sm")]: {
    marginBottom: "2em",
    marginTop: "1em",
  },
}));

function NextArrow(props) {
  const { style, onClick } = props;
  return (
    <Button
      style={{
        ...style,

        display: "block",
        bottom: 400,
        right: -1130,
        backgroundColor: "orange",
        borderRadius: "50%",
        height: 50,
        width: 50,
      }}
      onClick={onClick}>
      <img src={forwardArrow} alt="Next" />
    </Button>
  );
}

function PrevArrow(props) {
  const { style, onClick } = props;
  return (
    <Button
      style={{
        ...style,

        display: "block",
        bottom: -280,
        left: -50,
        zIndex: 1,
        backgroundColor: "orange",
        borderRadius: "50%",
        height: 50,
        width: 50,
      }}
      onClick={onClick}>
      <img src={backArrow} alt="Previous" />
    </Button>
  );
}

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
};
const productCategories = [
  {
    image: EritreanFoodImg,
    category: "Food",
    description: "Got a taste for life",
    link: "/food",
  },
  {
    image: PersonalCareImg,
    category: "Personal Care",
    description: "Nourish, Revitalize, Glow",
    link: "/personalcare",
  },
  {
    image: HomeCareImg,
    category: "Home Care",
    description: "Clean, Fresh, Sparkling",
    link: "/homecare",
  },
  {
    image: StationaryImg,
    category: "Stationary",
    description: "Write, Create, Inspire",
    link: "/stationary",
  },
  {
    image: ElectronicsApplianceImg,
    category: "Electronics and Home Appliance",
    description: "Power, Perform, Simplify",
    link: "/electronicsappliance",
  },
  {
    image: BeverageImg,
    category: "Beverages",
    description: "Sip, Savor, Refresh",
    link: "/beverages",
  },
  {
    image: BedBathImg,
    category: "Bed and Bath",
    description: "Relax, Unwind, Rejuvenate",
    link: "/bedbath",
  },
];
function LandingPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      sx={{ my: 10, width: "95%" }}>
      <Grid item>
        <Grid item container direction="column" justifyContent={"center"}>
          <Grid item>
            <Typography
              variant="h2"
              component="div"
              sx={{ textAlign: "center", width: "100%" }}>
              More choice & Less hassel.
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="h2"
              component="div"
              sx={{ textAlign: "center", width: "100%" }}>
              More than 10,000 items are delivered in one day.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sx={{ width: "90%", margin: "auto" }}>
        <Slider {...settings}>
          {productCategories.map((product, index) => (
            <Paper
              component={Link}
              to={product.link}
              key={index}
              sx={{
                padding: 2,
                textDecoration: "none",
                margin: "auto",
                border: 0,
                boxShadow: "none",
              }}>
              <img
                src={product.image}
                style={{ maxWidth: 600, alignContent: "left", height: 450 }}
                alt="Slide"
              />
              <Typography
                variant="h6"
                sx={{
                  textAlign: "left",
                  textDecoration: "none",
                  my: 2,
                  marginLeft: 4,
                  fontWeight: 600,
                  textTransform: "none",
                }}>
                {product.category}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: "1.1rem",
                  textAlign: "left",
                  textDecoration: "none",
                  my: 2,
                  marginLeft: 4,
                  textTransform: "none",
                }}>
                {product.description}
              </Typography>
              <StyledOrderNowButton
                onClick={() => navigate(product.link)}
                variant="outlined">
                <span style={{ marginRight: 10 }}>Order now</span>
                <ButtonArrow
                  width={15}
                  height={15}
                  fill={theme.palette.common.blue}
                />
              </StyledOrderNowButton>
            </Paper>
          ))}
        </Slider>
      </Grid>
      <Grid item sx={{ width: "90%", mx: "auto", my: 4 }}>
        <Grid
          item
          container
          spacing={2}
          alignItems={"center"}
          justifyContent={"center"}>
          <Grid item sm>
            <Button onClick={() => navigate("/card")}>
              <img
                src={CardImg}
                style={{ width: 400, height: 400, borderRadius: 20 }}
              />
            </Button>
          </Grid>
          <Grid item sm>
            <Grid
              item
              container
              direction={"column"}
              alignItems={"center"}
              justifyContent={"flex-end"}>
              <Grid item>
                <Typography variant="h2">Pay by Vouchers</Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="subtitle2"
                  paragraph
                  sx={{
                    maxWidth: 400,
                    textAlign: "center",
                    fontWeight: 400,
                    fontSize: "1.2rem",
                  }}>
                  More choice is important to us. That's why ordering what you
                  feel like is just as important as paying the way you feel
                  like, simple,reliable and safe we make it possible.
                </Typography>
              </Grid>
              <Grid item>
                <StyledOrderNowButton
                  onClick={() => navigate("/card")}
                  variant="outlined">
                  <span style={{ marginRight: 10 }}>Order now</span>
                  <ButtonArrow
                    width={15}
                    height={15}
                    fill={theme.palette.common.blue}
                  />
                </StyledOrderNowButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sx={{ width: "90%", mx: "auto" }}>
        <Grid
          item
          container
          justifyContent={"space-around"}
          alignItems={"center"}
          spacing={3}>
          <Grid item>
            <Grid item container direction={"column"} alignItems={"center"}>
              <Grid item>
                <Typography variant="h2">Today's Special Deal</Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="subtitle2"
                  paragraph
                  sx={{
                    maxWidth: 400,
                    textAlign: "center",
                    fontWeight: 400,
                    fontSize: "1.2rem",
                  }}>
                  Get regular specials and discounts on your favourite
                  traditional Eritrean cuisine from many restaurants working
                  with us.
                </Typography>
              </Grid>
              <Grid item>
                <StyledOrderNowButton
                  onClick={() => navigate("/food")}
                  variant="outlined">
                  <span style={{ marginRight: 10 }}>Order now</span>
                  <ButtonArrow
                    width={15}
                    height={15}
                    fill={theme.palette.common.blue}
                  />
                </StyledOrderNowButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Button onClick={() => navigate("/food")}>
              <img
                src={CheckenImg}
                style={{ width: 400, height: 400, borderRadius: 20 }}
              />
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sx={{ width: "90%", mx: "auto", my: 3 }}>
        <Grid
          item
          container
          justifyContent={"space-around"}
          alignItems={"center"}
          spacing={3}>
          <Grid item>
            <Button onClick={() => navigate("/trackorder")}>
              <img
                src={TrackOrderImg}
                style={{ width: 400, height: 400, borderRadius: 20 }}
              />
            </Button>
          </Grid>
          <Grid item>
            <Grid item container direction={"column"} alignItems={"center"}>
              <Grid item>
                <Typography variant="h2">Track your order location</Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="subtitle2"
                  paragraph
                  sx={{
                    maxWidth: 400,
                    textAlign: "center",
                    fontWeight: 400,
                    fontSize: "1.2rem",
                  }}>
                  From when our store accepts your order to the time it arrives
                  at your door.
                </Typography>
              </Grid>
              <Grid item>
                <StyledOrderNowButton
                  onClick={() => navigate("/trackorder")}
                  variant="outlined"
                  sx={{ width: 180 }}>
                  <span style={{ marginRight: 10 }}>Check location</span>
                  <ButtonArrow
                    width={15}
                    height={15}
                    fill={theme.palette.common.blue}
                  />
                </StyledOrderNowButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sx={{ width: "90%", mx: "auto", my: 3 }}>
        <Grid
          item
          container
          justifyContent={"space-around"}
          alignItems={"center"}
          spacing={3}>
          <Grid item>
            <Grid item container direction={"column"} alignItems={"center"}>
              <Grid item>
                <Typography variant="h2">
                  Register your company with us
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="subtitle2"
                  paragraph
                  sx={{
                    maxWidth: 400,
                    textAlign: "center",
                    fontWeight: 400,
                    fontSize: "1.2rem",
                  }}>
                  Access more customers, increase sales and make your company a
                  local legend.
                </Typography>
              </Grid>
              <Grid item>
                <StyledOrderNowButton
                  onClick={() => navigate("/registercompany")}
                  variant="outlined"
                  sx={{ width: 180 }}>
                  <span style={{ marginRight: 10 }}>Get started</span>
                  <ButtonArrow
                    width={15}
                    height={15}
                    fill={theme.palette.common.blue}
                  />
                </StyledOrderNowButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Button onClick={() => navigate("/registercompany")}>
              <img
                src={RegisterCompanyImg}
                style={{ width: 400, height: 400, borderRadius: 20 }}
              />
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sx={{ width: "90%", mx: "auto", my: 3 }}>
        <Grid
          item
          container
          justifyContent={"space-around"}
          alignItems={"center"}
          spacing={3}>
          <Grid item>
            <Button onClick={() => navigate("/riderapply")}>
              <img
                src={RiderImg}
                style={{ width: 400, height: 400, borderRadius: 20 }}
              />
            </Button>
          </Grid>
          <Grid item>
            <Grid item container direction={"column"} alignItems={"center"}>
              <Grid item>
                <Typography variant="h2">Become a rider</Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="subtitle2"
                  paragraph
                  sx={{
                    maxWidth: 400,
                    textAlign: "center",
                    fontWeight: 400,
                    fontSize: "1.2rem",
                  }}>
                  Work full time or flexible hours and keep 100% of all your
                  tips for yourself.
                </Typography>
              </Grid>
              <Grid item>
                <StyledOrderNowButton
                  onClick={() => navigate("/riderapply")}
                  variant="outlined"
                  sx={{ width: 180 }}>
                  <span style={{ marginRight: 10 }}>Apply now</span>
                  <ButtonArrow
                    width={15}
                    height={15}
                    fill={theme.palette.common.blue}
                  />
                </StyledOrderNowButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default LandingPage;

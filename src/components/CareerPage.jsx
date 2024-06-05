/** @format */

import React from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Box,
  Avatar,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  DeliveryDining,
  People,
  Public,
  LocalHospital,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const HeroContent = styled("div")`
  color: #fff;
  text-align: center;
  padding: 10px 0;
`;

const FeatureIcon = styled(Avatar)`
  margin-bottom: 16px;
  background-color: ${(props) => props.theme.palette.primary.main};
`;

const FeatureBox = styled(Box)`
  padding: 16px;
  text-align: center;
`;

const ApplyButton = styled(Button)`
  margin-top: 16px;
`;

const CareerPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <HeroContent>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h3"
            gutterBottom
            sx={{ color: "#000" }}>
            Join the Edaga Delivery Team!
          </Typography>
          <Typography variant="h6" paragraph>
            Delivering smiles and essentials to every doorstep.
          </Typography>
        </Container>
      </HeroContent>

      <Container maxWidth="lg">
        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Why Work With Us
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3}>
                <FeatureBox>
                  <FeatureIcon>
                    <People />
                  </FeatureIcon>
                  <Typography variant="h4">Growth Opportunities</Typography>
                  <Typography variant="subtitle2">
                    Grow with us and advance your career in a dynamic and
                    supportive environment.
                  </Typography>
                </FeatureBox>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3}>
                <FeatureBox>
                  <FeatureIcon>
                    <Public />
                  </FeatureIcon>
                  <Typography variant="h4">Inclusive Culture</Typography>
                  <Typography variant="subtitle2">
                    Be part of a diverse team where everyone is valued and
                    respected.
                  </Typography>
                </FeatureBox>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3}>
                <FeatureBox>
                  <FeatureIcon>
                    <DeliveryDining />
                  </FeatureIcon>
                  <Typography variant="h4">Impactful Work</Typography>
                  <Typography variant="subtitle2">
                    Make a real difference in the community by ensuring timely
                    deliveries of essential goods.
                  </Typography>
                </FeatureBox>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3}>
                <FeatureBox>
                  <FeatureIcon>
                    <LocalHospital />
                  </FeatureIcon>
                  <Typography variant="h4">Employee Benefits</Typography>
                  <Typography variant="subtitle2">
                    Enjoy competitive salaries, health benefits, and more.
                  </Typography>
                </FeatureBox>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box my={4}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ marginBottom: 4 }}>
            Open Positions
          </Typography>
          <Grid container spacing={4}>
            {[
              "Delivery Driver",
              "Customer Service Representative",
              "Warehouse Manager",
            ].map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job}>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h4" component="h2">
                      {job}
                    </Typography>
                    <Typography variant="subtitle2">
                      {job === "Delivery Driver"
                        ? "Responsible for delivering food and goods to customers efficiently and safely."
                        : job === "Customer Service Representative"
                        ? "Handle customer inquiries and ensure customer satisfaction."
                        : "Oversee warehouse operations and manage inventory."}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <ApplyButton
                      size="small"
                      color="primary"
                      variant="contained"
                      onClick={() => {
                        if (job === "Delivery Driver") {
                          navigate("/riderapply");
                        }
                      }}>
                      Apply Now
                    </ApplyButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default CareerPage;

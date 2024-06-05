/** @format */

import React from "react";
import {
  Typography,
  Container,
  Grid,
  Box,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  People,
  Business,
  LocalShipping,
  LocationOn,
} from "@mui/icons-material";

const HeroContent = styled("div")`
  color: #fff;
  text-align: center;
  padding: 10px 0;
`;

const AboutAvatar = styled(Avatar)`
  background-color: ${(props) => props.theme.palette.primary.main};
  margin-right: 16px;
`;

const AboutContent = styled(Box)`
  display: flex;
  align-items: center;
`;

const AboutPage = () => {
  return (
    <div>
      <HeroContent>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h3"
            gutterBottom
            sx={{ color: "#000" }}>
            About Edaga Delivery
          </Typography>
          <Typography variant="h6" paragraph>
            Learn more about our mission, vision, and the team that makes it all
            happen.
          </Typography>
        </Container>
      </HeroContent>

      <Container maxWidth="lg">
        <Box my={4} justifyContent={"center"}>
          <Typography variant="h4" align="center" gutterBottom>
            Our Mission
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            At Edaga Delivery, our mission is to provide fast, reliable, and
            affordable delivery services to every corner of Eritrea. We are
            committed to making life easier by delivering essentials and smiles
            to your doorstep.
          </Typography>
        </Box>

        <Box my={4} maxWidth={"md"} justifyContent={"center"}>
          <Typography variant="h4" align="center" gutterBottom>
            Our Vision
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            We envision a future where everyone in Eritrea can easily access the
            goods they need, no matter where they live. Our goal is to bridge
            the gap between communities and bring convenience to every
            household.
          </Typography>
        </Box>

        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Meet Our Team
          </Typography>
          <Grid container spacing={4} maxWidth={"lg"}>
            {[
              { name: "Kiros Hadera", role: "CEO", icon: <People /> },
              { name: "Helen Tesfay", role: "COO", icon: <Business /> },
              {
                name: "Henoke Haile",
                role: "Head of Logistics",
                icon: <LocalShipping />,
              },
              {
                name: "Sarah Mahari",
                role: "Customer Relations Manager",
                icon: <LocationOn />,
              },
            ].map((member) => (
              <Grid item xs={12} sm={6} md={3} key={member.name}>
                <Card>
                  <CardContent>
                    <AboutContent>
                      <AboutAvatar>{member.icon}</AboutAvatar>
                      <Box>
                        <Typography variant="h6">{member.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {member.role}
                        </Typography>
                      </Box>
                    </AboutContent>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default AboutPage;

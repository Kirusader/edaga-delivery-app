/** @format */

import React from "react";
import { Typography, Container, Grid, Paper, Box, Avatar } from "@mui/material";
import { Nature, People, Public, LocalShipping } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const HeroContent = styled("div")`
  color: #fff;
  text-align: center;
  padding: 10px 0;
`;

const VisionBox = styled(Paper)`
  padding: 20px;
  margin-bottom: 16px;
`;

const VisionAvatar = styled(Avatar)`
  background-color: ${(props) => props.theme.palette.primary.main};
  margin-right: 6px;
`;

const VisionContent = styled(Box)`
  display: flex;
  align-items: center;
  padding-right: 10px;
`;

const VisionPage = () => {
  return (
    <div>
      <HeroContent>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h3"
            gutterBottom
            sx={{ color: "#000" }}>
            Our Vision
          </Typography>
          <Typography variant="h6" paragraph>
            At Edaga Delivery, we are driven by a vision to create a more
            connected and convenient world.
          </Typography>
        </Container>
      </HeroContent>

      <Container maxWidth="lg">
        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Vision Statement
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            Our vision is to become the leading delivery service in Eritrea,
            ensuring that every community has access to essential goods and
            services, no matter where they are located.
          </Typography>
        </Box>

        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Our Core Values
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: "Community",
                description:
                  "We believe in supporting and uplifting the communities we serve.",
                icon: <People />,
              },
              {
                title: "Sustainability",
                description:
                  "We are committed to sustainable practices to protect our planet.",
                icon: <Nature />,
              },
              {
                title: "Accessibility",
                description:
                  "We strive to make our services accessible to everyone, everywhere.",
                icon: <Public />,
              },
              {
                title: "Reliability",
                description:
                  "We are dedicated to providing reliable and timely delivery services.",
                icon: <LocalShipping />,
              },
            ].map((value) => (
              <Grid item xs={12} sm={6} md={3} key={value.title}>
                <VisionBox elevation={3}>
                  <VisionContent>
                    <VisionAvatar>{value.icon}</VisionAvatar>
                    <Box>
                      <Typography variant="h6" align="center">
                        {value.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {value.description}
                      </Typography>
                    </Box>
                  </VisionContent>
                </VisionBox>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Our Goals
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            We aim to expand our reach, innovate our services, and continuously
            improve our operations to better serve our customers and
            communities.
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default VisionPage;

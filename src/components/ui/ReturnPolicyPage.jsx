/** @format */

import React from "react";
import { Typography, Container, Grid, Paper, Box, Avatar } from "@mui/material";
import {
  Policy,
  LocalShipping,
  MoneyOff,
  HelpOutline,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const HeroContent = styled("div")`
  color: #fff;
  text-align: center;
  padding: 10px 0;
`;
const PolicyBox = styled(Paper)`
  padding: 16px;
  margin-bottom: 16px;
`;

const PolicyAvatar = styled(Avatar)`
  background-color: ${(props) => props.theme.palette.primary.main};
  margin-right: 16px;
`;

const PolicyContent = styled(Box)`
  display: flex;
  align-items: center;
`;

const ReturnPolicyPage = () => {
  return (
    <div>
      <HeroContent>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h3"
            gutterBottom
            sx={{ color: "#000" }}>
            Return Policy
          </Typography>
          <Typography variant="h6" paragraph>
            Your satisfaction is our priority. Learn about our return and refund
            policies.
          </Typography>
        </Container>
      </HeroContent>

      <Container maxWidth="lg">
        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Easy Returns
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            At Edaga Delivery, we strive to ensure your complete satisfaction
            with every purchase. If you`&aposre`re not entirely happy with your
            order, our easy return policy makes it simple to get a refund or
            exchange.
          </Typography>
        </Box>

        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Our Return Process
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: "Step 1: Contact Us",
                description:
                  "Reach out to our support team within 14 days of receiving your order.",
                icon: <HelpOutline />,
              },
              {
                title: "Step 2: Prepare Your Item",
                description:
                  "Ensure the item is in its original condition and packaging.",
                icon: <LocalShipping />,
              },
              {
                title: "Step 3: Ship It Back",
                description:
                  "Send the item back to us using a trackable shipping method.",
                icon: <Policy />,
              },
              {
                title: "Step 4: Receive Refund",
                description:
                  "Once we receive the item, we will process your refund within 5 business days.",
                icon: <MoneyOff />,
              },
            ].map((step) => (
              <Grid item xs={12} sm={6} md={3} key={step.title}>
                <PolicyBox elevation={3}>
                  <PolicyContent>
                    <PolicyAvatar>{step.icon}</PolicyAvatar>
                    <Box>
                      <Typography variant="h6">{step.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {step.description}
                      </Typography>
                    </Box>
                  </PolicyContent>
                </PolicyBox>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Conditions for Returns
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            To be eligible for a return, your item must be unused and in the
            same condition that you received it. It must also be in the original
            packaging. Several types of goods are exempt from being returned,
            such as perishable goods, intimate or sanitary goods, and hazardous
            materials.
          </Typography>
        </Box>

        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Contact Us for Support
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            If you have any questions about our return policy, please contact
            our support team. We`&aposre`here to help!
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default ReturnPolicyPage;

/** @format */

import React from "react";
import {
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const HeroContent = styled("div")`
  color: #fff;
  text-align: center;
  padding: 10px 0;
`;

const HelpSection = styled(Box)`
  padding: 16px;
`;

const HelpBox = styled(Paper)`
  padding: 16px;
  margin-bottom: 16px;
`;

const HelpAvatar = styled(Avatar)`
  background-color: ${(props) => props.theme.palette.primary.main};
  margin-right: 16px;
`;

const HelpContent = styled(Box)`
  display: flex;
  align-items: center;
`;

const AccordionContainer = styled(Container)`
  margin-top: 32px;
`;

const HelpPage = () => {
  return (
    <div>
      <HeroContent>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h3"
            gutterBottom
            sx={{ color: "#000" }}>
            How can we help you?
          </Typography>
          <Typography variant="h6" paragraph>
            Find answers to frequently asked questions and contact our support
            team.
          </Typography>
        </Container>
      </HeroContent>

      <AccordionContainer maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          Frequently Asked Questions
        </Typography>
        {[
          {
            question: "How do I place an order?",
            answer:
              "To place an order, simply navigate to our \"Home\" page or from sidebar menu button,  select product categories, and follow the checkout process.",
          },
          {
            question: "What are your delivery hours?",
            answer:
              "Our delivery hours are from 8 AM to 8 PM, seven days a week.",
          },
          {
            question: "How can I track my order?",
            answer:
              "You can track your order by following the track order location link at the 'Home Page' or sidebar menu & by clicking 'Your orders' link.",
          },
          {
            question: "What payment methods are accepted?",
            answer:
              "Currently, We accept voucher card payment method which you can buy from the local shops around and in the future we will integrate  various payment methods including credit cards, debit cards, and mobile payments.",
          },
        ].map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </AccordionContainer>

      <Container maxWidth="md">
        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Contact Our Support Team
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <HelpBox elevation={3}>
                <HelpContent>
                  <HelpAvatar>📞</HelpAvatar>
                  <Box>
                    <Typography variant="h6">Phone Support</Typography>
                    <Typography>Call us at +291-1-123-456</Typography>
                  </Box>
                </HelpContent>
              </HelpBox>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <HelpBox elevation={3}>
                <HelpContent>
                  <HelpAvatar>📧</HelpAvatar>
                  <Box>
                    <Typography variant="h6">Email Support</Typography>
                    <Typography>Email us at support@edaga.com</Typography>
                  </Box>
                </HelpContent>
              </HelpBox>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <HelpBox elevation={3}>
                <HelpContent>
                  <HelpAvatar>💬</HelpAvatar>
                  <Box>
                    <Typography variant="h6">Live Chat</Typography>
                    <Typography>Chat with our support team</Typography>
                  </Box>
                </HelpContent>
              </HelpBox>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default HelpPage;

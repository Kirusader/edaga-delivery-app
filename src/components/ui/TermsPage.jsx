/** @format */

import React from "react";
import { Typography, Container, Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

const HeroContent = styled("div")`
  color: #fff;
  text-align: center;
  padding: 10px 0;
`;

const TermsBox = styled(Paper)`
  padding: 16px;
  margin-bottom: 16px;
`;

const TermsPage = () => {
  return (
    <div>
      <HeroContent>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h3"
            gutterBottom
            sx={{ color: "#000" }}>
            Terms & Conditions
          </Typography>
          <Typography variant="h6" paragraph>
            Please read our terms and conditions carefully before using our
            services.
          </Typography>
        </Container>
      </HeroContent>

      <Container maxWidth="lg">
        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Introduction
          </Typography>
          <TermsBox elevation={3}>
            <Typography variant="subtitle2" paragraph>
              Welcome to Edaga Delivery. These terms and conditions outline the
              rules and regulations for the use of our services. By accessing
              this website and using our services, you accept these terms and
              conditions in full. Do not continue to use Edaga Delivery if you
              do not agree with all the terms and conditions stated on this
              page.
            </Typography>
          </TermsBox>
        </Box>

        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            User Obligations
          </Typography>
          <TermsBox elevation={3}>
            <Typography variant="subtitle2" paragraph>
              As a user of Edaga Delivery, you agree to use our services
              responsibly and comply with all applicable laws and regulations.
              You must not use our services for any illegal or unauthorized
              purpose. You are responsible for maintaining the confidentiality
              of your account and password and for restricting access to your
              computer to prevent unauthorized access to your account.
            </Typography>
          </TermsBox>
        </Box>

        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Service Modifications
          </Typography>
          <TermsBox elevation={3}>
            <Typography variant="subtitle2" paragraph>
              Edaga Delivery reserves the right to modify or discontinue,
              temporarily or permanently, the service (or any part thereof) with
              or without notice at any time. We shall not be liable to you or to
              any third party for any modification, suspension, or
              discontinuance of the service.
            </Typography>
          </TermsBox>
        </Box>

        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Limitation of Liability
          </Typography>
          <TermsBox elevation={3}>
            <Typography variant="subtitle2" paragraph>
              In no event shall Edaga Delivery, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential, or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from (i) your use
              of or inability to use the service; (ii) any unauthorized access
              to or use of our servers and/or any personal information stored
              therein; (iii) any interruption or cessation of transmission to or
              from the service; (iv) any bugs, viruses, trojan horses, or the
              like that may be transmitted to or through our service by any
              third party; (v) any errors or omissions in any content or for any
              loss or damage incurred as a result of your use of any content
              posted, emailed, transmitted, or otherwise made available through
              the service; and/or (vi) the defamatory, offensive, or illegal
              conduct of any third party.
            </Typography>
          </TermsBox>
        </Box>

        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Changes to Terms & Conditions
          </Typography>
          <TermsBox elevation={3}>
            <Typography variant="subtitle2" paragraph>
              Edaga Delivery reserves the right to update or modify these terms
              and conditions at any time without prior notice. Your continued
              use of the service following any changes constitutes your
              acceptance of the new terms and conditions. It is your
              responsibility to review the terms and conditions periodically for
              any changes.
            </Typography>
          </TermsBox>
        </Box>

        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Contact Us
          </Typography>
          <TermsBox elevation={3}>
            <Typography variant="subtitle2" paragraph>
              If you have any questions about these Terms & Conditions, please
              contact us at support@edaga.com.
            </Typography>
          </TermsBox>
        </Box>
      </Container>
    </div>
  );
};

export default TermsPage;

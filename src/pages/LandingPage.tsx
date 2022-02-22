import React from 'react';
import Landing from 'components/landing/Landing';
import { Box } from '@mui/material';
import NavBar from 'components/navBar/NavBar';
import { PageName } from 'types';

function LandingPage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <NavBar selectedName={PageName.LANDING} />
      <Box>
        <Landing />
      </Box>
    </Box>
  );
}

export default LandingPage;

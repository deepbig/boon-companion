import React from 'react';
import Dashboard from 'components/dashboard/Dashboard';
import { Box, Toolbar } from '@mui/material';
import NavBar from 'components/navBar/NavBar';
import { PageName } from 'types';

function DashboardPage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <NavBar selectedName={PageName.DASHBOARD} />
      <Box
        component='main'
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Dashboard />
      </Box>
    </Box>
  );
}

export default DashboardPage;

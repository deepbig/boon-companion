import React from 'react';
import Group from 'components/group/Group';
import { Box, Toolbar } from '@mui/material';
import NavBar from 'components/navBar/NavBar';
import { PageName } from 'types';

function GroupPage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <NavBar selectedName={PageName.GROUP} />
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
        <Group />
      </Box>
    </Box>
  );
}

export default GroupPage;

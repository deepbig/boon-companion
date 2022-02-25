import { Typography, Box } from '@mui/material';
import React from 'react';

function ActivityGoal() {
  return (
    <Box m={2}>
      <Typography variant='guideline' align='center' sx={{ mt: 2 }}>
        You don't have any goal yet. Please add your goal!
      </Typography>
    </Box>
  );
}

export default ActivityGoal;

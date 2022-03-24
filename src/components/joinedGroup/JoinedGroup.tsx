import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react';

function JoinedGroup() {
  const navigate = useNavigate();
  return (
    <>
      <Box m={2}>
        <Typography variant='guideline' align='center'>
          You haven't joined a group yet. Please craete or join a group!
        </Typography>
      </Box>
      <Box display='flex' justifyContent='center'>
        <Button variant='contained' sx={{ width: 160, mr: 2 }}>
          Join a Group
        </Button>
        <Button variant='contained' onClick={() => navigate(`/group`)}>
          Create a Group
        </Button>
      </Box>
    </>
  );
}

export default JoinedGroup;

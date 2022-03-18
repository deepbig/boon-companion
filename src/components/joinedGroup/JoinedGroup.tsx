import { Typography, Box, Button } from '@mui/material';
import { useState } from 'react';
import CreateGroup from 'components/group/CreateGroup';

function JoinedGroup() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event: any, reason: any) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

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
        <Button variant='contained' onClick={handleClickOpen}>
          Create a Group
        </Button>
        <CreateGroup open={open} onClose={handleClose} />
      </Box>
    </>
  );
}

export default JoinedGroup;

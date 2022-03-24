import { Typography, Box, Button } from '@mui/material';
import { useState } from 'react';
import CreateGroup from 'components/group/CreateGroup';
import JoinGroup from 'components/group/JoinGroup';
import { useAppSelector } from 'hooks';
import { getUser } from 'modules/user';

function JoinedGroup() {
  const user = useAppSelector(getUser);
  const [open, setOpen] = useState(false);
  const [openJoinGroup, setOpenJoinGroup] = useState(false);

  const handleClickOpenJoinGroup = () => {
    setOpenJoinGroup(true);
  };

  const handleCloseJoinGroup = () => {
    setOpenJoinGroup(false);
  };

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
      {user && user.groups?.length <= 0 ? (
        <Box m={2}>
          <Typography variant='guideline' align='center'>
            You haven't joined a group yet. Please craete or join a group!
          </Typography>
        </Box>
      ) : null}

      <Box display='flex' justifyContent='center'>
        <Button
          variant='contained'
          onClick={handleClickOpenJoinGroup}
          sx={{ width: 160, mr: 2 }}
        >
          Join a Group
        </Button>
        <JoinGroup open={openJoinGroup} handleClose={handleCloseJoinGroup} />

        <Button variant='contained' onClick={handleClickOpen}>
          Create a Group
        </Button>
        <CreateGroup open={open} onClose={handleClose} />
      </Box>
    </>
  );
}

export default JoinedGroup;

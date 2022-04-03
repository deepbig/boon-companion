import {
  Typography,
  Box,
  Button,
  Card,
  AvatarGroup,
  Tooltip,
  Avatar,
  Grid,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateGroup from 'components/group/CreateGroup';
import JoinGroup from 'components/group/JoinGroup';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getJoinedGroup, getUser, setJoinedGroup } from 'modules/user';
import { grey } from '@mui/material/colors';
import { getUserJoinedGroup } from 'db/repository/group';

function JoinedGroup() {
  const navigate = useNavigate();
  const user = useAppSelector(getUser);
  const joinedGroup = useAppSelector(getJoinedGroup);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [openJoinGroup, setOpenJoinGroup] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.groups.length > 0) {
        updateJoinedGroup(user.groups);
      } else {
        dispatch(setJoinedGroup([]));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateJoinedGroup = async (groups: string[]) => {
    const value = await getUserJoinedGroup(groups);

    if (value) {
      dispatch(setJoinedGroup(value));
    }
  };

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
      {user ? (
        user.groups?.length <= 0 ? (
          <Box m={2}>
            <Typography variant='guideline' align='center'>
              You haven't joined a group yet. Please create or join a group!
            </Typography>
          </Box>
        ) : joinedGroup.length > 0 ? (
          joinedGroup.map((group, i) => (
            <Box
              mb={1}
              key={i}
              onClick={() => navigate(`/group/${group.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <Card
                sx={{
                  backgroundColor: grey[100],
                }}
              >
                <CardContent>
                  <Typography gutterBottom variant='h6' component='div'>
                    {group.title}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography gutterBottom variant='body1' component='div'>
                        Interest: {group.interest}
                      </Typography>
                      <Typography variant='body1' color='div'>
                        Description: {group.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='body1' color='div'>
                        Members:
                        {group.members && group.members.length > 0
                          ? null
                          : 'No members yet'}
                      </Typography>

                      {group.members && group.members.length > 0 ? (
                        <Box
                          data-testid='group-members-avatar'
                          display='flex'
                          justifyContent='left'
                        >
                          <AvatarGroup max={4}>
                            {group.members.map((group, i) => (
                              <Tooltip key={i} title={group.displayName}>
                                <Avatar
                                  alt={group.displayName}
                                  src={group.photoURL}
                                />
                              </Tooltip>
                            ))}
                          </AvatarGroup>
                        </Box>
                      ) : null}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          ))
        ) : (
          <Box
            data-testid='circular-progress'
            display='flex'
            justifyContent='center'
            m={1}
            p={1}
          >
            <CircularProgress color='inherit' />
          </Box>
        )
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
        {open ? <CreateGroup open={open} onClose={handleClose} /> : null}
      </Box>
    </>
  );
}

export default JoinedGroup;

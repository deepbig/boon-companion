import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { getGroups } from 'modules/group';
import { useAppDispatch, useAppSelector } from 'hooks';
import { GroupData } from 'types';
import { grey } from '@mui/material/colors';
import { getUser, setUser } from 'modules/user';
import { auth } from 'db';
import { joinGroupAsMember } from 'db/repository/group';
import { addUserGroup, getUserFromDB } from 'db/repository/user';
import { setBackdrop } from 'modules/backdrop';

interface SearchResultGroupFormProps {
  open: boolean;
  handleClose: (isSelected: boolean) => void;
}

function SearchResultGroup(props: SearchResultGroupFormProps) {
  const user = useAppSelector(getUser);
  const currentUser = auth.currentUser;
  const groups = useAppSelector(getGroups);
  const dispatch = useAppDispatch();
  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState<GroupData | null>(null);

  const handleCloseMessage = () => {
    setOpenMessage(false);
    setMessage('');
  };

  const actionMessage = (
    <IconButton
      size='small'
      aria-label='close'
      color='inherit'
      onClick={handleCloseMessage}
    >
      <CloseIcon fontSize='small' />
    </IconButton>
  );

  const handleSubmit = async () => {
    // update group information (userid, User name, email, photoURL).
    if (currentUser && user && selected) {
      if (selected.minAge > user.age || selected.maxAge < user.age) {
        setMessage('Your age is not in the range to join this group.');
        setOpenMessage(true);
      } else if (selected.peerRatingMin > user.peerRating) {
        setMessage('Your peer rating is not in the range to join this group.');
        setOpenMessage(true);
      } else if (selected.hostileRatingMax < user.hostileRating) {
        setMessage(
          'Your hostile rating is not in the range to join this group.'
        );
        setOpenMessage(true);
      } else if (selected.levelOfExperienceMin > user.levelOfExperience) {
        setMessage(
          'Your level of Expereince is not in the range to join this group.'
        );
        setOpenMessage(true);
      } else {
        dispatch(setBackdrop(true));
        const member = {
          uid: currentUser.uid,
          displayName: `${user?.displayName}`,
          email: `${user?.email}`,
          photoURL: `${user?.photoURL}`,
        };
        await joinGroupAsMember(member, selected);
        //@ts-ignore
        await addUserGroup(currentUser.uid, selected.id);
        const newUser = await getUserFromDB(currentUser.uid);
        if (newUser) {
          dispatch(setUser(newUser));
        }
        // update user profile.
        setMessage('You are successfully joined the group!');
        setOpenMessage(true);
        dispatch(setBackdrop(false));
        props.handleClose(true);
      }
    } else {
      alert('You need to select a group to join.');
    }
  };

  const handleClickCard = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    group: GroupData
  ) => {
    setSelected(group);
  };

  return (
    <>
      <Dialog open={props.open}>
        <DialogTitle>Group Search Results</DialogTitle>
        <DialogContent>
          {groups && groups.length > 0 ? (
            groups.map((group, i) => (
              <Box key={i} mb={1}>
                <Card
                  onClick={(e) => handleClickCard(e, group)}
                  sx={{
                    backgroundColor:
                      selected && selected.id === group.id
                        ? grey[300]
                        : grey[100],
                  }}
                >
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='div'>
                      {group.title}
                    </Typography>
                    <Typography gutterBottom variant='body1' component='div'>
                      Interest: {group.interest}
                    </Typography>
                    <Typography variant='body1' color='div'>
                      Members:{' '}
                      {group.members && group.members.length > 0
                        ? null
                        : 'No members yet'}
                    </Typography>
                    {group.members && group.members.length > 0 ? (
                      <Box
                        display='flex'
                        justifyContent='left'
                        data-testid='group-members-avatar-search-result'
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
                    {group.description ? (
                      <Typography variant='body2' color='text.secondary'>
                        Description: {group.description}
                      </Typography>
                    ) : null}
                    <Typography variant='body2' color='text.secondary'>
                      Gender: {group.gender}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Age Range: Between {group.minAge} and {group.maxAge}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Peer Rating Range: Between {group.peerRatingMin} and{' '}
                      {group.peerRatingMax}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Hostile Rating Range: Between {group.hostileRatingMin} and{' '}
                      {group.hostileRatingMax}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Experience Level Range: Between{' '}
                      {group.levelOfExperienceMin} and{' '}
                      {group.levelOfExperienceMax}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))
          ) : (
            <Box>
              <Typography variant='guideline' align='center' sx={{ mt: 2 }}>
                There are no available matching groups. Please modify your
                criteria to find a group.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant='contained'>
            Join
          </Button>
          <Button onClick={() => props.handleClose(false)} variant='contained'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openMessage}
        autoHideDuration={5000}
        onClose={handleCloseMessage}
        message={message}
        action={actionMessage}
      />
    </>
  );
}

export default SearchResultGroup;

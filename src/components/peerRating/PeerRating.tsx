import React, { useState, useEffect } from 'react';
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Rating,
  Typography,
  DialogActions,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import Title from 'components/title/Title';
import { MemberData, PeerRatingData } from 'types';
import { auth } from '../../db';
import {
  addPeerRating,
  getAllPeerRatingsByUserId,
  setPeerRatingByPeerRatingId,
} from 'db/repository/peerRating';
import { updateUserPeerRating } from 'db/repository/user';

interface PeerRatingProps {
  member: MemberData;
  handleClose: () => void;
}

function PeerRating(props: PeerRatingProps) {
  const [value, setValue] = useState(0);
  const [isUpdated, setIsUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [peerRatings, setPeerRatings] = useState<PeerRatingData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const currentUser = auth.currentUser;

  useEffect(() => {
    // fetch all all reviews assigned to the selected user.
    if (props.member.uid) {
      fetchAllPeerRatingAssignedToMember();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.member.uid]);

  const fetchAllPeerRatingAssignedToMember = async () => {
    if (currentUser) {
      setLoading(true);
      const res = await getAllPeerRatingsByUserId(props.member.uid);
      if (res.length > 0) {
        const index = res.findIndex(
          (obj) => obj.assignedFrom === currentUser.uid
        );
        if (index !== -1) {
          setValue(res[index].rating);
          setSelectedIndex(index);
        }
        setPeerRatings(res);
      }
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    // need to update user data + peerRating data.
    if (selectedIndex !== -1) {
      // need to update peerRating.
      peerRatings[selectedIndex].rating = value;

      await setPeerRatingByPeerRatingId(peerRatings[selectedIndex].id, value);

      let sum = 0;
      peerRatings.forEach((obj) => (sum += obj.rating));
      await updateUserPeerRating(
        props.member.uid,
        +(sum / peerRatings.length).toFixed(2)
      );
    } else {
      // need to create new peerRating.
      if (currentUser) {
        await addPeerRating(currentUser.uid, props.member.uid, value);
      }
      // need to update user peer rating.
      if (peerRatings.length > 0) {
        let sum = value;
        peerRatings.forEach((obj) => (sum += obj.rating));
        await updateUserPeerRating(
          props.member.uid,
          +(sum / (peerRatings.length + 1)).toFixed(2)
        );
      }
    }
    props.handleClose();
    alert('Your peer rating is successfully updated!');
  };

  return (
    <Dialog open={true}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        {props.member.displayName}'s Profile
      </DialogTitle>

      <DialogContent>
        <Typography alignContent='center' gutterBottom>
          email:{props.member.email}
        </Typography>
        <Grid container justifyContent='center' spacing={1}>
          <Box></Box>
          <Grid item>
            <Title>Your rating on this user</Title>
            {loading ? (
              <Box
                data-testid='circular-progress'
                display='flex'
                justifyContent='center'
                m={1}
                p={1}
              >
                <CircularProgress color='inherit' />
              </Box>
            ) : (
              <Rating
                name='rating'
                size='large'
                value={value}
                precision={0.5}
                max={10}
                onChange={(event, newValue) => {
                  setValue(newValue as number);
                  if (!isUpdated) {
                    setIsUpdated(true);
                  }
                }}
              />
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleUpdate}
          variant='contained'
          disabled={!isUpdated}
        >
          Save
        </Button>

        <Button onClick={props.handleClose} variant='contained'>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default PeerRating;

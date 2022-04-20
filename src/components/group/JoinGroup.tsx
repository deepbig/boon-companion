import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Slider,
  Snackbar,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getUser } from 'modules/user';
import React, { useEffect, useState } from 'react';
import { GroupSearchFormData } from 'types';
import CloseIcon from '@mui/icons-material/Close';
import SearchResultGroup from './SearchResultGroup';
import { getGroupsByCriteria } from 'db/repository/group';
import { setGroupList } from 'modules/group';
import { auth } from 'db';

interface JoinGroupFormProps {
  open: boolean;
  handleClose: () => void;
}

function valuetext(value: number) {
  return `${value}`;
}

function JoinGroup(props: JoinGroupFormProps) {
  const user = useAppSelector(getUser);
  const currentUser = auth.currentUser;
  const dispatch = useAppDispatch();
  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [openResult, setOpenResult] = useState(false);
  const [backdrop, setBackdrop] = useState(false);
  const [criteria, setCriteria] = useState<GroupSearchFormData>({
    interest: '',
    age: [0, 120],
    peerRating: [0, 10],
    gender: 'both',
    hostileRating: [0, 10],
    levelOfExperience: [0, 10],
  });

  // if user data is not available. set default values, and cannot change the value by themselves.
  useEffect(() => {
    if (!props.open) {
      setCriteria({
        interest: user?.interests[0] ? user?.interests[0] : '',
        age: [0, 120],
        peerRating: [0, user?.peerRating ? user?.peerRating : 10],
        gender: 'both',
        hostileRating: [user?.hostileRating ? user?.hostileRating : 0, 10],
        levelOfExperience: [0, 10],
      });
    }
  }, [props.open, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCriteria({
      ...criteria,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeInterest = (e: SelectChangeEvent) => {
    setCriteria({
      ...criteria,
      interest: e.target.value as string,
    });
  };

  const handleChangeAge = (e: Event, value: number | number[]) => {
    const myValue = user?.age ? user.age : 0;
    const rangeValue = value as number[];
    if (myValue >= rangeValue[0] && myValue <= rangeValue[1]) {
      setCriteria({
        ...criteria,
        age: rangeValue,
      });
    } else {
      setMessage(
        `You cannot set range outside of your age. Your age is: ${user?.age}`
      );
      setOpenMessage(true);
    }
  };

  const handleChangePeerRating = (e: Event, value: number | number[]) => {
    const myValue = user?.peerRating ? user.peerRating : 0;
    const rangeValue = value as number[];
    if (myValue >= rangeValue[1]) {
      setCriteria({
        ...criteria,
        peerRating: rangeValue,
      });
    } else {
      setMessage(
        `You cannot set range outside of your peer rating. Your peer rating is: ${user?.peerRating}`
      );
      setOpenMessage(true);
    }
  };

  const handleChangeHostileRating = (e: Event, value: number | number[]) => {
    const myValue = user?.hostileRating ? user.hostileRating : 0;
    const rangeValue = value as number[];
    if (myValue <= rangeValue[0]) {
      setCriteria({
        ...criteria,
        hostileRating: rangeValue,
      });
    } else {
      setMessage(
        `You cannot set range outside of your hostile rating. Your hostile rating is: ${user?.hostileRating}`
      );
      setOpenMessage(true);
    }
  };

  const handleChangeLevelOfExperience = (
    e: Event,
    value: number | number[]
  ) => {
    const myValue = user?.levelOfExperience ? user.levelOfExperience : 0;
    const rangeValue = value as number[];
    if (myValue >= rangeValue[0] && myValue <= rangeValue[1]) {
      setCriteria({
        ...criteria,
        levelOfExperience: rangeValue,
      });
    } else {
      setMessage(
        `You cannot set range outside of your level. Your level of experience is: ${user?.levelOfExperience}`
      );
      setOpenMessage(true);
    }
  };

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
    if (currentUser) {
      setBackdrop(true);
      const groupResult = await getGroupsByCriteria(criteria, currentUser.uid);
      if (groupResult.length === 0) {
        setMessage(
          'There are no available matching groups. Please modify your criteria to find a group.'
        );
        setOpenMessage(true);
      }
      dispatch(setGroupList(groupResult));
      setBackdrop(false);
      setOpenResult(true);
    } else {
      alert('User is not logged in.');
    }
  };

  const handleCloseResult = (isSelected: boolean) => {
    setOpenResult(false);
    dispatch(setGroupList([]));
    // reset result
    if (isSelected) {
      props.handleClose();
    }
  };

  return (
    <>
      <Dialog open={props.open}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          Search Groups By Criteria
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Interest</Typography>
              <Select
                fullWidth
                labelId='interest-select-label'
                name='interest'
                value={criteria.interest}
                onChange={handleChangeInterest}
                data-testid='joinGroup-interest'
              >
                {user?.interests.map((interest, index) => (
                  <MenuItem key={index} value={interest}>
                    {interest}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12}>
              <Typography>Gender</Typography>
              <RadioGroup
                row
                aria-labelledby='gender-label'
                name='gender'
                value={criteria.gender}
                onChange={handleChange}
              >
                <FormControlLabel
                  value='female'
                  disabled={!user?.gender || !(user?.gender === 'female')}
                  control={<Radio />}
                  label='Female'
                />
                <FormControlLabel
                  value='male'
                  disabled={!user?.gender || !(user?.gender === 'male')}
                  control={<Radio />}
                  label='Male'
                />
                <FormControlLabel
                  value='other'
                  disabled={!user?.gender || !(user?.gender === 'other')}
                  control={<Radio />}
                  label='Other'
                />
                <FormControlLabel
                  value='both'
                  control={<Radio />}
                  label='Both'
                />
              </RadioGroup>
            </Grid>

            <Grid item xs={12}>
              <Typography>
                Age: Between {criteria.age[0]} and {criteria.age[1]}
              </Typography>
              <Slider
                getAriaLabel={() => 'Age range'}
                name='age'
                disabled={user?.age === null}
                max={120}
                value={criteria.age}
                onChange={handleChangeAge}
                valueLabelDisplay='auto'
                getAriaValueText={valuetext}
                data-testid='joinGroup-age'
              />
            </Grid>

            <Grid item xs={12}>
              <Typography>
                Peer Rating: Between {criteria.peerRating[0]} and{' '}
                {criteria.peerRating[1]}
              </Typography>
              <Slider
                getAriaLabel={() => 'Peer rating range'}
                name='peerRating'
                disabled={user?.peerRating === null}
                max={10}
                step={0.1}
                value={criteria.peerRating}
                onChange={handleChangePeerRating}
                valueLabelDisplay='auto'
                getAriaValueText={valuetext}
                data-testid='joinGroup-peer-rating'
              />
            </Grid>

            <Grid item xs={12}>
              <Typography>
                Hostile Rating: Between {criteria.hostileRating[0]} and{' '}
                {criteria.hostileRating[1]}
              </Typography>
              <Slider
                getAriaLabel={() => 'Hostile rating range'}
                name='hostileRating'
                disabled={user?.hostileRating === null}
                max={10}
                step={0.1}
                value={criteria.hostileRating}
                onChange={handleChangeHostileRating}
                valueLabelDisplay='auto'
                getAriaValueText={valuetext}
                data-testid='joinGroup-hostile-rating'
              />
            </Grid>

            <Grid item xs={12}>
              <Typography>
                Level of Experience: Between {criteria.levelOfExperience[0]} and{' '}
                {criteria.levelOfExperience[1]}
              </Typography>
              <Slider
                getAriaLabel={() => 'Level of experience range'}
                name='levelOfExperience'
                disabled={user?.levelOfExperience === null}
                max={10}
                value={criteria.levelOfExperience}
                onChange={handleChangeLevelOfExperience}
                valueLabelDisplay='auto'
                getAriaValueText={valuetext}
                data-testid='joinGroup-level-of-experience'
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmit}
            variant='contained'
            data-testid='group-search-button'
          >
            Search
          </Button>
          <Button onClick={props.handleClose} variant='contained'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
        open={!user || backdrop}
        data-testid='circular-progress-joinGroup'
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <Snackbar
        open={openMessage}
        autoHideDuration={5000}
        onClose={handleCloseMessage}
        message={message}
        action={actionMessage}
      />
      {openResult ? (
        <SearchResultGroup open={openResult} handleClose={handleCloseResult} />
      ) : null}
    </>
  );
}

export default JoinGroup;

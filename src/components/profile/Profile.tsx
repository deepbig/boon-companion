import {
  Box,
  Button,
  Chip,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { auth } from 'db';
import { deleteAllActivitiesByUserId } from 'db/repository/activity';
import { signOutUser } from 'db/repository/auth';
import { deleteUser, updateUser } from 'db/repository/user';
import { useAppDispatch, useAppSelector } from 'hooks';
import { isFound } from 'lib/common';
import { setBackdrop } from 'modules/backdrop';
import { getUser, setUser } from 'modules/user';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { exitAllGroupsByUserId } from 'db/repository/group';

function Profile() {
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();
  const currentUser = auth.currentUser;
  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [values, setValues] = useState<any>();
  const [interest, setInterest] = useState('');

  useEffect(() => {
    if (user) {
      setValues({ ...user });
    }
  }, [user]);

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

  const handleChange = (e: any) => {
    setValues({
      ...values,
      [e.target.name]:
        e.target.name === 'age' ? +e.target.value : e.target.value,
    });
  };

  const handleChangeText = (e: any) => {
    setInterest(e.target.value);
  };

  const handleAddInterest = () => {
    let splitStr = interest.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    const newInterest = splitStr.join(' ');

    if (isFound(newInterest, values.interests)) {
      alert('You cannot add same interest twice.');
    } else {
      const newInterests = [...values.interests];
      newInterests.push(newInterest);
      setValues({ ...values, interests: newInterests });
    }

    setInterest('');
  };

  const handleDeleteInterest = (interest: string) => {
    if (!isFound(interest, values.interests)) {
      alert('You cannot delete a interest that is not in your list.');
    } else {
      const newInterests = values.interests.filter(
        (value: string) => value !== interest
      );
      setValues({ ...values, interests: newInterests });
    }
  };

  const handleUpdateProfile = async (e: any) => {
    e.preventDefault();

    if (currentUser && values.interests?.length > 0) {
      dispatch(setBackdrop(true));
      const user = await updateUser(currentUser.uid, values);
      if (user) {
        dispatch(setUser(user));
        setMessage('User profile is successfully updated!');
        setOpenMessage(true);
      } else {
        setMessage('User update process was not successful. Please try again.');
        setOpenMessage(true);
      }
      dispatch(setBackdrop(false));
    } else {
      setMessage('You need to have at least one interest!');
      setOpenMessage(true);
    }
  };

  const handleDeleteAccount = async () => {
    if (currentUser) {
      if (
        window.confirm(
          'Are you sure you want to delete account and all histories?'
        )
      ) {
        dispatch(setBackdrop(true));
        let result = await deleteAllActivitiesByUserId(currentUser.uid);
        if (!result) {
          dispatch(setBackdrop(false));
          return;
        }
        result = await deleteUser(currentUser.uid);
        if (!result) {
          dispatch(setBackdrop(false));
          return;
        }
        if (user?.groups) {
          await exitAllGroupsByUserId(currentUser.uid, user.groups);
        }
        signOutUser();
        setMessage('User account is successfully deleted.');
        setOpenMessage(true);
      }
    } else {
      alert('User is not logged in.');
    }
  };

  return (
    <>
      <Box
        display='flex'
        flexDirection='column'
        height='100%'
        justifyContent='center'
      >
        <Container maxWidth='sm'>
          <form onSubmit={handleUpdateProfile}>
            <Box mb={3}>
              <Typography color='textPrimary' variant='h3' align='center'>
                {user?.displayName}'s Profile
              </Typography>
            </Box>
            {values ? (
              <>
                <TextField
                  label='Display Name'
                  margin='normal'
                  name='displayName'
                  variant='outlined'
                  required
                  fullWidth
                  onChange={handleChange}
                  value={values.displayName}
                />
                <TextField
                  label='Email'
                  margin='normal'
                  name='email'
                  variant='outlined'
                  disabled
                  fullWidth
                  value={values.email}
                />

                <Grid item xs={12}>
                  <Typography>Gender</Typography>
                  <RadioGroup
                    row
                    aria-labelledby='gender-label'
                    name='gender'
                    value={values.gender}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value='female'
                      control={<Radio />}
                      label='Female'
                    />
                    <FormControlLabel
                      value='male'
                      control={<Radio />}
                      label='Male'
                    />
                    <FormControlLabel
                      value='other'
                      control={<Radio />}
                      label='Other'
                    />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12}>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography component='h2' variant='h6' gutterBottom>
                      Interrests
                    </Typography>
                  </Box>
                  <TextField
                    margin='dense'
                    id='interest'
                    name='interest'
                    fullWidth
                    variant='outlined'
                    onChange={handleChangeText}
                    size='small'
                    value={interest}
                  />
                  <Button
                    variant='contained'
                    onClick={handleAddInterest}
                    fullWidth
                    disabled={!interest}
                    component='label'
                  >
                    Add
                  </Button>
                  <Paper variant='outlined' sx={{ marginTop: 0.5 }}>
                    <Paper
                      component='ul'
                      elevation={0}
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        margin: 1,
                        padding: 0,
                      }}
                    >
                      {values.interests.length > 0 ? (
                        values.interests.map((interest: string, i: number) => (
                          <li key={i}>
                            <Chip
                              label={interest}
                              sx={{ margin: 0.5 }}
                              onDelete={() => {
                                handleDeleteInterest(interest);
                              }}
                              color='primary'
                            />
                          </li>
                        ))
                      ) : (
                        <Typography variant='guideline' align='center'>
                          Please add a tag to display list.
                        </Typography>
                      )}
                    </Paper>
                  </Paper>
                </Grid>

                <TextField
                  label='Age'
                  margin='normal'
                  name='age'
                  type='number'
                  variant='outlined'
                  inputProps={{ min: 0, max: 120 }}
                  fullWidth
                  onChange={handleChange}
                  value={values.age ? values.age : 0}
                />

                <TextField
                  label='Hostile Rating'
                  margin='normal'
                  name='hostileRating'
                  type='number'
                  variant='outlined'
                  fullWidth
                  disabled
                  value={values.hostileRating}
                />

                <TextField
                  label='Level of Experience'
                  margin='normal'
                  name='levelOfExperience'
                  type='number'
                  variant='outlined'
                  fullWidth
                  disabled
                  value={values.levelOfExperience}
                />

                <TextField
                  label='Peer Rating'
                  margin='normal'
                  name='hostileRating'
                  type='number'
                  variant='outlined'
                  fullWidth
                  disabled
                  value={values.peerRating}
                />
              </>
            ) : null}

            <Box my={2}>
              <Grid container justifyContent='center' spacing={2}>
                <Grid item>
                  <Button
                    color='primary'
                    // disabled={isSubmitting}
                    fullWidth
                    size='large'
                    type='submit'
                    variant='contained'
                  >
                    Update Profile
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color='primary'
                    fullWidth
                    size='large'
                    variant='contained'
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        </Container>
      </Box>
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

export default Profile;

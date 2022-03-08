import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'hooks';
import { currentDate } from 'lib/common';
import { getSelectedInterest } from 'modules/interests';
import React, { useState } from 'react';
import { ActivityAddFormData, ActivityData } from 'types';
import { saveActivity } from 'db/repository/activity';
import { auth } from 'db';
import { getActivities, setActivityList } from 'modules/activity';

interface ActivityAddFormProps {
  open: boolean;
  handleClose: () => void;
}

function ActivityAddForm(props: ActivityAddFormProps) {
  const selectedInterest = useAppSelector(getSelectedInterest);
  const activities = useAppSelector(getActivities);
  const dispatch = useAppDispatch();
  const currentUser = auth.currentUser;
  const [values, setValues] = useState<ActivityAddFormData>({
    interest: '',
    date: currentDate(),
    description: '',
    duration: 0,
    performance: 0,
    uid: '',
  });
  const [backdrop, setBackdrop] = useState(false);

  const handleSubmit = async () => {
    // need to add interset values.
    if (selectedInterest && currentUser) {
      const addValues = {
        ...values,
        interest: selectedInterest,
        uid: currentUser.uid,
      };

      setBackdrop(true);

      const newActivity: ActivityData | null = await saveActivity(addValues);
      let updatedActivities = [...activities];
      // find right location from backward.
      if (newActivity) {
        const newActivityDate = newActivity.date.toDate().getTime();
        if (updatedActivities[0].date.toDate().getTime() > newActivityDate) {
          updatedActivities.splice(0, 0, newActivity);
        } else {
          for (let i = updatedActivities.length - 1; i >= 0; i--) {
            if (
              updatedActivities[i].date.toDate().getTime() <= newActivityDate
            ) {
              updatedActivities.splice(i + 1, 0, newActivity);
              break;
            }
          }
        }
        dispatch(setActivityList(updatedActivities));
      } else {
        alert(
          'Failed to save activity due to database error. Please try again.'
        );
      }

      setBackdrop(false);
      props.handleClose();
      // reset state
      setValues({
        interest: '',
        date: currentDate(),
        description: '',
        duration: 0,
        performance: 0,
        uid: '',
      });
    } else {
      alert(
        'User is not logged in correctly. Please logout and login again to continue this process.'
      );
      props.handleClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.id]: e.target.value,
    });
  };

  const maxDate = currentDate();
  return (
    <>
      <Dialog open={props.open}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          Activity Add Form
        </DialogTitle>
        <DialogContent>
          <form
            id='activity-add-form'
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <TextField
              autoFocus
              required
              margin='dense'
              id='date'
              label='Date'
              type='date'
              fullWidth
              variant='standard'
              defaultValue={maxDate}
              inputProps={{ min: '1900-01-01', max: maxDate }}
              onChange={handleChange}
            />
            <TextField
              margin='dense'
              id='description'
              label='Description'
              fullWidth
              multiline
              maxRows={5}
              variant='standard'
              onChange={handleChange}
            />
            <TextField
              required
              margin='dense'
              id='duration'
              label='Duration (mins)'
              type='number'
              fullWidth
              variant='standard'
              onChange={handleChange}
            />
            <TextField
              margin='dense'
              id='performance'
              label='Performance'
              type='number'
              fullWidth
              variant='standard'
              onChange={handleChange}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button type='submit' form='activity-add-form' variant='contained'>
            Add
          </Button>
          <Button onClick={props.handleClose} variant='contained'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
        open={backdrop}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  );
}

export default ActivityAddForm;

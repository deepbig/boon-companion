import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from 'hooks';
import { getActivities, setActivityList } from 'modules/activity';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteActivity } from 'db/repository/activity';
import { getUser, setUser } from 'modules/user';
import { auth } from 'db';
import { getUserFromDB, updateUserInterest } from 'db/repository/user';

function RecentActivity() {
  const activities = useAppSelector(getActivities);
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUser);
  const currentUser = auth.currentUser;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      const activity = activities[activities.length - 1];
      let interest = user?.performances?.[activity.interest];
      if (interest) {
        deleteActivity(activity.id);
        const newActivities = [...activities];
        newActivities.pop();
        dispatch(setActivityList(newActivities));
        if (currentUser) {
          await updateUserInterest(
            currentUser?.uid,
            activity.interest,
            interest.totalPractices - 1,
            interest.totalDurations - activity.duration
          );
          const user = await getUserFromDB(currentUser.uid);
          if (user) {
            dispatch(setUser(user));
          }
        }
      } else {
        alert(
          "delete process was not successful because user don't have selected interest"
        );
      }
    }
  };
  
  return (
    <Box>
      <Grid container direction='row'>
        <Grid item xs={12}>
          {activities.length > 0 ? (
            <Card>
              <CardHeader
                action={
                  <IconButton aria-label='delete' onClick={handleDelete}>
                    <DeleteIcon />
                  </IconButton>
                }
                title={activities[activities.length - 1]?.date
                  .toDate()
                  .toLocaleString()}
              />
              <CardContent>
                <Typography variant='body2' color='text.secondary'>
                  description: {activities[activities.length - 1]?.description}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  duration: {activities[activities.length - 1]?.duration}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  performance: {activities[activities.length - 1]?.performance}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Box>
              <Typography variant='guideline' align='center'>
                There is no recent activity. Please add one!
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default RecentActivity;

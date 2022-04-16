import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';
import { useAppSelector } from 'hooks';
import React, { useEffect, useState } from 'react';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TimerIcon from '@mui/icons-material/Timer';
import { getUser } from 'modules/user';
import { getSelectedInterest } from 'modules/interests';
// import StarIcon from '@mui/icons-material/Star';

function ActivityPerformance() {
  const user = useAppSelector(getUser);
  const selectedInterest = useAppSelector(getSelectedInterest);
  const [totalPractices, setTotalPractices] = useState<number>(0);
  const [totalDurations, setTotalDurations] = useState<number>(0);

  useEffect(() => {
    if (user && selectedInterest) {
      getInterestValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selectedInterest]);

  const getInterestValue = async () => {
    if (user) {
      const interest = user.performances?.[selectedInterest];
      if (interest) {
        setTotalPractices(interest.totalPractices);
        setTotalDurations(interest.totalDurations);
      } else {
        setTotalPractices(0);
        setTotalDurations(0);
      }
    }
  };

  return (
    <Box m={2}>
      <Grid container direction='row'>
        <Grid item xs={12}>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <DateRangeIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${totalPractices} practices`}
                secondary='Total Practice Counts'
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <TimerIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${
                  totalDurations >= 60
                    ? (totalDurations / 60).toFixed(1) + ' hours'
                    : totalDurations + ' mins'
                } (Level ${
                  totalDurations > 600000
                    ? '10'
                    : Math.ceil(totalDurations / 60000)
                })`}
                secondary='Total Practice Durations (Level of Experience)'
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ActivityPerformance;

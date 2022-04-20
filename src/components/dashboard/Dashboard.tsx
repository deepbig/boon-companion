import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Backdrop,
  CircularProgress,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Title from 'components/title/Title';
import { useTheme } from '@mui/material/styles';
import Copyright from 'components/copyright/Copyright';
import ActivityHistory from 'components/activityHistory/ActivityHistory';
import JoinedGroup from 'components/joinedGroup/JoinedGroup';
import ActivityPerformance from 'components/activityPerformance/ActivityPerformance';
import ActivityAddForm from 'components/activityHistory/ActivityAddForm';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getUser } from 'modules/user';
import InterestAddForm from 'components/addInterest/InterestAddForm';
import { getSelectedInterest, setSelectedInterest } from 'modules/interests';
import RecentActivity from 'components/activityHistory/RecentActivity';
import { getProfanityList, setProfanityList } from 'modules/profanity';

function Dashboard() {
  const theme = useTheme();
  const [openActivity, setOpenActivity] = useState(false);
  const [openInterest, setOpenInterest] = useState(false);
  const selectedInterest = useAppSelector(getSelectedInterest);
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();
  const profanityList = useAppSelector(getProfanityList);

  useEffect(() => {
    if (user && !selectedInterest) {
      if (user.interests?.length <= 0) {
        setOpenInterest(true);
      } else {
        dispatch(setSelectedInterest(user.interests[0]));
        setOpenInterest(false);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (profanityList.length <= 0) {
      const fetchProfanityWords = async () => {
        await fetch('./list.txt')
          .then((res) => res.text())
          .then((txt) => {
            dispatch(setProfanityList(txt.toString().split(/\r\n|\n/)));
          });
      };
      fetchProfanityWords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profanityList]);

  const handleChangeInterest = (e: SelectChangeEvent) => {
    dispatch(setSelectedInterest(e.target.value as string));
  };

  const handleCloseActivityForm = () => {
    setOpenActivity(false);
  };

  const handleOpenActivityForm = () => {
    setOpenActivity(true);
  };

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      {openInterest ? (
        <InterestAddForm
          open={openInterest}
          isFirst={true}
          handleClose={handleCloseActivityForm}
        />
      ) : null}

      <Grid container direction='row' spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography component='h2' variant='h6' align='center'>
                <FormControl sx={{ minWidth: 300 }}>
                  <InputLabel id='demo-simple-select-label'>
                    Interest
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={selectedInterest}
                    label='Interest'
                    onChange={handleChangeInterest}
                  >
                    {user?.interests
                      ? user.interests.map((interest, i) => (
                          <MenuItem key={i} value={interest}>
                            {interest}
                          </MenuItem>
                        ))
                      : null}
                  </Select>
                </FormControl>
              </Typography>
            </Grid>
            {/* Activity History */}
            <Grid item xs={12}>
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Title buttonFunction={handleOpenActivityForm}>
                  Activity History
                </Title>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    overflow: 'hidden',
                  }}
                >
                  <ActivityHistory />
                  <ActivityAddForm
                    open={openActivity}
                    handleClose={handleCloseActivityForm}
                  />
                  {/* TODO - Need to create dummy card for this section */}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 187,
              [theme.breakpoints.up('lg')]: {
                maxHeight: 632,
              },
              overflow: 'hidden',
              overflowY: 'auto',
            }}
            elevation={4}
          >
            <Title>Joined Group</Title>
            <JoinedGroup />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 187,
              [theme.breakpoints.up('lg')]: {
                maxHeight: 632,
              },
              overflow: 'hidden',
              overflowY: 'auto',
            }}
            elevation={4}
          >
            <Title>Activity Performance</Title>
            <ActivityPerformance />
            <Title>Recent Activity</Title>
            <RecentActivity />
          </Paper>
        </Grid>
      </Grid>
      <Copyright sx={{ pt: 4 }} />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
        open={!user}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </Container>
  );
}

export default Dashboard;

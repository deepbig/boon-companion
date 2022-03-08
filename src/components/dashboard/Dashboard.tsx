import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Box } from '@mui/material';
import Title from 'components/title/Title';
import { useTheme } from '@mui/material/styles';
import Copyright from 'components/copyright/Copyright';
import ActivityHistory from 'components/activityHistory/ActivityHistory';
import JoinedGroup from 'components/joinedGroup/JoinedGroup';
import ActivityGoal from 'components/activityGoal/ActivityGoal';
import ActivityAddForm from 'components/activityHistory/ActivityAddForm';
import { getProfanityList, setProfanityList } from 'modules/profanity';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getUser } from 'modules/user';
import InterestAddForm from 'components/addInterest/InterestAddForm';

function Dashboard() {
  const theme = useTheme();
  const [openActivity, setOpenActivity] = useState(false);
  const [openInterest, setOpenInterest] = useState(false);
  const profanityList = useAppSelector(getProfanityList);
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (profanityList.length <= 0) {
      const fetchProfanityWords = async () => {
        await fetch('./list.txt')
          .then((res) => res.text())
          .then((txt) => {
            dispatch(setProfanityList(txt.split('\n')));
          });
      };
      fetchProfanityWords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profanityList]);

  useEffect(() => {
    if (user && user.interests?.length <= 0) {
      setOpenInterest(true);
    } else {
      setOpenInterest(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Example function: Use the following function format to find profanity words from user's text message
  // const checkProfanityWords = (user_string_input: string) => {
  //   const words = user_string_input.split(' ');
  //   let result = false;
  //   for (let word of words) {
  //     console.log(word);
  //     if (profanityList.indexOf(word) > -1) {
  //       result = true;
  //       console.log('test?');
  //       break;
  //     }
  //   }
  //   console.log('result: ', result);
  //   return result;
  // };

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
            <Title
              buttonFunction={() => {
                alert('Need to develop Activity Goal Form');
              }}
            >
              Activity Goal
            </Title>
            <ActivityGoal />
          </Paper>
        </Grid>
      </Grid>
      <Copyright sx={{ pt: 4 }} />
    </Container>
  );
}

export default Dashboard;

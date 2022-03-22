import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Box, Typography } from '@mui/material';
import Title from 'components/title/Title';
import { useTheme } from '@mui/material/styles';
import Copyright from 'components/copyright/Copyright';
import ActivityHistory from 'components/activityHistory/ActivityHistory';
import JoinedGroup from 'components/joinedGroup/JoinedGroup';
import ActivityGoal from 'components/activityGoal/ActivityGoal';
import ActivityAddForm from 'components/activityHistory/ActivityAddForm';
import { useAppDispatch, useAppSelector } from 'hooks';
import HostileRating from 'components/hostileRating/HostileRating';
import { getUser } from 'modules/user';
import InterestAddForm from 'components/addInterest/InterestAddForm';
import { getSelectedInterest, setSelectedInterest } from 'modules/interests';

function Group() {
  const theme = useTheme();
  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      {/* <Grid container direction='row' spacing={2}>
        <Grid item xs={12}> */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography component='h2' variant='h6' align='center'>
                Group Name:
              </Typography>
              <Typography component='h4' variant='h6' align='center'>
                Description:
              </Typography>
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
                <Title>Group Members</Title>
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
                <Title>Shared Tips</Title>
              </Paper>
            </Grid>
          {/* </Grid>
        </Grid> */}

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
            elevation={10}
          >
            <Title>Recent Group Activities</Title>
          </Paper>
        </Grid>
      </Grid>
      <Copyright sx={{ pt: 4 }} />
    </Container>
  );
}

export default Group;

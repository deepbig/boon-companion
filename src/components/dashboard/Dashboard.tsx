import React from 'react';
import { Container, Grid, Paper, Box } from '@mui/material';
import Title from 'components/title/Title';
import { useTheme } from '@mui/material/styles';
import Copyright from 'components/copyright/Copyright';
import ActivityHistory from 'components/activityHistory/ActivityHistory';

function Dashboard() {
  const theme = useTheme();
  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
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
                <Title>Activity History</Title>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    overflow: 'hidden',
                  }}
                >
                  <ActivityHistory />
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
              [theme.breakpoints.up('lg')]: {
                maxHeight: 632,
              },
              overflow: 'hidden',
              overflowY: 'auto',
            }}
            elevation={4}
          >
            <Title>Joined Group</Title>
            {/* <JoinedGrop /> */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              [theme.breakpoints.up('lg')]: {
                maxHeight: 632,
              },
              overflow: 'hidden',
              overflowY: 'auto',
            }}
            elevation={4}
          >
            <Title>Activity Goal</Title>
            {/* <ActivityGoal /> */}
          </Paper>
        </Grid>
      </Grid>
      <Copyright sx={{ pt: 4 }} />
    </Container>
  );
}

export default Dashboard;

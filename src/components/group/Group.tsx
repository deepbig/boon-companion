import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Stack,
  Tooltip,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  Box,
  Button,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import Title from 'components/title/Title';
import Copyright from 'components/copyright/Copyright';
import { GroupData, ActivityData, MemberData } from 'types';
import PeerRating from 'components/peerRating/PeerRating';
import { auth } from '../../db';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getUser, setUser } from 'modules/user';
import { setBackdrop } from 'modules/backdrop';
import { exitGroupByUserId, getGroupById } from 'db/repository/group';
import { delUserGroup, getUserFromDB } from 'db/repository/user';
import { getActivityListByUserIds } from 'db/repository/activity';
import SharedTips from 'components/group/SharedTips';

function Group() {
  const { id } = useParams();
  const [openSharedTips, setOpenSharedTips] = useState(false);
  const [group, setGroup] = useState<GroupData>();
  const [activities, setActivities] = useState<ActivityData[]>();
  const [openPeerRating, setOpenPeerRating] = useState<MemberData | null>(null);
  const user = useAppSelector(getUser);
  const currentUser = auth.currentUser;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const theme = useTheme();

  const handleSharedTipsForm = () => {
    setOpenSharedTips(true);
  };

  const handleClose = () => {
    setOpenSharedTips(false);
  };

  useEffect(() => {
    if (currentUser && !openSharedTips) {
      const getGroup = async () => {
        const groupData = await getGroupById(id as string);
        if (groupData) {
          groupData.notes &&
            groupData.notes.sort((a, b) => (a.date < b.date ? 1 : -1));
          groupData.notes = groupData.notes && groupData.notes.slice(0, 10);
          setGroup(groupData);

          const memberIds = groupData.members.map((member) => member.uid);

          if (memberIds.length > 0) {
            const res = await getActivityListByUserIds(
              groupData.interest,
              memberIds
            );
            setActivities(res);
          } else {
            alert('There are no member in this group to display activities.');
          }
        }
      };
      getGroup();
    }
  }, [id, currentUser, openSharedTips]);

  const handleExitGroup = async () => {
    if (window.confirm('Are you sure you want to exit this group?')) {
      if (user && currentUser) {
        dispatch(setBackdrop(true));
        await exitGroupByUserId(currentUser.uid, id as string);
        await delUserGroup(currentUser.uid, id as string);
        const newUser = await getUserFromDB(currentUser.uid);
        if (newUser) {
          dispatch(setUser(newUser));
        }
        navigate('/dashboard');
        dispatch(setBackdrop(false));
        alert('Exit group process was successfully completed.');
      }
    }
  };

  const handlePeerRating = (member: MemberData) => {
    setOpenPeerRating(member);
  };

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography component='h2' variant='h6' align='center'>
            Group Name: {group && group.title}
          </Typography>
          <Typography component='h4' variant='h6' align='center'>
            Description: {group && group.description}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid item xs={12} md={12}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 175,
                [theme.breakpoints.up('lg')]: {
                  maxHeight: 245,
                },
              }}
              elevation={4}
            >
              <Box display='flex' justifyContent='space-between'>
                <Typography component='h2' variant='h6' gutterBottom>
                  Group Members
                </Typography>
                <Button onClick={handleExitGroup} variant='contained'>
                  Exit Group
                </Button>
              </Box>
              <Stack
                direction='row'
                spacing={1}
                style={{ flexWrap: 'wrap', overflow: 'auto' }}
              >
                {group &&
                  group.members &&
                  group.members.map((member, i) => (
                    <Card
                      key={i}
                      style={{ margin: '5px' }}
                      onClick={() => handlePeerRating(member)}
                    >
                      <CardMedia
                        component='img'
                        height='100'
                        image={member.photoURL}
                        alt={member.displayName}
                      />
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant='body2'
                          component='span'
                        >
                          {member.displayName}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={12} sx={{ mt: 3 }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 187,
                [theme.breakpoints.up('lg')]: {
                  maxHeight: 481,
                },
              }}
              elevation={4}
            >
              <Title buttonFunction={handleSharedTipsForm}>Shared Tips</Title>
              <Stack
                direction='row'
                spacing={2}
                sx={{ flexWrap: 'wrap', overflow: 'auto', mt: 2 }}
              >
                {group &&
                  group.notes &&
                  group.notes.map((note, i) => (
                    <Card
                      key={i}
                      sx={{
                        backgroundColor: grey[100],
                      }}
                      style={{ margin: '5px', minWidth: '95%' }}
                    >
                      <CardContent>
                        <Grid container spacing={1}>
                          <Grid item xs={11}>
                            <Typography variant='subtitle1'>
                              {note.note}
                            </Typography>
                          </Grid>
                          <Grid item xs={1}>
                            <Tooltip title={note.displayName}>
                              <Avatar
                                alt={note.displayName}
                                src={note.photoURL}
                              />
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
              </Stack>
              <SharedTips
                open={openSharedTips}
                onClose={handleClose}
                groupId={id as string}
              />
            </Paper>
          </Grid>
        </Grid>

        <Grid item xs={6} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 250,
              [theme.breakpoints.up('lg')]: {
                maxHeight: 750,
              },
            }}
            elevation={10}
          >
            <Title>Recent Group Activities</Title>
            <Stack
              direction='row'
              spacing={2}
              style={{ flexWrap: 'wrap', overflow: 'auto' }}
            >
              {activities &&
                activities.map((activity, i) => (
                  <Card
                    key={i}
                    sx={{
                      backgroundColor: grey[100],
                    }}
                    style={{ margin: '5px', minWidth: '47%' }}
                  >
                    <CardContent>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color='text.secondary'
                        gutterBottom
                      >
                        {activity.date.toDate().toLocaleDateString('en-US')}
                      </Typography>
                      <Typography variant='h6' component='div'>
                        Interest: {activity.interest}
                      </Typography>
                      <Typography variant='subtitle1'>
                        {activity.description}
                      </Typography>
                      <Typography color='text.secondary'>
                        Duration: {activity.duration}
                      </Typography>
                      <Typography color='text.secondary'>
                        Performance: {activity.performance}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
            </Stack>
          </Paper>
        </Grid>
        {openPeerRating ? (
          <PeerRating
            member={openPeerRating}
            handleClose={() => {
              setOpenPeerRating(null);
            }}
          />
        ) : null}
      </Grid>
      <Copyright sx={{ pt: 4 }} />
    </Container>
  );
}

export default Group;

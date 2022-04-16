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
import { GroupData, ActivityData } from 'types';
import PeerRating from 'components/peerRating/PeerRating';
import db, { auth } from '../../db';
import {
  query,
  collection,
  where,
  doc,
  getDoc,
  getDocs,
  limit,
} from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getUser, setUser } from 'modules/user';
import { setBackdrop } from 'modules/backdrop';
import { exitGroupByUserId } from 'db/repository/group';
import { delUserGroup, getUserFromDB } from 'db/repository/user';
import SharedTips from 'components/group/SharedTips';

function Group() {
  const { id } = useParams();
  const [openSharedTips, setOpenSharedTips] = useState(false);
  const [group, setGroup] = useState<GroupData>();
  const [activities, setActivities] = useState<ActivityData[]>();
  const user = useAppSelector(getUser);
  const currentUser = auth.currentUser;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const theme = useTheme();

  const handleSharedTipsForm = () => {
    setOpenSharedTips(true);
  };

  const handleClose = (event: any, reason: any) => {
    if (reason !== 'backdropClick') {
      setOpenSharedTips(false);
    }
  };

  useEffect(() => {
    const getGroup = async () => {
      const groupRef = doc(db, 'groups', id as string);
      const groupSnap = await getDoc(groupRef);
      const groupData = groupSnap.data() as GroupData;
      groupData.notes &&
        groupData.notes.sort((a, b) => (a.date > b.date ? 1 : -1));
      groupData.notes = groupData.notes && groupData.notes.slice(0, 10);
      setGroup(groupData);

      const memberIds = groupData.members.map((member) => member.uid);
      const activitiesRef = await query(
        collection(db, 'user_interest_activity'),
        where('interest', '==', groupData.interest),
        where('uid', 'in', memberIds),
        limit(10)
      );
      const activitiesSnap = await getDocs(activitiesRef);
      const activitiez = [] as ActivityData[];
      activitiesSnap.forEach((doc) =>
        activitiez.push(doc.data() as ActivityData)
      );
      activitiez.sort((a, b) => (a.date > b.date ? 1 : -1));
      setActivities(activitiez.reverse());
    };

    getGroup();
  }, [id, openSharedTips]);

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
        <Grid item xs={6} spacing={4}>
          <Grid item xs={12} md={12} spacing={2}>
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
                    <Card style={{ margin: '5px' }}>
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

          <Grid item xs={12} md={12} spacing={2} sx={{ mt: 3 }}>
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
                activities.map((activity) => (
                  <Card
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
        <PeerRating />
      </Grid>
      <Copyright sx={{ pt: 4 }} />
    </Container>
  );
}

export default Group;

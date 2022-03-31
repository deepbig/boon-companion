import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Stack,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  useTheme,
} from '@mui/material';
import Title from 'components/title/Title';
import Copyright from 'components/copyright/Copyright';
import { GroupData, ActivityData } from 'types';
import db from '../../db';
import { auth } from 'db';
import {
  query,
  collection,
  where,
  doc,
  getDoc,
  getDocs,
  limit,
} from 'firebase/firestore';

function Group() {
  const { id } = useParams();
  const [group, setGroup] = useState<GroupData>();
  const [activities, setActivities] = useState<ActivityData[]>();

  const theme = useTheme();

  useEffect(() => {
    const getGroup = async () => {
      const groupRef = doc(db, 'groups', id as string);
      const groupSnap = await getDoc(groupRef);
      const groupData = groupSnap.data() as GroupData;
      setGroup(groupData);

      // const memberIds = groupData.members.map((member) => member.uid);
      const activitiesRef = await query(
        collection(db, 'user_interest_activity'),
        where('interest', '==', groupData.interest),
        
        // currently you can only access logged in user's activities
        // if you add all members you get an error "Group.tsx:63 Uncaught (in promise) FirebaseError: Missing or insufficient permissions."
        // For now, adding the logged in user's uid
        
        where('uid', 'in', [auth.currentUser?.uid || '']),
        //where('uid', 'in', memberIds), // TODO: make this work with array after fixing the permissions
        limit(10)
      );
      const activitiesSnap = await getDocs(activitiesRef);
      const activitiez = [] as ActivityData[];
      activitiesSnap.forEach((doc) =>
        activitiez.push(doc.data() as ActivityData)
      );
      setActivities(activitiez);
    };

    getGroup();
  }, [id]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography component="h2" variant="h6" align="center">
            Group Name: {group && group.title}
          </Typography>
          <Typography component="h4" variant="h6" align="center">
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
                minHeight: 187,
                [theme.breakpoints.up('lg')]: {
                  maxHeight: 632,
                },
                overflow: 'auto',
              }}
              elevation={4}
            >
              <Title>Group Members</Title>
              <Stack direction="row" spacing={1} style={{ flexWrap: 'wrap' }}>
                {group &&
                  group.members &&
                  group.members.map((member, i) => (
                    <Card sx={{ maxWidth: 345 }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="100"
                          image={member.photoURL}
                          alt={member.displayName}
                        />
                        <CardContent>                         
                          <Typography
                            gutterBottom
                            variant="body2"
                            component="span"
                          >
                            {member.displayName}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
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
                flexDirection: 'row',
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
        </Grid>

        <Grid item xs={6} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 250,
              [theme.breakpoints.up('lg')]: {
                maxHeight: 632,
              },
              overflow: 'hidden',
              overflowY: 'auto',
            }}
            elevation={10}
          >
            <Title>Recent Group Activities</Title>
            <Stack direction="row" spacing={2} style={{ flexWrap: 'wrap' }}>
              {activities &&
                activities.map((activity) => (
                  <Card variant="outlined" style={{ margin: '5px' }}>
                    <CardContent>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        {activity.date.toDate().toLocaleDateString('en-US')}
                      </Typography>
                      <Typography variant="h6" component="div">
                        Interest: {activity.interest}
                      </Typography>
                      <Typography variant="subtitle1">
                        {activity.description}
                      </Typography>
                      <Typography color="text.secondary">
                        Duration: {activity.duration}
                      </Typography>
                      <Typography color="text.secondary">
                        Performance: {activity.performance}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      <Copyright sx={{ pt: 4 }} />
    </Container>
  );
}

export default Group;

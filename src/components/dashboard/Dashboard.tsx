import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import Title from 'components/title/Title';
import { useTheme } from '@mui/material/styles';
import Copyright from 'components/copyright/Copyright';
import ActivityHistory from 'components/activityHistory/ActivityHistory';
import JoinedGroup from 'components/joinedGroup/JoinedGroup';
import ActivityGoal from 'components/activityGoal/ActivityGoal';
import ActivityAddForm from 'components/activityHistory/ActivityAddForm';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getUser } from 'modules/user';
import InterestAddForm from 'components/addInterest/InterestAddForm';
import { getSelectedInterest, setSelectedInterest } from 'modules/interests';
import { getProfanityList, setProfanityList } from 'modules/profanity';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

let count=0;
let hostileRatingCheck=0;
let numberOfBadwords=0;

function Dashboard() {
  const theme = useTheme();
  const [openActivity, setOpenActivity] = useState(false);
  const [openInterest, setOpenInterest] = useState(false);
  const selectedInterest = useAppSelector(getSelectedInterest);
  const profanityList = useAppSelector(getProfanityList);
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();
  var [hostileRating, setHostileRating] = useState(0);

  const db = getFirestore();

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
            dispatch(setProfanityList(txt.split('\n')));
          });
      };
      fetchProfanityWords();
      getHostileRating();
     
     
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profanityList]);
 
useEffect(()=>{
  checkHostileRating();
})
  async function checkHostileRating() {


const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    const usersRef = collection(db, "user_interest_activity");
    // const uid = user.uid;
     // Create a query against the collection.
       const q = query(usersRef, where("uid", "==", uid));
       const querySnapshot = await getDocs(q);
       querySnapshot.forEach((doc) => {            
        
         let result=checkProfanityWords(doc.data().description);
         if(result){
           count=count+1;
         }


       });
       hostileRatingCheck= 10-(count/querySnapshot.size)*10;
       console.log(hostileRatingCheck,count,querySnapshot.size)
       addData(hostileRatingCheck);
       count=0;

    // ...
  } else {
    // User is signed out
    // ...
  }
});
  }
  async function getHostileRating() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        console.log(uid)
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHostileRating(docSnap.data().hostileRating);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
        // ...
      } else {
        // User is signed out
        // ...
      }
    });

  }

  function checkProfanityWords(user_string_input: string) {

  
    const words = user_string_input.toString().split(' ');

    for (let word of words) {
      if (profanityList.indexOf(word +"\r") > -1) {
        return true;
      }
    }
    return false;
  };
  async function addData(result: number) {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        const dbRef = doc(db, "users", uid);
        await updateDoc(dbRef, {
          hostileRating: result
        });
        // ...
      } else {
        // User is signed out
        // ...
      }
    });


  }
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
                Interest: {selectedInterest}
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

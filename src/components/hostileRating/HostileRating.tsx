import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Box } from '@mui/material';
import Title from 'components/title/Title';
import { useTheme } from '@mui/material/styles';
import { getProfanityList, setProfanityList } from 'modules/profanity';
import { useAppDispatch, useAppSelector } from 'hooks';
import { doc, getDoc,setDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore"

function HostileRating(){
  const theme = useTheme();
  const [openActivity, setOpenActivity] = useState(false);
  const profanityList = useAppSelector(getProfanityList);
  const dispatch = useAppDispatch();
  const db = getFirestore();
  var [hostileRating,setHostileRating]=useState(0); 
  var [count,setCount]=useState(0); 

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


  
  //Example function: Use the following function format to find profanity words from user's text message
 const checkProfanityWords = (user_string_input: string) => {
    const words = user_string_input.split(' ');
    let result = 0;
    for (let word of words) {
      if (profanityList.indexOf(word+"\r") > -1) {
        result++;
      }
      
    }
    return result;
  };


  const getHostileRating=async () =>{
      const docRef = doc(db, "users", "pL5toeBR7uQpa9tvv60T88iY8Ww2");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
    setHostileRating(docSnap.data().hostileRating);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    return hostileRating;
  }
  getHostileRating();
  setCount(checkProfanityWords("fuck off mf"));
  console.log(count);
  if(count > 0){
    setHostileRating(count+hostileRating);
   }
   console.log(hostileRating);

    return(
        <>
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
            <Title>
			        Hostile Rating
            </Title>
           <p>Number of bad words used : {hostileRating}</p>
          </Paper>
        </Grid>
        </>
    );
}

export default HostileRating;
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { getProfanityList, setProfanityList } from 'modules/profanity';
import { useAppDispatch, useAppSelector } from 'hooks';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function HostileRating(props: any) {
  const profanityList = useAppSelector(getProfanityList);
  const dispatch = useAppDispatch();
  const db = getFirestore();
  let [hostileRating, setHostileRating] = useState(0);

  useEffect(() => {
    if (profanityList.length <= 0) {
      const fetchProfanityWords = async () => {
        await fetch('./list.txt')
          .then((res) => res.text())
          .then((txt) => {
            dispatch(setProfanityList(txt.toString().split('\n')));
          });
      };
      fetchProfanityWords();
      getHostileRating();
      checkProfanityWords(props.cussword)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profanityList]);

  async function getHostileRating() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setHostileRating(docSnap.data().hostileRating);
          console.log("hostileRating",docSnap.data().gender);
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

  //Example function: Use the following function format to find profanity words from user's text message
  function checkProfanityWords(user_string_input: string) {
    console.log("user_string_input",user_string_input);
    const words = user_string_input.toString().split(' ');
    let result = 0;
    for (let word of words) {
      if (profanityList.indexOf(word + "\r") > -1) {
        result++;
      }
    }
    result = result + hostileRating;
    setHostileRating(result);
    console.log("hostileRating",result);
    addData(result);
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
  return (

    <>
    
    </>
  );
}

export default HostileRating;
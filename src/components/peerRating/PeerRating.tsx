import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import { Grid, Paper, Container } from '@mui/material';
import Title from 'components/title/Title';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { GroupData } from 'types';
import db from '../../db';
import {
    doc,
    getDoc
    } from 'firebase/firestore';
const useStyles = makeStyles({
  root: {
    width: 200,
    display: 'flex',
    alignItems: 'center',
  },
});

function PeerRating() {
  const [value, setValue] = useState<number | null>(0);
  const [hover, setHover] = useState(-1);
  const classes = useStyles();
  const theme = useTheme();
  const { id } = useParams();
  const [group, setGroup] = useState<GroupData>();
  useEffect(() => {
    const getGroup = async () => {
        const groupRef = doc(db, 'groups', id as string);
        const groupSnap = await getDoc(groupRef);
        const groupData = groupSnap.data() as GroupData;
        setGroup(groupData);
    };
    getGroup();
  }, [id]);

  return (
    <Container maxWidth='lg' sx={{ mt: 2, mb: 2 }}>
      <Grid container spacing={2}>
      {group &&
                  group.members &&
                  group.members.map((member, i) => (
      <Grid item xs={12}>
       
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
            Rate your peer: {member.displayName}
          </Title>
         
    <div className={classes.root}>
      <Rating
        name="hover-feedback"
        value={value}
        precision={0.5}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
      />
      {hover !== -1 ? hover : value}
    </div>
    </Paper>
  
          </Grid>
           ))}
      </Grid>
      </Container>
  );
}
export default PeerRating;
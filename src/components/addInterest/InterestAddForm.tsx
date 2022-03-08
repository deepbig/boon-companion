import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { auth } from 'db';
import { getAllInterests, setInterest } from 'db/repository/interests';
import { addUserInterest, getUser } from 'db/repository/user';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getinterestList, setinterestList } from 'modules/interests';
import { setUser } from 'modules/user';
import React, { useEffect, useState } from 'react';

interface InterestAddFormProps {
  open: boolean;
  isFirst: boolean;
  handleClose: () => void;
}

function InterestAddForm(props: InterestAddFormProps) {
  const interestList = useAppSelector(getinterestList);
  const currentUser = auth.currentUser;
  const dispatch = useAppDispatch();
  const [value, setValue] = useState('');
  const [backdrop, setBackdrop] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (interestList.length <= 0) {
      const updateInterestList = async () => {
        const data = await getAllInterests();
        dispatch(setinterestList(data));
      };
      updateInterestList().catch((err) => {
        console.error(err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    if (currentUser) {
      let interest = '';
      const addInterstToDB = async () => {
        setBackdrop(true);
        interest = await setInterest(value);
        if (interest) {
          // If interest value does not exist, the saving process was not copmleted correctly.
          await addUserInterest(currentUser.uid, interest);
        }
        const user = await getUser(currentUser.uid);
        if (user) {
          dispatch(setUser(user));
        }
        setBackdrop(false);
      };
      addInterstToDB();
    } else {
      alert('User is not logged in correctly. Please reflesh your browser.');
    }
  };

  return (
    <>
      <Dialog open={props.open}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          Interest Add Form
        </DialogTitle>
        <DialogContent>
          {props.isFirst ? (
            <DialogContentText mb={1}>
              To start using this service, you need to add an interest.
            </DialogContentText>
          ) : null}

          <Autocomplete
            freeSolo
            id='interest-combo-box'
            onInputChange={(event, newValue: string) => {
              setValue(newValue);
            }}
            options={interestList}
            renderInput={(params) => (
              <TextField {...params} label='Interests' />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAdd}
            variant='contained'
            disabled={value.length > 0 ? false : true}
          >
            Add
          </Button>
          {props.isFirst ? null : (
            <Button onClick={props.handleClose} variant='contained'>
              Cancel
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
        open={backdrop}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  );
}

export default InterestAddForm;

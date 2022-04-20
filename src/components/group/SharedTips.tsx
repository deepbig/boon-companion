import {
  Container,
  TextField,
  FormControl,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { auth } from 'db';
import { Timestamp } from 'firebase/firestore';
import { SharedTipsData } from 'types';
import { checkProfanityWords, currentDateTime } from 'lib/common';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getUser, setUser } from 'modules/user';
import { addGroupNote } from 'db/repository/group';
import { getUserFromDB, updateUserHostileRating } from 'db/repository/user';
import { getProfanityList } from 'modules/profanity';

type SharedTipsFormData = {
  note: string;
};

type SharedTipsProps = {
  open: boolean;
  onClose: () => void;
  groupId: string;
};

function SharedTips({ open, onClose, groupId }: SharedTipsProps) {
  const user = useAppSelector(getUser);
  const currentUser = auth.currentUser;
  const profanityList = useAppSelector(getProfanityList);
  const dispatch = useAppDispatch();

  const { control, reset, handleSubmit } = useForm<SharedTipsFormData>();

  const onSubmit = handleSubmit(async (data) => {
    if (data.note) {
      if (currentUser && user) {
        const sharedTipsData: SharedTipsData = {
          uid: currentUser.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          note: data.note,
          date: Timestamp.fromDate(new Date(currentDateTime())),
        };

        await addGroupNote(groupId, sharedTipsData);
        if (user && currentUser) {
          let totalProfanities = user.totalProfanities ? user.totalProfanities : 0;
          if (await checkProfanityWords(data.note, profanityList)) {
            totalProfanities++;
          }
          await updateUserHostileRating(
            currentUser.uid,
            user.totalPosts ? user.totalPosts + 1 : 1,
            totalProfanities
          );
          const updatedUser = await getUserFromDB(currentUser.uid);
          if (updatedUser) {
            dispatch(setUser(updatedUser));
          }
        }
        reset();
        onClose();
      }
    } else {
      alert('Please add your tip to share with group.');
    }
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>Shared Tips Form</DialogTitle>
      <DialogContent>
        <Container sx={{ mt: 1, '& .MuiTextField-root': { width: '50ch' } }}>
          <form id='shared-tips-form' onSubmit={onSubmit}>
            <FormControl fullWidth>
              <Controller
                name='note'
                control={control}
                render={({ field: { name, value, onChange } }) => (
                  <TextField
                    id='shared-tip'
                    multiline
                    rows={4}
                    name={name}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </FormControl>
          </form>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' type='submit' form='shared-tips-form'>
          ADD
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            reset();
            onClose();
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SharedTips;

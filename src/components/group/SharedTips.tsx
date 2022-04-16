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
import db from '../../db';
import { auth } from 'db';
import { updateDoc, doc, getDoc, Timestamp } from 'firebase/firestore';
import { GroupData, SharedTipsData } from 'types';
import { currentDate } from 'lib/common';
import { getLoggedInUser } from 'db/repository/user';

type SharedTipsFormData = {
  note: string;
};

type SharedTipsProps = {
  open: boolean;
  onClose: (event: any, reason: any) => void;
  groupId: string;
};


function SharedTips({ open, onClose, groupId }: SharedTipsProps) {
  
  const { control, reset, handleSubmit } = useForm<SharedTipsFormData>();

  const onSubmit = handleSubmit(async (data) => {
    const currentUser = auth.currentUser || { uid: '' };
    const user = await getLoggedInUser({
      uid: currentUser.uid,
      displayName: '',
      email: '',
      photoURL: '',
    });
    const sharedTipsData: SharedTipsData = {
      uid: currentUser.uid,
      displayName: user?.displayName || '',
      photoURL: user?.photoURL || '',
      note: data.note,
      date: Timestamp.fromDate(new Date(currentDate()))
    };    
    const groupRef = doc(db, 'groups', groupId as string);
    const groupSnap = await getDoc(groupRef);
    const groupData = groupSnap.data() as GroupData;
    const notes =  groupData.notes || [] ;
    notes.push(sharedTipsData);
    const newFields = { notes: notes };
    await updateDoc(groupRef, newFields);
    reset();
    onClose(null, null);
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>Shared Tips Form</DialogTitle>
      <DialogContent>
        <Container sx={{ mt: 1, '& .MuiTextField-root': { width: '50ch' } }}>
          <form id="shared-tips-form" onSubmit={onSubmit}>
            <FormControl fullWidth>
              <Controller
                name="note"
                control={control}
                render={({ field: { name, value, onChange } }) => (
                  <TextField
                    id="shared-tip"
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
        <Button variant="contained" type="submit" form="shared-tips-form">
          ADD
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            reset();
            onClose(null, null);
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SharedTips;

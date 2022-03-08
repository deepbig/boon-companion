import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import React from 'react';
import { saveActivity } from 'db/repository/activityHistory';

interface ActivityAddFormProps {
  open: boolean;
  handleClose: () => void;
}

const currentDate = () => {
  const dateObj = new Date();
  return `${dateObj.getFullYear()}-${dateObj.getMonth() < 9 ? '0' : ''}${
    dateObj.getMonth() + 1
  }-${dateObj.getDate() < 10 ? '0' : ''}${dateObj.getDate()}`;
};
let updateActivity = { description: '', duration: '', values: '', date: '' };
const setTextValue = (event: any) => {
  if (event.target.id === 'description') {
    updateActivity.description = event.target.value;
  }
  if (event.target.id === 'duration') {
    updateActivity.duration = event.target.value;
  }
  if (event.target.id === 'values') {
    updateActivity.values = event.target.value;
  }
  if (event.target.id === 'date') {
    updateActivity.date = event.target.value;
  }
};
// function popUpClose(props: ActivityAddFormProps) {
//   props.handleClose();
// }
function saveValues() {
  if (
    updateActivity.description !== '' &&
    updateActivity.values !== '' &&
    updateActivity.duration !== '' &&
    updateActivity.date !== ''
  ) {
    saveActivity(updateActivity);
    alert('activity record saved');
  } else {
    alert('select all values');
  }
}
function ActivityAddForm(props: ActivityAddFormProps) {
  //   const [date, setDate] = useState<Date | null>(null);

  const maxDate = currentDate();
  return (
    <Dialog open={props.open}>
      <DialogTitle sx={{ textAlign: 'center' }}>Activity Add Form</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin='dense'
          id='date'
          label='Date'
          type='date'
          fullWidth
          variant='standard'
          defaultValue={maxDate}
          inputProps={{ min: '1900-01-01', max: maxDate }}
          onChange={setTextValue}
        />
        <TextField
          margin='dense'
          id='description'
          label='Description'
          fullWidth
          multiline
          maxRows={5}
          variant='standard'
          onChange={setTextValue}
        />
        <TextField
          required
          margin='dense'
          id='duration'
          label='Duration (mins)'
          type='number'
          fullWidth
          variant='standard'
          onChange={setTextValue}
        />
        <TextField
          required
          margin='dense'
          id='values'
          label='Values'
          type='number'
          fullWidth
          variant='standard'
          onChange={setTextValue}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={saveValues} variant='contained'>
          Add
        </Button>
        <Button onClick={props.handleClose} variant='contained'>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ActivityAddForm;

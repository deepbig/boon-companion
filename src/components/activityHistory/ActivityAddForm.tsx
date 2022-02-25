import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import React from 'react';

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

function ActivityAddForm(props: ActivityAddFormProps) {
  //   const [date, setDate] = useState<Date | null>(null);
  const maxDate = currentDate();

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
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
        />
        <TextField
          margin='dense'
          id='description'
          label='Description'
          fullWidth
          multiline
          maxRows={5}
          variant='standard'
        />
        <TextField
          required
          margin='dense'
          id='duration'
          label='Duration (mins)'
          type='number'
          fullWidth
          variant='standard'
        />
        <TextField
          required
          margin='dense'
          id='values'
          label='Values'
          type='number'
          fullWidth
          variant='standard'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} variant='contained'>
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

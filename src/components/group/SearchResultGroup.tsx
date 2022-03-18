import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
// import { getGroups } from 'modules/group';
// import { useAppSelector } from 'hooks';

interface SearchResultGroupFormProps {
  open: boolean;
  handleClose: (isSelected: boolean) => void;
}

function SearchResultGroup(props: SearchResultGroupFormProps) {
  //   const groups = useAppSelector(getGroups);
  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState('');

  const handleCloseMessage = () => {
    setOpenMessage(false);
    setMessage('');
  };

  const actionMessage = (
    <IconButton
      size='small'
      aria-label='close'
      color='inherit'
      onClick={handleCloseMessage}
    >
      <CloseIcon fontSize='small' />
    </IconButton>
  );

  const handleSubmit = () => {
    setMessage('You are successfully joined the group!');
    setOpenMessage(true);
    props.handleClose(true);
  };

  return (
    <>
      <Dialog open={props.open}>
        <DialogTitle>Group Search Results</DialogTitle>
        <DialogContent>
          <Typography>Result display here.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant='contained'>
            Join
          </Button>
          <Button onClick={() => props.handleClose(false)} variant='contained'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openMessage}
        autoHideDuration={5000}
        onClose={handleCloseMessage}
        message={message}
        action={actionMessage}
      />
    </>
  );
}

export default SearchResultGroup;

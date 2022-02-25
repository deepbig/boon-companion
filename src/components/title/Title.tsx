import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface TitleProps {
  children?: React.ReactNode;
  buttonFunction?: () => void;
}

function Title(props: TitleProps) {
  return (
    <Box display='flex' justifyContent='space-between'>
      <Typography component='h2' variant='h6' gutterBottom>
        {props.children}
      </Typography>
      {props.buttonFunction ? (
        <Button onClick={props.buttonFunction} variant='contained'>
          NEW
        </Button>
      ) : null}
    </Box>
  );
}

export default Title;

import React from 'react';
import Typography from '@mui/material/Typography';

interface TitleProps {
  children?: React.ReactNode;
}

function Title(props: TitleProps) {
  return (
    <Typography component='h2' variant='h6' gutterBottom>
      {props.children}
    </Typography>
  );
}

export default Title;

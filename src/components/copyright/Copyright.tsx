import { Typography } from '@mui/material';

function Copyright(props: any) {
  return (
    <Typography
      variant='body2'
      color='GrayText.secondary'
      align='center'
      {...props}
    >
      {'Copyright © Boon Companion ' + new Date().getFullYear() + '.'}
    </Typography>
  );
}

export default Copyright;

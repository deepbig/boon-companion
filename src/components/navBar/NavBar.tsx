import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import {
  Toolbar,
  IconButton,
  Typography,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import Login from 'components/login/Login';
import Profile from 'components/profile/Profile';
import GroupsIcon from '@mui/icons-material/Groups';

function MenuListItems(props: any) {
  const navigate = useNavigate();

  return (
    <div>
      <ListItem
        button
        onClick={() => navigate(`/dashboard`)}
        sx={{ height: 72 }}
      >
        <ListItemIcon>
          <Badge badgeContent={'✨'}>
            <TrackChangesIcon />
          </Badge>
        </ListItemIcon>
        {props.open ? <ListItemText primary='Dashboard' /> : null}
      </ListItem>
      <ListItem button onClick={() => navigate(`/group`)} sx={{ height: 50 }}>
        <ListItemIcon>
          <Badge>
            <GroupsIcon />
          </Badge>
        </ListItemIcon>
        {props.open ? <ListItemText primary='Group' /> : null}
      </ListItem>
    </div>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    // whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.down('sm')]: {
        width: theme.spacing(0),
      },
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(7.5),
      },
    }),
  },
}));

export default function NavBar({ selectedName }: { selectedName: string }) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <AppBar position='absolute' open={open}>
        <Toolbar
          sx={{
            pr: '24px',
          }}
        >
          {selectedName ? (
            <IconButton
              edge='start'
              color='inherit'
              aria-label='open drawer'
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : null}

          <Typography
            component='h1'
            variant='h6'
            color='inherit'
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {selectedName}
          </Typography>

          {selectedName ? <Profile /> : <Login />}
        </Toolbar>
      </AppBar>
      {selectedName ? (
        <Drawer variant='permanent' open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <MenuListItems open={open} />
        </Drawer>
      ) : null}
    </>
  );
}

import React, { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Backdrop, CircularProgress, CssBaseline } from '@mui/material';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthChange } from 'db/repository/auth';
import LandingPage from 'pages/LandingPage';
import DashboardPage from 'pages/DashboardPage';
import GroupPage from 'pages/GroupPage';
import { useAppDispatch, useAppSelector } from 'hooks';
import { setUser } from 'modules/user';
import { getLoggedInUser } from 'db/repository/user';
import { getBackdrop } from 'modules/backdrop';

function App() {
  const dispatch = useAppDispatch();
  const backdrop = useAppSelector(getBackdrop);
  const theme = createTheme({
    palette: {
      mode: 'light',
    },
    typography: {
      guideline: {
        color: 'gray',
        display: 'block',
      },
    },
  });

  const navigate = useNavigate();
  useEffect(() => {
    onAuthChange(async (user: any) => {
      if (user) {
        navigate('/dashboard');
        dispatch(setUser(await getLoggedInUser(user)));
      } else {
        navigate('/landing');
        dispatch(setUser(null));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path='/' element={<></>} />
        <Route path='/landing' element={<LandingPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/group/:id' element={<GroupPage />} />
      </Routes>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
        open={backdrop}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </ThemeProvider>
  );
}

export default App;

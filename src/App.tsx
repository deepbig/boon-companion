import React, { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthChange } from 'db/repository/auth';
import LandingPage from 'pages/LandingPage';
import DashboardPage from 'pages/DashboardPage';

function App() {
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
    onAuthChange((user: any) => {
      user ? navigate('/dashboard') : navigate('/landing');
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
      </Routes>
    </ThemeProvider>
  );
}

export default App;

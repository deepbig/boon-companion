import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Navigate, Routes, Route } from 'react-router-dom';
import LandingPage from 'pages/LandingPage';
import DashboardPage from 'pages/DashboardPage';

function App() {
  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path='/' element={<Navigate to='/landing' />} />
        <Route path='/landing' element={<LandingPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;

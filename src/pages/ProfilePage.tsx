import { Box, Toolbar } from '@mui/material'
import NavBar from 'components/navBar/NavBar'
import Profile from 'components/profile/Profile'
import React from 'react'
import { PageName } from 'types'

function ProfilePage() {
  return (
    <Box sx={{ display: 'flex' }}>
    <NavBar selectedName={PageName.PROFILE} />
    <Box
      component='main'
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <Toolbar />
      <Profile />
    </Box>
  </Box>
  )
}

export default ProfilePage
import { Box, Typography, Button } from '@suid/material';
import { useNavigate, useLocation } from '@solidjs/router';
import { Show } from 'solid-js';
import { userFromStore, updateUserFromStore } from '../../stores/user.store';

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const getUrlLastSegment = (url) => {
    const lastSlashIndex = url.lastIndexOf('/');
    const lastSegment = url.substring(lastSlashIndex + 1);
    return lastSegment;
  }
  
  const handleLogout = () => {
    updateUserFromStore({id: "", username: "", phone: "", email: "", role:""});
    localStorage.removeItem('user');
    navigate('/login');
  }
  
  return (
    <Box component="header" sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#003580',
      color: 'white',
      width: '100%',
      height: 64
    }}>
      <Typography variant="h6" sx={{
        fontSize: '1.25rem',
        fontWeight: 500,
        marginLeft: '35px'
      }}>
        Hilton
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginRight: '35px' }}>
        <Show when={userFromStore.role == "user" && getUrlLastSegment(location.pathname) !== 'login'}>
          <Button color="inherit" sx={{
            textTransform: 'none',
            minWidth: 'auto',
            padding: '6px 8px',
            fontSize: '0.875rem'
          }} onClick={() => navigate('/reservation')}>
            My Reservations
          </Button>
        </Show>

        <Button color="inherit" sx={{
          textTransform: 'none',
          minWidth: 'auto',
          padding: '6px 8px',
          fontSize: '0.875rem',
          marginLeft: '10px'
        }} onClick={handleLogout}>
          Log Out
        </Button>
      </Box>
      
    </Box>
  );
}
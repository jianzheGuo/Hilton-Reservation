import { Box, Typography, Button } from '@suid/material';

export default function AppHeader() {
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
        <Button color="inherit" sx={{ 
          textTransform: 'none',
          minWidth: 'auto',
          padding: '6px 8px',
          fontSize: '0.875rem'
        }}>
          Join
        </Button>
        <Box component="span" sx={{ opacity: 0.5 }}>|</Box>
        <Button color="inherit" sx={{
          textTransform: 'none',
          minWidth: 'auto',
          padding: '6px 8px',
          fontSize: '0.875rem'
        }}>
          Sign In
        </Button>
      </Box>
    </Box>
  );
}
import { Box, Typography } from '@suid/material';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box component="footer" sx={{
      textAlign: 'center',
      backgroundColor: '#f5f5f5',
      padding: '16px 0',
      width: '100%'
    }}>
      <Typography variant="body2">
        © {currentYear} Hilton
      </Typography>
    </Box>
  );
}
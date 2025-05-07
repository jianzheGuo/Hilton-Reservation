import { Box, TextField, Button, Typography, Dialog, DialogTitle, DialogContent } from '@suid/material';
import { createSignal } from 'solid-js';
import AppHeader from '../../components/Header/Header';
import AppFooter from '../../components/Footer/Footer';
import { useContext } from 'solid-js';
import {ApiContext} from '../../contexts/ApiContext';

export default function Login() {
  const {fetchPlus} = useContext(ApiContext);
  const [formData, setFormData] = createSignal({
    username: '',
    password: ''
  });
  const [joinDialogOpen, setJoinDialogOpen] = createSignal(false);
  const [registerData, setRegisterData] = createSignal({
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', formData());
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    // 验证密码是否匹配
    if (registerData().password !== registerData().confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetchPlus(
        '/users/createUser', 
        'POST', 
        {
          'Content-Type': 'application/json',
        },
        {
          username: registerData().username,
          password: registerData().password,
          phone: registerData().phone,
          email: registerData().email
        }
      );

      // const data = await response.json();
      
      // 存储用户信息到sessionStorage
      sessionStorage.setItem('user', JSON.stringify({
        username: registerData().username,
        phone: registerData().phone,
        email: registerData().email
      }));

      setJoinDialogOpen(false);
      alert('Registration successful!');
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <AppHeader />
      <Box component="main" sx={{
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '0 50px',
        backgroundImage: `url(${new URL('../../assets/hilton_hotel.jpg', import.meta.url).href})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <Box component="form" onSubmit={handleSubmit} sx={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '40px',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Welcome to Hilton
          </Typography>
          
          <TextField
            label="Username"
            value={formData().username}
            onChange={(e) => setFormData({...formData(), username: e.target.value})}
            required
            fullWidth
          />
          
          <TextField
            label="Password"
            type="password"
            value={formData().password}
            onChange={(e) => setFormData({...formData(), password: e.target.value})}
            required
            fullWidth
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            sx={{ 
              mt: 2,
              backgroundColor: '#003580',
              '&:hover': { backgroundColor: '#002a5e' }
            }}
          >
            Sign In
          </Button>
          
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Don't have an account? 
            <a href="#" onClick={(e) => { e.preventDefault(); setJoinDialogOpen(true); }} style={{ color: '#003580' }}>Join in from here!</a>
          </Typography>
        </Box>
      </Box>

      <Dialog 
        open={joinDialogOpen()} 
        onClose={() => setJoinDialogOpen(false)}
        PaperProps={{ sx: { minWidth: '40%' } }}
      >
        <DialogTitle>Create Your Hilton Account</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleRegisterSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Username"
              value={registerData().username}
              onChange={(e) => setRegisterData({...registerData(), username: e.target.value})}
              required
              fullWidth
            />
            
            <TextField
              label="Password"
              type="password"
              value={registerData().password}
              onChange={(e) => setRegisterData({...registerData(), password: e.target.value})}
              required
              fullWidth
            />
            
            <TextField
              label="Confirm Password"
              type="password"
              value={registerData().confirmPassword}
              onChange={(e) => setRegisterData({...registerData(), confirmPassword: e.target.value})}
              required
              fullWidth
            />
            
            <TextField
              label="Phone"
              type="tel"
              value={registerData().phone}
              onChange={(e) => setRegisterData({...registerData(), phone: e.target.value})}
              required
              fullWidth
            />
            
            <TextField
              label="Email"
              type="email"
              value={registerData().email}
              onChange={(e) => setRegisterData({...registerData(), email: e.target.value})}
              required
              fullWidth
            />
            
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              sx={{ 
                mt: 2,
                backgroundColor: '#003580',
                '&:hover': { backgroundColor: '#002a5e' }
              }}
            >
              Join Now
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <AppFooter />
    </Box>
  );
}
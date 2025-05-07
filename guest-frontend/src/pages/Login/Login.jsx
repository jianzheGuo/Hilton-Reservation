import { Box, TextField, Button, Typography, Dialog, DialogTitle, DialogContent } from '@suid/material';
import { createEffect, createSignal } from 'solid-js';
import AppHeader from '../../components/Header/Header';
import AppFooter from '../../components/Footer/Footer';
import { useContext } from 'solid-js';
import {ApiContext} from '../../contexts/ApiContext';
import { useAlert } from '../../components/Alert/Alert';
import { useNavigate } from '@solidjs/router';
import { updateUserFromStore } from '../../stores/user.store';

export default function Login() {
  const {fetchPlus} = useContext(ApiContext);
  const navigate = useNavigate();

  const [formData, setFormData] = createSignal({
    phone: '',
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
  const [isAllFieldsFilled, setIsAllFieldsFilled] = createSignal(false);
  const [errorMsg, setErrorMsg] = createSignal({});
  const { showAlert, AlertComponent } = useAlert();

  createEffect(() => {
    const allFieldsFilled = Object.values(registerData()).every(field => field.trim() !== '');
    setIsAllFieldsFilled(allFieldsFilled);
  })

  createEffect(() => {
    if(joinDialogOpen() == false) {
      setRegisterData({
        username: '',
        password: '',
        confirmPassword: '',
        phone: '',
        email: ''
      });
    }
  })

  const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
  }

  const comparePasswords = (password, confirmPassword) => {
    return password === confirmPassword;
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{11}$/;
    return re.test(phone);
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };



  const handleFieldChange = (field, value) => {
    let temp = {...errorMsg()}
    setRegisterData({...registerData(), [field]: value});
    switch(field) {
      case 'password':
        if(!validatePassword(value)) {
          temp['password'] = 'Password must contain at least 8 characters, including at least 1 uppercase letter, 1 lowercase letter and 1 number'
          setErrorMsg(temp);
        } else {
          temp['password'] = '';
          setErrorMsg(temp);
        }
        break;
      case 'confirmPassword':
        if(!comparePasswords(value, registerData().password)) {
          temp['confirmPassword'] = 'Passwords do not match'
          setErrorMsg(temp);
        } else {
          temp['confirmPassword'] = '';
          setErrorMsg(temp);
        }
        break;
      case 'phone':
        if(!validatePhone(value)) {
          temp['phone'] = 'Phone number must be 11 digits'
          setErrorMsg(temp);
        } else {
          temp['phone'] = '';
          setErrorMsg(temp);
        }
        break;
      case 'email':
        if(!validateEmail(value)) {
          temp['email'] = 'Invalid email address'
          setErrorMsg(temp);
        } else {
          temp['email'] = '';
          setErrorMsg(temp);
        }
        break;
      default:
        break;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchPlus(
        '/auth/login', 
        'POST', 
        {
          'Content-Type': 'application/json',
        },
        {
          password: formData().password,
          phone: formData().phone,
        }
      );
      if (response.access_token) {
        sessionStorage.setItem('jwt', response.access_token);
        updateUserFromStore(response);
        navigate('/home', { replace: true });
      } else {
        showAlert('error', 'Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('login error:', error);
      showAlert('error', 'Login failed. Please try again later. If this problem persists, please contact our support team.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

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

      setJoinDialogOpen(false);
      showAlert('success', 'Registration successful! You can now sign in.');
      
    } catch (error) {
      console.error('Registration error:', error);
      showAlert('error', 'Registration failed. Please try again.');
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
            label="Phone"
            value={formData().phone}
            onChange={(e) => setFormData({...formData(), phone: e.target.value})}
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
              onChange={(e) => handleFieldChange('password', e.target.value)}
              required
              fullWidth
              error={!!errorMsg().password}
              helperText={errorMsg().password}
            />
            
            <TextField
              label="Confirm Password"
              type="password"
              value={registerData().confirmPassword}
              onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
              required
              fullWidth
              error={!!errorMsg().confirmPassword}
              helperText={errorMsg().confirmPassword}
            />
            
            <TextField
              label="Phone"
              type="tel"
              value={registerData().phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              required
              fullWidth
              error={!!errorMsg().phone}
              helperText={errorMsg().phone}
            />
            
            <TextField
              label="Email"
              type="email"
              value={registerData().email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              required
              fullWidth
              error={!!errorMsg().email}
              helperText={errorMsg().email}
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
              disabled={!isAllFieldsFilled()}
            >
              Join Now
            </Button>
          </Box>
        </DialogContent>

      </Dialog>

      <AlertComponent />

      <AppFooter />
    </Box>
  );
}

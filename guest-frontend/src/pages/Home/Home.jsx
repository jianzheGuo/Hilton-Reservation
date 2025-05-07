import { Box, TextField, Select, MenuItem, Button } from '@suid/material';
import { createSignal } from 'solid-js';
import AppHeader from '../../components/Header/Header';
import AppFooter from '../../components/Footer/Footer';
import { userFromStore } from '../../stores/user.store';

export default function Home() {
  const [formData, setFormData] = createSignal({
    name: userFromStore.username,
    phone: userFromStore.phone,
    email: userFromStore.email,
    arrivalTime: '',
    tableSize: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData());
    // 这里可以添加表单提交逻辑
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
        padding: '50px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Box component="form" onSubmit={handleSubmit} sx={{
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <TextField
            label="Guest Name"
            value={formData().name}
            onChange={(e) => setFormData({...formData(), name: e.target.value})}
            required
          />
          
          <TextField
            label="Phone"
            type="tel"
            value={formData().phone}
            onChange={(e) => setFormData({...formData(), phone: e.target.value})}
            required
          />
          
          <TextField
            label="Email"
            type="email"
            value={formData().email}
            onChange={(e) => setFormData({...formData(), email: e.target.value})}
            required
          />
          
          <TextField
            label="Expected Arrival Time"
            type="datetime-local"
            value={formData().arrivalTime}
            onChange={(e) => setFormData({...formData(), arrivalTime: e.target.value})}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          
          <Select
            label="Table Size"
            value={formData().tableSize}
            onChange={(e) => setFormData({...formData(), tableSize: e.target.value})}
            required
          >
            {[1,2,3,4,5,6,7,8].map(size => (
              <MenuItem value={size}>{size} person</MenuItem>
            ))}
          </Select>
          
          <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor: '#003580' }}>
            Submit Reservation
          </Button>
        </Box>
      </Box>
      <AppFooter />
    </Box>
  );
}
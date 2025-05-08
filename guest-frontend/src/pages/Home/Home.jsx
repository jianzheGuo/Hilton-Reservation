import { Box, TextField, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText } from '@suid/material';
import { createSignal } from 'solid-js';
import AppHeader from '../../components/Header/Header';
import AppFooter from '../../components/Footer/Footer';
import { userFromStore } from '../../stores/user.store';
import { useAlert } from '../../components/Alert/Alert';
import { useNavigate } from '@solidjs/router';
import { client } from '../../utils/urql';

const CREATE_RESERVATION = `
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(createReservationInput: $input) {
      _id
      guest_name
      guest_phone
      table_size
      expected_arrive_time
      created_user
    }
  }
`;

export default function Home() {
  const [formData, setFormData] = createSignal({
    name: userFromStore.username,
    phone: userFromStore.phone,
    email: userFromStore.email,
    arrivalTime: '',
    tableSize: 1
  });
  const [successDialogOpen, setSuccessDialogOpen] = createSignal(false);
  const { showAlert, AlertComponent } = useAlert();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await client.mutation(CREATE_RESERVATION, { input: {...formData(), createdUser: userFromStore.id}, });
      console.log(result); 
      
      if (result.data?.createReservation) {
        setSuccessDialogOpen(true);
      } else {
        showAlert('error', 'Reservation failed. Please try again.');
      }
    } catch (error) {
      showAlert('error', 'Network error. Please check your connection.');
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
      
      <Dialog open={successDialogOpen()} onClose={() => setSuccessDialogOpen(false)}>
        <DialogTitle>Reservation Confirmed</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText primary="Guest Name" secondary={formData().name} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Phone" secondary={formData().phone} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Arrival Time" secondary={formData().arrivalTime} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Table Size" secondary={`${formData().tableSize} person`} />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogOpen(false)}>Close</Button>
          <Button 
            onClick={() => {
              setSuccessDialogOpen(false);
              navigate('/reservation')
            }}
            sx={{ color: '#003580' }}
          >
            My Reservations
          </Button>
        </DialogActions>
      </Dialog>

      <AlertComponent />
    </Box>
  );
}
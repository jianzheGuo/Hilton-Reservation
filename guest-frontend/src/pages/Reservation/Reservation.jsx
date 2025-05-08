import { createSignal, createResource } from 'solid-js';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Select, 
  MenuItem
} from '@suid/material';
import EditIcon from '@suid/icons-material/Edit';
import CancelIcon from '@suid/icons-material/Cancel';
import ArrowBackIcon from '@suid/icons-material/ArrowBack';
import AppHeader from '../../components/Header/Header';
import AppFooter from '../../components/Footer/Footer';
import { client } from '../../utils/urql';
import { useAlert } from '../../components/Alert/Alert';
import { userFromStore } from '../../stores/user.store';
import { useNavigate } from '@solidjs/router';

const GET_USER_RESERVATIONS = `
  query GetUserReservations($userId: String!) {
    getUserReservations(userId: $userId) {
      _id
      guest_name
      guest_phone
      guest_email
      table_size
      expected_arrive_time
      status
    }
  }
`;

const UPDATE_RESERVATION = `
  mutation UpdateReservation($id: String!, $input: UpdateReservationInput!) {
    updateReservation(id: $id, updateReservationInput: $input) {
      _id
      status
    }
  }
`;

const CANCEL_RESERVATION = `
  mutation CancelReservation($id: String!) {
    cancelReservation(id: $id) {
      _id
      status
    }
  }
`;

export default function Reservation() {
  const [editDialogOpen, setEditDialogOpen] = createSignal(false);
  const [cancelDialogOpen, setCancelDialogOpen] = createSignal(false);
  const [currentReservation, setCurrentReservation] = createSignal(null);
  const [editFormData, setEditFormData] = createSignal({
    name: '',
    phone: '',
    email: '',
    tableSize: 1,
    arrivalTime: ''
  });
  
  const [order, setOrder] = createSignal('desc');
  const [orderBy, setOrderBy] = createSignal('expected_arrive_time');
  
  const { showAlert, AlertComponent } = useAlert();
  const navigate = useNavigate();
  
  const fetchReservations = async () => {
    try {
      const result = await client.query(GET_USER_RESERVATIONS, { userId: userFromStore.id });
      if (result.data?.getUserReservations) {
        return result.data.getUserReservations;
      }
      return [];
    } catch (error) {
      showAlert('error', 'Failed to fetch reservations');
      return [];
    }
  };
  
  const [reservations, { mutate, refetch }] = createResource(fetchReservations);
  
  const handleEditClick = (reservation) => {
    setCurrentReservation(reservation);
    setEditFormData({
      name: reservation.guest_name,
      phone: reservation.guest_phone,
      email: reservation.guest_email,
      tableSize: reservation.table_size,
      arrivalTime: new Date(reservation.expected_arrive_time).toISOString().slice(0, 16)
    });
    setEditDialogOpen(true);
  };
  
  const handleCancelClick = (reservation) => {
    setCurrentReservation(reservation);
    setCancelDialogOpen(true);
  };
  
  const handleEditSubmit = async () => {
    try {
      const result = await client.mutation(UPDATE_RESERVATION, {
        id: currentReservation()._id.toString(),
        input: {
          name: editFormData().name,
          phone: editFormData().phone,
          email: editFormData().email,
          tableSize: editFormData().tableSize,
          arrivalTime: editFormData().arrivalTime
        }
      });
      
      if (result.data?.updateReservation) {
        showAlert('success', 'Reservation updated successfully');
        setEditDialogOpen(false);
        refetch();
      } else {
        showAlert('error', 'Reservation update failed');
      }
    } catch (error) {
      showAlert('error', error.message | 'Server error');
    }
  };
  
  const handleCancelConfirm = async () => {
    try {
      const result = await client.mutation(CANCEL_RESERVATION, {
        id: currentReservation()._id
      });
      
      if (result.data?.cancelReservation) {
        showAlert('success', 'Reservation cancelled successfully');
        setCancelDialogOpen(false);
        refetch();
      } else {
        showAlert('error', 'Reservation cancellation failed');
      }
    } catch (error) {
      showAlert('error', error.message | 'Server error');
    }
  };
  
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toUTCString()
    // .toLocaleString();
  };
  
  const handleRequestSort = (property) => {
    const isAsc = orderBy() === property && order() === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const descendingComparator = (a, b, orderBy) => {
    if (orderBy === 'expected_arrive_time') {
      return new Date(b[orderBy]) - new Date(a[orderBy]);
    }
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };
  
  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };
  
  const sortedReservations = (reservations) => {
    if (!reservations || !Array.isArray(reservations)) return [];
    return [...reservations].sort(getComparator(order(), orderBy()));
  };
  
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <AppHeader />
      <Box component="main" sx={{ flex: 1, padding: '20px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => navigate('/home')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <h2>My Reservations</h2>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                
                <TableCell 
                  onClick={() => handleRequestSort('expected_arrive_time')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Arrival Time {orderBy() === 'expected_arrive_time' ? (order() === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
                <TableCell
                  onClick={() => handleRequestSort('table_size')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >Table Size {orderBy() === 'table_size' ? (order() === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
                <TableCell
                  onClick={() => handleRequestSort('status')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Status {orderBy() === 'status' ? (order() === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">Loading...</TableCell>
                </TableRow>
              ) : reservations()?.length > 0 ? (
                sortedReservations(reservations()).map((reservation) => (
                  <TableRow key={reservation._id}>
                    <TableCell>{formatDateTime(reservation.expected_arrive_time)}</TableCell>
                    <TableCell>{reservation.table_size} Person</TableCell>
                    <TableCell>{reservation.status}</TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => handleEditClick(reservation)}
                        disabled={reservation.status === 'Cancelled'}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleCancelClick(reservation)}
                        disabled={reservation.status === 'Cancelled'}
                        sx={{ color: '#d32f2f' }}
                      >
                        <CancelIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">No Reservation Records</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <AppFooter />
      
      <Dialog open={editDialogOpen()} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Reservation Name"
              value={editFormData().name}
              onChange={(e) => setEditFormData({...editFormData(), name: e.target.value})}
              fullWidth
              required
            />
            
            <TextField
              label="Phone"
              value={editFormData().phone}
              onChange={(e) => setEditFormData({...editFormData(), phone: e.target.value})}
              fullWidth
              required
            />
            
            <TextField
              label="Email"
              value={editFormData().email}
              onChange={(e) => setEditFormData({...editFormData(), email: e.target.value})}
              fullWidth
              required
            />
            
            <TextField
              label="Arrive Time"
              type="datetime-local"
              value={editFormData().arrivalTime}
              onChange={(e) => setEditFormData({...editFormData(), arrivalTime: e.target.value})}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            
            <Select
              label="Table Size"
              value={editFormData().tableSize}
              onChange={(e) => setEditFormData({...editFormData(), tableSize: e.target.value})}
              fullWidth
              required
            >
              {[1,2,3,4,5,6,7,8].map(size => (
                <MenuItem value={size}>{size} 人</MenuItem>
              ))}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" sx={{ backgroundColor: '#003580' }}>Save</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={cancelDialogOpen()} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Reservation</DialogTitle>
        <DialogContent>
          Do you want to cancel this reservation?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>No</Button>
          <Button onClick={handleCancelConfirm} sx={{ color: '#d32f2f' }}>Yes</Button>
        </DialogActions>
      </Dialog>
      
      <AlertComponent />
    </Box>
  );
}
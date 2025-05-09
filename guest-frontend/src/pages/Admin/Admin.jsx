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
  MenuItem,
  FormControl,
  InputLabel
} from '@suid/material';
import EditIcon from '@suid/icons-material/Edit';
import AppHeader from '../../components/Header/Header';
import AppFooter from '../../components/Footer/Footer';
import { client } from '../../utils/urql';
import { useAlert } from '../../components/Alert/Alert';
import { formateDateForCalendar } from '../../utils/dateUtil';

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

const GET_ADMIN_RESERVATIONS_BY_FILTER = `
  query GetAdminReservationsByFilter($startDate: String, $endDate: String, $status: [String!]) {
    getAdminReservationsByFilter(startDate: $startDate, endDate: $endDate, status: $status) {
      _id
      guest_name
      guest_phone
      guest_email
      table_size
      expected_arrive_time
      status
      created_user_name
      created_user
      created_date
      updated_date
      updated_user
    }
  }
`;

export default function Admin() {
  const [editDialogOpen, setEditDialogOpen] = createSignal(false);
  const [currentReservation, setCurrentReservation] = createSignal(null);
  const [editFormData, setEditFormData] = createSignal({
    name: '',
    phone: '',
    email: '',
    tableSize: 1,
    arrivalTime: '',
    status: 'Approved'
  });
  const [order, setOrder] = createSignal('desc');
  const [orderBy, setOrderBy] = createSignal('expected_arrive_time');
  const [filterStartDate, setFilterStartDate] = createSignal('');
  const [filterEndDate, setFilterEndDate] = createSignal('');
  const [filterStatus, setFilterStatus] = createSignal('');
  
  const { showAlert, AlertComponent } = useAlert();


  const fetchReservationsByFilter = async () => {
    let statusList = []
    if(filterEndDate() != '' && filterStartDate() != '' && new Date(filterEndDate) < new Date(filterStartDate())){
      showAlert('error', 'End date cannot be earlier than start date');
      return;
    }
    if(filterStatus() === 'Select_All'){
      statusList = ['Approved', 'Cancelled', 'Completed', 'Requested']
    }else if (filterStatus() === ''){
      statusList = []
    } else {
      statusList = [filterStatus()]
    }

    try {
      const res = await client.query(GET_ADMIN_RESERVATIONS_BY_FILTER, {
        startDate: filterStartDate(),
        endDate: filterEndDate(),
        status: statusList
      }, {requestPolicy: 'network-only'});
      if (res.data?.getAdminReservationsByFilter) {
        mutate(res.data.getAdminReservationsByFilter);
        return res.data.getAdminReservationsByFilter;
      }
      return [];
    } catch (error) {
      showAlert('error', 'Failed to fetcha reservations for admin by filter');
      return [];
    }
  }
  const [reservations, { mutate, refetch }] = createResource(fetchReservationsByFilter);
  
  const handleEditClick = (reservation) => {
    setCurrentReservation(reservation);
    setEditFormData({
      name: reservation.guest_name,
      phone: reservation.guest_phone,
      email: reservation.guest_email,
      tableSize: reservation.table_size,
      arrivalTime: new Date(reservation.expected_arrive_time).toISOString().slice(0, 16),
      status: reservation.status || 'Approved' // 设置当前状态
    });
    setEditDialogOpen(true);
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
          arrivalTime: editFormData().arrivalTime,
          status: editFormData().status
        }
      });
      
      if (result.data?.updateReservation) {
        showAlert('success', 'Reservation updated successfully');
        setEditDialogOpen(false);
        const newData = await fetchReservationsByFilter();
        mutate(newData);
      } else {
        showAlert('error', 'Reservation update failed');
      }
    } catch (error) {
      showAlert('error', error.message | 'Server error');
    }
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
          <h2>Admin Panel</h2>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'row', 
          gap: 2, 
          mb: 3,
          p: 2,
          borderRadius: '4px'
        }}>
          <TextField
            label="Start Date"
            type="date"
            value={filterStartDate()}
            onChange={(e) => setFilterStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: '200px' }}
          />
          
          <TextField
            label="End Date"
            type="date"
            value={filterEndDate()}
            onChange={(e) => setFilterEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: '200px' }}
          />
          
          <FormControl sx={{ width: '200px' }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={filterStatus()}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="Select_All">Select All</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Requested">Requested</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant="contained" 
            onClick={fetchReservationsByFilter}
            sx={{ minWidth: '100px' }}
          >
            Search
          </Button>
        </Box>
        
        <TableContainer component={Paper} sx={{ 
          maxHeight: '60vh',
          overflow: 'auto'
        }}>
          <Table stickyHeader>
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
                  onClick={() => handleRequestSort('created_user_name')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Created User {orderBy() === 'created_user_name' ? (order() === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
                <TableCell
                  onClick={() => handleRequestSort('created_date')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Created Date {orderBy() === 'created_date' ? (order() === 'asc' ? '↑' : '↓') : ''}
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
                    <TableCell>{formateDateForCalendar(reservation.expected_arrive_time, false)}</TableCell>
                    <TableCell>{reservation.table_size} Person</TableCell>
                    <TableCell>{reservation.created_user_name}</TableCell>
                    <TableCell>{formateDateForCalendar(reservation.created_date, false)}</TableCell>
                    <TableCell>{reservation.status}</TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => handleEditClick(reservation)}
                        disabled={reservation.status === 'Cancelled' || reservation.status === 'Completed'}
                      >
                        <EditIcon />
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
        <DialogTitle>Edit Reservation Info</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Box sx={{ fontWeight: 'bold', width: '120px' }}>Guest Name</Box>
              <Box>{editFormData().name}</Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Box sx={{ fontWeight: 'bold', width: '120px' }}>Phone</Box>
              <Box>{editFormData().phone}</Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Box sx={{ fontWeight: 'bold', width: '120px' }}>Email</Box>
              <Box>{editFormData().email}</Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Box sx={{ fontWeight: 'bold', width: '120px' }}>Table Size</Box>
              <Box>{editFormData().tableSize} Person</Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Box sx={{ fontWeight: 'bold', width: '120px' }}>Expected Arrive Time</Box>
              <Box>{formateDateForCalendar(editFormData().arrivalTime, false)}</Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
              <Box sx={{ fontWeight: 'bold', width: '120px' }}>Status</Box>
              <Select                
                value={editFormData().status}
                onChange={(e) => setEditFormData({...editFormData(), status: e.target.value})}
                fullWidth
              >
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                {/* <MenuItem value="Completed">Requested</MenuItem> */}
              </Select>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      

      
      <AlertComponent />
    </Box>
  );
}
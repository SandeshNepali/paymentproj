import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Box,
  Container,
  CardMedia,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { config } from '../../utils/config';
import double from "../images/double.webp";
import standard from "../images/standard.webp";

const User = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [city, setCity] = useState('');
  const [cityLoading, setCityLoading] = useState(false);
  const [noHotelsFound, setNoHotelsFound] = useState(false);
  const [stayingDate, setStayingDate] = useState('');

  const fetchHotelsByCity = () => {
    if (!city.trim()) return;
    setCityLoading(true);
    setNoHotelsFound(false);

    axios
      .get(`${config.hotels}/search?city=${city}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        if (response.data.length === 0) {
          setNoHotelsFound(true);
          setHotels([]);
          setSelectedHotel('');
        } else {
          setHotels(response.data);
        }
        setCityLoading(false);
      })
      .catch(() => {
        setMessage('Failed to fetch hotels. Please try again.');
        setOpenSnackbar(true);
        setCityLoading(false);
        setSelectedHotel('');
        setHotels([]);
      });
  };

  useEffect(() => {
    if (city) fetchHotelsByCity();
  }, [city]);

  const fetchRoomsForHotel = (hotelId) => {
    setLoading(true);
    axios
      .get(`${config.rooms}?hotel_id=${hotelId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        setRooms(response.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage('Failed to fetch rooms. Please try again.');
        setOpenSnackbar(true);
        setLoading(false);
      });
  };

  const handleHotelChange = (event) => {
    const hotelId = event.target.value;
    setSelectedHotel(hotelId);
    fetchRoomsForHotel(hotelId);
  };

  const handleBooking = (roomId) => {
    if (!stayingDate) {
      setMessage('Please select a staying date.');
      setOpenSnackbar(true);
      return;
    }

    axios
      .post(
        config.bookings,
        { room_id: roomId, stay_date: stayingDate },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      )
      .then(() => {
        setMessage('Room booked successfully!');
        setOpenSnackbar(true);
      })
      .catch(() => {
        setMessage('Failed to book room. Please try again.');
        setOpenSnackbar(true);
      });
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        align="center"
        color="white"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#ffffff' }}
      >
        Find Your Perfect Stay
      </Typography>

      <Paper
        elevation={4}
        sx={{
          p: 4,
          backgroundColor: '#2f3b45',
          borderRadius: 1,
        }}
      >
        <TextField
          label="Search City"
          variant="outlined"
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          sx={{
            mb: 3,
            '& .MuiInputBase-input': { color: 'white' },
            '& .MuiInputLabel-root': { color: 'gray' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#566475' },
              '&:hover fieldset': { borderColor: '#1e88e5' },
              '&.Mui-focused fieldset': { borderColor: '#1e88e5' },
            },
          }}
        />

        {cityLoading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : noHotelsFound ? (
          <Typography
            variant="h6"
            align="center"
            color="error"
            sx={{ mt: 4 }}
          >
            No hotels found for "{city}". Please try another city.
          </Typography>
        ) : (
          hotels.length > 0 && (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="hotel-select-label" sx={{ color: 'white' }}>
                Select Hotel
              </InputLabel>
              <Select
                labelId="hotel-select-label"
                value={selectedHotel}
                onChange={handleHotelChange}
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#566475' },
                    '&:hover fieldset': { borderColor: '#1e88e5' },
                    '&.Mui-focused fieldset': { borderColor: '#1e88e5' },
                  },
                }}
              >
                {hotels.map((hotel) => (
                  <MenuItem key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )
        )}

        {selectedHotel && (
          <>
            <TextField
              label="Select Staying Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true, sx: { color: 'gray' } }}
              value={stayingDate}
              onChange={(e) => setStayingDate(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#566475' },
                  '&:hover fieldset': { borderColor: '#1e88e5' },
                  '&.Mui-focused fieldset': { borderColor: '#1e88e5' },
                },
              }}
            />

            {loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {rooms.map((room) => (
                  <Grid item xs={12} sm={6} md={4} key={room.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#3c4a56',
                        color: 'white',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={room.room_type === 'Standard' ? standard : double}
                        alt={`${room.room_type} room`}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {room.room_type}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#b0bec5' }}>
                          Price: ${room.price}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: room.is_available ? '#8bc34a' : '#e57373',
                          }}
                        >
                          {room.is_available ? 'Available' : 'Not Available'}
                        </Typography>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleBooking(room.id)}
                          disabled={!room.is_available}
                          sx={{
                            mt: 2,
                            backgroundColor: room.is_available
                              ? '#1e88e5'
                              : 'gray',
                            '&:hover': {
                              backgroundColor: room.is_available
                                ? '#1565c0'
                                : 'gray',
                            },
                          }}
                        >
                          {room.is_available ? 'Book Now' : 'Unavailable'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={message}
      />
    </Container>
  );
};

export default User;

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
  Paper,
  CardMedia,
} from '@mui/material';
import axios from 'axios';
import { config } from '../../utils/config';
import double from "../images/double.webp"; // Make sure the image is in the right folder
import standard from "../images/standard.webp"; // Make sure the image is in the right folder


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
    if (!city) return;
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
          setSelectedHotel('')
        } else {
          setHotels(response.data);
        }
        setCityLoading(false);
      })
      .catch(() => {
        setMessage('Failed to fetch hotels');
        setOpenSnackbar(true);
        setCityLoading(false);
        setSelectedHotel('')
        setHotels([]);
      });
  };

  useEffect(() => {
    fetchHotelsByCity()

  }, [city])


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
        setMessage('Failed to fetch rooms');
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
      setMessage('Please select a staying date');
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

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" color='white' gutterBottom>
          Find Your Perfect Stay
        </Typography>
        <TextField
          label="Enter City"
          variant="outlined"
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
          sx={{
            marginBottom: 3,
            "& .MuiInputBase-input": { color: "white" }, // Input text color
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" }, // Border color
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" }, // Hover border color
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "white", // Focused border color
            },
          }}
        />

        {noHotelsFound && (
          <Typography
            variant="h6"
            color="error"
            align="center"
            sx={{ marginTop: 4 }}
          >
            No hotels found for the city "{city}". Please try another city.
          </Typography>
        )}

        {city && !cityLoading && hotels.length > 0 && (
          <Box my={4}>
            <Typography variant="h5" gutterBottom sx={{ color: "white" }}>
              Available Hotels
            </Typography>
            <FormControl fullWidth sx={{ marginBottom: 3 }}>
              <InputLabel id="hotel-select-label" sx={{ color: "white" }}>
                Select Hotel
              </InputLabel>
              <Select
                labelId="hotel-select-label"
                value={selectedHotel}
                onChange={handleHotelChange}
                label="Hotel"
                sx={{
                  color: "white", // Text color for selected value
                  ".MuiOutlinedInput-notchedOutline": { borderColor: "white" }, // Border color
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" }, // Hover border color
                  ".MuiSvgIcon-root": { color: "white" }, // Dropdown arrow color
                }}
              >
                {hotels.map((hotel) => (
                  <MenuItem
                    key={hotel.id}
                    value={hotel.id}
                    sx={{
                      color: "white", // Text color in dropdown
                      backgroundColor: "#586d7a", // Background color for dropdown
                      "&:hover": { backgroundColor: "#455a64" }, // Hover effect for dropdown items
                    }}
                  >
                    {hotel.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

        )}

        {selectedHotel && (
          <Box my={4}>
            <Typography variant="h5" gutterBottom color='white'>
              Stay Date
            </Typography>
            <TextField
              label="Select Staying Date"
              type="date"
              InputLabelProps={{
                shrink: true,
                sx: { color: "white" }, // Label color
              }}
              fullWidth
              value={stayingDate}
              onChange={(e) => setStayingDate(e.target.value)}
              sx={{
                marginBottom: 3,
                "& .MuiInputBase-input": { color: "white" }, // Input text color
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" }, // Border color
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" }, // Hover border color
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", // Focused border color
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
                    <Card elevation={4} sx={{ height: '100%', backgroundColor: "#586d7a" }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={
                          room.room_type === "Standard"
                            ? standard
                            : double
                        }
                        alt={`${room.room_type} room image`}
                      />
                      <CardContent>
                        <Typography variant="h6" color="white">
                          {room.room_type}
                        </Typography>
                        <Typography variant="body2" color="white">
                          Price: ${room.price}
                        </Typography>
                        <Typography variant="body2" color="white">
                          {room.is_available ? "Available" : "Not Available"}
                        </Typography>
                        <Button
                          variant="contained"
                          color="white"
                          fullWidth
                          onClick={() => handleBooking(room.id)}
                          disabled={!room.is_available}
                          sx={{ marginTop: 2 }}
                        >
                          {room.is_available ? "Book Now" : "Unavailable"}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={message}
      />
    </Container >
  );
};

export default User;

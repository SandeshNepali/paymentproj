import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid, CircularProgress, Snackbar } from '@mui/material';
import axios from 'axios';
import { config } from '../../utils/config';

const BookedList = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        // Fetch the list of hotels when the component mounts
        axios
            .get(config.hotels, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then((response) => {
                setHotels(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setMessage('Failed to fetch hotels');
                setOpenSnackbar(true);
                setLoading(false);
            });
    }, []);

    // Handle hotel click to view bookings
    const handleHotelClick = (hotelId) => {
        setSelectedHotel(hotelId);
    };

    // Close the Snackbar
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom color='white'>
                Hotels List
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={3}>
                    {hotels.map((hotel) => (
                        <Grid item xs={12} sm={6} md={4} key={hotel.id}>
                            <Card sx={{ backgroundColor: "#566c79" }}>
                                <CardContent>
                                    <Typography variant="h6" color='white'>{hotel.name}</Typography>
                                    <Typography variant="body2" color="white">
                                        Location: {hotel.city}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleHotelClick(hotel.id)}
                                        style={{ marginTop: '10px' }}
                                    >
                                        View Bookings
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Snackbar for success/error messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message={message}
            />

            {/* Render Bookings when a hotel is selected */}
            {selectedHotel && <Helper hotelId={selectedHotel} />}
        </div>
    );
};

const Helper = ({ hotelId }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        // Fetch bookings for the selected hotel
        axios
            .get(`${config.hotels}/${hotelId}/bookings`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then((response) => {
                setBookings(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setMessage('Failed to fetch bookings');
                setOpenSnackbar(true);
                setLoading(false);
            });
    }, [hotelId]);

    // Close the Snackbar
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom color='white'>
                Bookings for Hotel ID: {hotelId}
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : bookings.length === 0 ? (
                <Typography variant="body1" color="white">
                    No bookings available for this hotel.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {bookings.map((booking) => (
                        <Grid item xs={12} sm={6} md={4} key={booking.id}>
                            <Card sx={{ backgroundColor: "#566c79" }}>
                                <CardContent>
                                    <Typography variant="h6" color='white'>Booking ID: {booking.id}</Typography>
                                    <Typography variant="body2" color="white">
                                        Room Type: {booking.room_type}
                                    </Typography>
                                    <Typography variant="body2" color="white">
                                        Username: {booking.username}
                                    </Typography>
                                    <Typography variant="body2" color="white">
                                        Status: {booking.status}
                                    </Typography>
                                    <Typography variant="body2" color="white">
                                        Booking Date: {new Date(booking.booking_date).toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Snackbar for success/error messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message={message}
            />
        </div>
    );
};

export default BookedList;

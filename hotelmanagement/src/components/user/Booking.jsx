import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    CircularProgress,
    Snackbar,
    IconButton,
    Container,
    Box,
    Paper,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { config } from '../../utils/config';

const Booking = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        axios
            .get(config.bookings, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then((response) => {
                const activeBookings = response.data.bookings.filter((booking) => booking.status === 'booked');
                setBookings(activeBookings);
                setLoading(false);
            })
            .catch(() => {
                setMessage('Failed to fetch bookings');
                setOpenSnackbar(true);
                setLoading(false);
            });
    }, []);

    const handleCancel = (bookingId) => {
        axios
            .delete(`${config.bookings}/${bookingId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then(() => {
                setMessage('Booking cancelled successfully');
                setOpenSnackbar(true);
                setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));
            })
            .catch(() => {
                setMessage('Failed to cancel booking. Please try again.');
                setOpenSnackbar(true);
            });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" align="center" gutterBottom>
                    My Bookings
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress />
                    </Box>
                ) : bookings.length === 0 ? (
                    <Typography variant="body1" color="textSecondary" align="center">
                        No bookings found.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {bookings.map((booking) => (
                            <Grid item xs={12} sm={6} md={4} key={booking.id}>
                                <Card sx={{backgroundColor:"#586d7a"}}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                            <Typography variant="h6">Booking ID: {booking.id}</Typography>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleCancel(booking.id)}
                                                title="Cancel Booking"
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                        </Box>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Hotel:</strong> {booking.hotel_name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Room ID:</strong> {booking.room_id}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Booking Date:</strong> {new Date(booking.booking_date).toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Staying Date:</strong> {new Date(booking.staying_date).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Status:</strong> {booking.status}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Price:</strong> ${booking.room_price}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Discount:</strong> ${booking.discount}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Final Price:</strong> ${booking.final_price}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    message={message}
                />
            </Box>
        </Container>
    );
};

export default Booking;

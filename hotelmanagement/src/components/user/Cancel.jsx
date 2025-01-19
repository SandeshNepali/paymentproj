import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    CircularProgress,
    Snackbar,
    Container,
    Box,
    Paper,
} from '@mui/material';
import axios from 'axios';
import { config } from '../../utils/config';

const Cancel = () => {
    const [cancelledBookings, setCancelledBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Fetch canceled bookings when the component mounts
    useEffect(() => {
        axios
            .get(config.bookings, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then((response) => {
                const cancelled = response.data.bookings.filter((booking) => booking.status === 'canceled');
                setCancelledBookings(cancelled);
                setLoading(false);
            })
            .catch(() => {
                setMessage('Failed to fetch cancelled bookings');
                setOpenSnackbar(true);
                setLoading(false);
            });
    }, []);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" align="center" gutterBottom>
                    Cancelled Rides
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress />
                    </Box>
                ) : cancelledBookings.length === 0 ? (
                    <Typography variant="body1" color="textSecondary" align="center">
                        No cancelled rides found.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {cancelledBookings.map((booking) => (
                            <Grid item xs={12} sm={6} md={4} key={booking.id}>
                                <Card elevation={3} sx={{backgroundColor:"#586d7a"}}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Booking ID: {booking.id}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Hotel:</strong> {booking.hotel_name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Room ID:</strong> {booking.room_id}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Booking Date:</strong>{' '}
                                            {new Date(booking.booking_date).toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Status:</strong> {booking.status}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Price:</strong> ${booking.room_price}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Snackbar for messages */}
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

export default Cancel;

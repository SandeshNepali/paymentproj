import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../../utils/config';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Paper,
} from '@mui/material';
import { toast } from 'react-toastify';

const Room = () => {
    const [rooms, setRooms] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [formData, setFormData] = useState({
        hotel_id: '',
        room_type: '',
        price: '',
        is_available: true,
    });
    const [selectedHotelId, setSelectedHotelId] = useState(null);

    // Fetch hotels
    useEffect(() => {
        axios
            .get(config.hotels, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                setHotels(response.data);
            })
            .catch((error) => {
                console.error('Error fetching hotels:', error);
            });
    }, []);

    // Fetch rooms for the selected hotel
    const fetchRoomsForHotel = (hotelId) => {
        axios
            .get(`${config.rooms}?hotel_id=${hotelId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                setRooms(response.data);
            })
            .catch((error) => {
                console.error('Error fetching rooms:', error);
            });
    };

    // Handle hotel selection
    const handleHotelSelect = (event) => {
        const hotelId = event.target.value;
        setSelectedHotelId(hotelId);
        fetchRoomsForHotel(hotelId);
    };

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'is_available' ? e.target.checked : value,
        });
    };

    // Handle room addition
    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post(config.rooms, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                toast.success("Room added successfully!", {
                    position: "top-center",  // Position the toast at the top-center
                    autoClose: 3000,  // Auto close the toast after 3 seconds
                    hideProgressBar: true,  // Hide progress bar
                });
                setRooms([...rooms, response.data]);
                setFormData({
                    hotel_id: '',
                    room_type: '',
                    price: '',
                    is_available: true,
                });
            })
            .catch((error) => {
                console.error('Error adding room:', error);
                alert('Failed to add room. Please check your input.');
            });
    };

    return (
        <Box p={4} sx={{ backgroundColor: "#394851", color: "white" }}>
            <Typography variant="h4" gutterBottom>
                Manage Rooms
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Add a Room
                </Typography>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Hotel</InputLabel>
                    <Select
                        name="hotel_id"
                        value={formData.hotel_id}
                        onChange={handleChange}
                        required
                        sx={{
                            backgroundColor: "#566c79",
                            color: "white",
                            '& .MuiInputLabel-root': {
                                color: "#B0BEC5"
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: "#B0BEC5"
                                },
                                '&:hover fieldset': {
                                    borderColor: "#90A4AE"
                                }
                            }
                        }}
                    >
                        <MenuItem value="">Select a hotel</MenuItem>
                        {hotels.map((hotel) => (
                            <MenuItem key={hotel.id} value={hotel.id}>
                                {hotel.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Room Type</InputLabel>
                    <Select
                        name="room_type"
                        value={formData.room_type}
                        onChange={handleChange}
                        required
                        sx={{
                            backgroundColor: "#566c79",
                            color: "white",
                            '& .MuiInputLabel-root': {
                                color: "#B0BEC5"
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: "#B0BEC5"
                                },
                                '&:hover fieldset': {
                                    borderColor: "#90A4AE"
                                }
                            }
                        }}
                    >
                        <MenuItem value="">Select a room type</MenuItem>
                        <MenuItem value="Standard">Standard</MenuItem>
                        <MenuItem value="Double">Double</MenuItem>
                        <MenuItem value="Family">Family</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    margin="normal"
                    label="Price"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    sx={{
                        backgroundColor: "#566c79",
                        color: "white",
                        '& .MuiInputLabel-root': {
                            color: "#B0BEC5"
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: "#B0BEC5"
                            },
                            '&:hover fieldset': {
                                borderColor: "#90A4AE"
                            }
                        }
                    }}
                />

                <Box display="flex" alignItems="center" mt={2}>
                    <Checkbox
                        name="is_available"
                        checked={formData.is_available}
                        onChange={handleChange}
                    />
                    <Typography>Available</Typography>
                </Box>

                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Add Room
                </Button>
            </Box>

            <Typography variant="h5" gutterBottom>
                Hotels
            </Typography>
            <Box>
                {hotels.map((hotel) => (
                    <Button
                        key={hotel.id}
                        variant="outlined"
                        onClick={() => handleHotelSelect({ target: { value: hotel.id } })}
                        sx={{ mr: 2, mb: 2, color: "#90A4AE", borderColor: "#90A4AE" }}
                    >
                        {hotel.name}
                    </Button>
                ))}
            </Box>

            {selectedHotelId && (
                <Box>
                    <Typography variant="h6" mt={4} gutterBottom>
                        Rooms for Hotel: {hotels.find((hotel) => hotel.id === selectedHotelId)?.name}
                    </Typography>
                    <TableContainer component={Paper} sx={{ backgroundColor: "#566c79" }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: "#B0BEC5" }}>Room Type</TableCell>
                                    <TableCell sx={{ color: "#B0BEC5" }}>Price</TableCell>
                                    <TableCell sx={{ color: "#B0BEC5" }}>Available</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rooms.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3}>No rooms available.</TableCell>
                                    </TableRow>
                                ) : (
                                    rooms.map((room) => (
                                        <TableRow key={room.id}>
                                            <TableCell sx={{ color: "#90A4AE" }}>{room.room_type}</TableCell>
                                            <TableCell sx={{ color: "#90A4AE" }}>${room.price}</TableCell>
                                            <TableCell sx={{ color: "#90A4AE" }}>
                                                {room.is_available ? 'Yes' : 'No'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </Box>
    );
};

export default Room;

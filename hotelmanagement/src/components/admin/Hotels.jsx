import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Alert, TextField, Button } from "@mui/material";
import { config } from "../../utils/config";

const Hotels = () => {
    const [newHotel, setNewHotel] = useState({
        name: "",
        city: "",
        capacity: "",
        peak_season_rate: "",
        off_peak_rate: "",
    });
    const [message, setMessage] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewHotel({
            ...newHotel,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input fields
        if (
            !newHotel.name ||
            !newHotel.city ||
            !newHotel.capacity ||
            !newHotel.peak_season_rate ||
            !newHotel.off_peak_rate
        ) {
            setMessage({ type: "error", text: "Please fill in all fields" });
            return;
        }

        try {
            await axios.post(config.addhotel, newHotel, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setMessage({ type: "success", text: "Hotel added successfully!" });
            setNewHotel({
                name: "",
                city: "",
                capacity: "",
                peak_season_rate: "",
                off_peak_rate: "",
            });
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response
                    ? error.response.data.message
                    : "An error occurred while adding the hotel",
            });
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" mb={2} color="white">
                Hotels List
            </Typography>

            {message && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" mb={2} color="white">
                    Add New Hotel
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Hotel Name"
                        name="name"
                        value={newHotel.name}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2, }}
                        required
                        InputProps={{
                            style: { color: 'white' }, // Input text color
                        }}
                        InputLabelProps={{
                            style: { color: 'white' },
                        }}
                    />
                    <TextField
                        label="City"
                        name="city"
                        value={newHotel.city}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2, }}
                        required
                        InputProps={{
                            style: { color: 'white' }, // Input text color
                        }}
                        InputLabelProps={{
                            style: { color: 'white' },
                        }}
                    />
                    <TextField
                        label="Capacity"
                        name="capacity"
                        type="number"
                        value={newHotel.capacity}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2, }}
                        required
                        InputProps={{
                            style: { color: 'white' }, // Input text color
                        }}
                        InputLabelProps={{
                            style: { color: 'white' },
                        }}
                    />
                    <TextField
                        label="Peak Season Rate"
                        name="peak_season_rate"
                        type="number"
                        value={newHotel.peak_season_rate}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2, }}
                        required
                        InputProps={{
                            style: { color: 'white' }, // Input text color
                        }}
                        InputLabelProps={{
                            style: { color: 'white' },
                        }}
                    />
                    <TextField
                        label="Off Peak Rate"
                        name="off_peak_rate"
                        type="number"
                        value={newHotel.off_peak_rate}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2, }}
                        required
                        InputProps={{
                            style: { color: 'white' }, // Input text color
                        }}
                        InputLabelProps={{
                            style: { color: 'white' },
                        }}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Add Hotel
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default Hotels;

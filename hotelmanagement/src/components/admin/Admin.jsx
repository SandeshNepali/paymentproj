import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    Grid,
    Alert,
    Divider,
    Button,
    Modal,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { config } from "../../utils/config";

const Admin = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [deleteHotelId, setDeleteHotelId] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        axios
            .get(config.hotels, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                setHotels(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch hotel data.");
                setLoading(false);
            });
    }, []);

    const handleUpdateClick = (hotel) => {
        setSelectedHotel(hotel);
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setSelectedHotel((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateSubmit = () => {
        setUpdateLoading(true);
        axios
            .put(`${config.hotels}/${selectedHotel.id}`, selectedHotel, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                setHotels((prev) =>
                    prev.map((hotel) =>
                        hotel.id === selectedHotel.id ? response.data.hotel : hotel
                    )
                );
                setSelectedHotel(null);
                setUpdateLoading(false);
            })
            .catch((err) => {
                setError("Failed to update hotel data.");
                setUpdateLoading(false);
            });
    };

    const handleDeleteClick = (hotelId) => {
        setDeleteHotelId(hotelId);
    };

    const handleConfirmDelete = () => {
        axios
            .delete(`${config.hotels}/${deleteHotelId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then(() => {
                setHotels((prev) => prev.filter((hotel) => hotel.id !== deleteHotelId));
                setDeleteHotelId(null);
            })
            .catch((err) => {
                setError("Failed to delete hotel.");
                setDeleteHotelId(null);
            });
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h4" mb={2}>
                    Hotels List
                </Typography>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" mb={4} color="white">
                Hotels List
            </Typography>

            {hotels.length === 0 ? (
                <Typography textAlign="center" color="text.secondary">
                    No hotels available.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {hotels.map((hotel) => (
                        <Grid item xs={12} sm={6} md={4} key={hotel.hotel_id}>
                            <Card
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    boxShadow: 3,
                                    borderRadius: 2,
                                    borderColor: "red",
                                    backgroundColor: "#394851",
                                    color: "white"
                                }}
                            >
                                <CardContent color={"white"}>
                                    <Typography variant="h6" gutterBottom>
                                        {hotel.name}
                                    </Typography>
                                    <Divider sx={{ mb: 2, borderColor: "white" }} />
                                    <Typography variant="body2" color="white">
                                        <strong>City:</strong> {hotel.city}
                                    </Typography>
                                    <Typography variant="body2" color="white">
                                        <strong>Capacity:</strong> {hotel.capacity}
                                    </Typography>
                                    <Typography variant="body2" color="white">
                                        <strong>Peak Season Rate:</strong> ${hotel.peak_season_rate}
                                    </Typography>
                                    <Typography variant="body2" color="white">
                                        <strong>Off Peak Rate:</strong> ${hotel.off_peak_rate}
                                    </Typography>
                                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleUpdateClick(hotel)}
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDeleteClick(hotel.id)}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Update Modal */}
            <Modal
                open={!!selectedHotel}
                onClose={() => setSelectedHotel(null)}
                sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
                <Box
                    sx={{
                        width: 400,
                        bgcolor: "background.paper",
                        p: 3,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        Update Hotel Details
                    </Typography>
                    <TextField
                        label="Name"
                        fullWidth
                        name="name"
                        value={selectedHotel?.name || ""}
                        onChange={handleUpdateChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="City"
                        fullWidth
                        name="city"
                        value={selectedHotel?.city || ""}
                        onChange={handleUpdateChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Capacity"
                        fullWidth
                        name="capacity"
                        value={selectedHotel?.capacity || ""}
                        onChange={handleUpdateChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Peak Season Rate"
                        fullWidth
                        name="peak_season_rate"
                        value={selectedHotel?.peak_season_rate || ""}
                        onChange={handleUpdateChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Off Peak Rate"
                        fullWidth
                        name="off_peak_rate"
                        value={selectedHotel?.off_peak_rate || ""}
                        onChange={handleUpdateChange}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleUpdateSubmit}
                        disabled={updateLoading}
                    >
                        {updateLoading ? "Updating..." : "Submit"}
                    </Button>
                </Box>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deleteHotelId}
                onClose={() => setDeleteHotelId(null)}
            >
                <DialogTitle>Delete Hotel</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this hotel? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteHotelId(null)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Admin;

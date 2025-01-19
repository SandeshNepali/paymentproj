import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const HotelOccupancy = ({ data }) => {
    return (
        <Card sx={{ marginBottom: 3, backgroundColor: "#394851", borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h5" sx={{ color: "white", fontWeight: 'bold', marginBottom: 2 }}>
                    Hotel Occupancy
                </Typography>
                {data && data.length > 0 ? (
                    <Grid container spacing={2}>
                        {data.map((hotel, index) => {
                            const occupancyRate = (hotel["Booked Rooms"] / hotel["Total Rooms"]) * 100;
                            return (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card sx={{ backgroundColor: "#566c79", borderRadius: 2, boxShadow: 2, padding: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ color: "white", marginBottom: 1 }}>
                                                {hotel["Hotel Name"]}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: "white", marginBottom: 1 }}>
                                                <strong>City:</strong> {hotel.City}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: "white", fontWeight: 'bold' }}>
                                                <strong>Occupancy Rate:</strong> {occupancyRate.toFixed(2)}%
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                ) : (
                    <Box sx={{ textAlign: "center", marginTop: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                            No data available for hotel occupancy.
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default HotelOccupancy;

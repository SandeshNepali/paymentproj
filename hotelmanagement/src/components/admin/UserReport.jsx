import React from 'react';
import { Card, CardContent, Typography, Grid, Paper } from '@mui/material';

const UserReport = ({ data }) => {

    return (
        <Card sx={{ marginBottom: 2, boxShadow: 3, backgroundColor: "#394851" }}>
            <CardContent>
                <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                    Top User Report
                </Typography>
                {data && data.length > 0 ? (
                    <Grid container spacing={2}>
                        {data.map((user, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Paper sx={{ padding: 2, borderRadius: 2, boxShadow: 2, backgroundColor: "#566c79" }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {user.Username}
                                    </Typography>
                                    <Typography variant="body2" >
                                        <strong>Email:</strong> {user.Email}
                                    </Typography>
                                    <Typography variant="body2" >
                                        <strong>Number of Bookings:</strong> {user["Number of Bookings"]}
                                    </Typography>
                                    <Typography variant="body2" >
                                        <strong>Total Spend:</strong> ${user["Total Spend"].toFixed(2)}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="body2"  align="center">
                        No data available for user report.
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default UserReport;

import React, { useState, useEffect } from "react";
import { config } from "../../utils/config";
import axios from "axios";
import { Box, CircularProgress, Typography, Paper, Grid } from "@mui/material";
import UserReport from "./UserReport";
import HotelOccupancy from "./HotelOccupancy";
import RevenueReport from "./RevenueReport";

const Report = () => {
    const [userReportData, setUserReportData] = useState(null);
    const [hotelOccupancyData, setHotelOccupancyData] = useState(null);
    const [revenueReportData, setRevenueReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user report data
    const fetchUserReport = async () => {
        try {
            const response = await axios.get(config.topUsers(10), {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setUserReportData(response.data);
        } catch (error) {
            setError("Failed to fetch user report");
        }
    };

    // Fetch hotel occupancy data
    const fetchHotelOccupancy = async () => {
        try {
            const response = await axios.get(config.hotelOccupancy(1), {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setHotelOccupancyData(response.data);
        } catch (error) {
            setError("Failed to fetch hotel occupancy data");
        }
    };

    // Fetch revenue report data
    const fetchRevenueReport = async () => {
        try {
            const response = await axios.get(config.revenueReport("2025-01-01", "2025-01-31"), {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setRevenueReportData(response.data);
        } catch (error) {
            setError("Failed to fetch revenue report");
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchUserReport();
        fetchHotelOccupancy();
        fetchRevenueReport();
        setLoading(false);
    }, []);

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
            <Typography variant="h6" color="error" align="center" sx={{ mt: 4 }}>
                {error}
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 3, md: 4 },
                minHeight: "100vh",
                color: "white",
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                align="center"
                sx={{
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                    mb: { xs: 2, sm: 4 },
                }}
            >
                Reports
            </Typography>

            <Grid container spacing={3} sx={{ width: "90%" }}>
                {/* User Report Section */}
                {userReportData && (
                    <Grid item xs={12}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: { xs: 2, sm: 3 },
                                borderRadius: 2,
                                bgcolor: "#394851",
                                color: "white",
                            }}
                        >
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    fontSize: { xs: "1.2rem", sm: "1.5rem" },
                                }}
                            >
                                User Report
                            </Typography>
                            <UserReport data={userReportData} />
                        </Paper>
                    </Grid>
                )}

                {/* Hotel Occupancy Section */}
                {hotelOccupancyData && (
                    <Grid item xs={12}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: { xs: 2, sm: 3 },
                                borderRadius: 2,
                                bgcolor: "#394851",
                                color: "white",
                            }}
                        >
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    fontSize: { xs: "1.2rem", sm: "1.5rem" },
                                }}
                            >
                                Hotel Occupancy
                            </Typography>
                            <HotelOccupancy data={[hotelOccupancyData]} />
                        </Paper>
                    </Grid>
                )}

                {/* Revenue Report Section */}
                {revenueReportData && (
                    <Grid item xs={12}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: { xs: 2, sm: 3 },
                                borderRadius: 2,
                                bgcolor: "#394851",
                                color: "white",
                            }}
                        >
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    fontSize: { xs: "1.2rem", sm: "1.5rem" },
                                }}
                            >
                                Revenue Report
                            </Typography>
                            <RevenueReport data={[revenueReportData]} />
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default Report;

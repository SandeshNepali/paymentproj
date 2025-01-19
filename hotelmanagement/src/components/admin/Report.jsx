import React, { useState, useEffect } from "react";
import { config } from "../../utils/config";
import axios from "axios";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
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
    const fetchUserReport = async (userId) => {
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
    const fetchHotelOccupancy = async (hotelId) => {
        try {
            const response = await axios.get(config.hotelOccupancy(hotelId), {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setHotelOccupancyData(response.data);
        } catch (error) {
            setError("Failed to fetch hotel occupancy data");
        }
    };

    // Fetch revenue report data
    const fetchRevenueReport = async (startDate, endDate) => {
        try {
            const response = await axios.get(config.revenueReport(startDate, endDate), {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setRevenueReportData(response.data);
        } catch (error) {
            setError("Failed to fetch revenue report");
        }
    };

    useEffect(() => {
        setLoading(true);
        // Example of fetching data, you can customize the user ID, hotel ID, and dates
        fetchUserReport(1); // Fetch report for user with ID 1
        fetchHotelOccupancy(1); // Fetch occupancy data for hotel with ID 1
        fetchRevenueReport("2025-01-01", "2025-01-31"); // Fetch revenue report for January 2025
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography variant="h6" color="error" align="center">
                {error}
            </Typography>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom color="white">
                Reports
            </Typography>

            {
                userReportData && <UserReport data={userReportData} />
            }
            {
                hotelOccupancyData && <HotelOccupancy data={[hotelOccupancyData]} />
            }
            {
                revenueReportData && <RevenueReport data={[revenueReportData]} />
            }

        </div>
    );
};

export default Report;

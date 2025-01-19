import { CircularProgress, Box } from "@mui/material";


export const baseURL = "http://127.0.0.1:5000"

export const config = {
    singup: `${baseURL}/api/signup`,
    login: `${baseURL}/api/login`,
    users: `${baseURL}/api/user`,
    hotels: `${baseURL}/api/hotels`,
    addhotel: `${baseURL}/api/hotel`,
    allusers: `${baseURL}/api/allusers`,
    rooms: `${baseURL}/api/rooms`,
    bookings: `${baseURL}/api/bookings`,

    // Report API Endpoints
    userReport: (userId) => `${baseURL}/api/report/user/${userId}`,
    hotelOccupancy: (hotelId) => `${baseURL}/api/report/hotel/${hotelId}/occupancy`,
    revenueReport: (startDate, endDate) =>
        `${baseURL}/api/report/revenue?start_date=${startDate}&end_date=${endDate}`,
    hotelRevenue: (hotelId) => `${baseURL}/api/report/hotel/${hotelId}/revenue`,
    topUsers: (limit = 5) => `${baseURL}/api/report/top-users?limit=${limit}`,
}


export const ShowLoading = () => {

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional background overlay
            zIndex: 9999
        }}>
            <CircularProgress color="primary" size={50} />
        </Box>
    );
};

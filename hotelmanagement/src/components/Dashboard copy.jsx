// src/pages/Dashboard.js
import React, { useEffect } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import Admin from "./admin/Admin";
import User from "./user/User";
import { useAuth } from "../AuthContext";
import { ShowLoading } from "../utils/config";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, handleLogout } = useAuth(); // Access the user and logout function from AuthContext

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");  // If no token, redirect to login page
        }
    }, [navigate]);


    if (!user) {
        return (
            <>
                <ShowLoading />

            </>
        )
    }


    return (

        <Box sx={{ m: 3, position: "relative" }}>
            <Button
                variant="outlined"
                color="secondary"
                onClick={handleLogout}
                sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    textTransform: "none",
                    borderRadius: 2,
                    borderColor: "black",
                    color: "white"
                }}
            >
                Logout
            </Button>

            <Typography variant="h4" mb={2} color="white">
                Welcome to the Dashboard, {user.username}!
            </Typography>

            {user.role === "admin" ? (
                <Admin />
            ) : (
                <User />
            )}
        </Box>

    );
};

export default Dashboard;

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
        <Box
            sx={{
                p: { xs: 1, sm: 3, md: 4 },
                position: "relative",
                minHeight: "100vh",
            }}
        >
            <Button
                variant="outlined"
                color="secondary"
                onClick={handleLogout}
                sx={{
                    position: "absolute",
                    top: { xs: 8, sm: 16 },
                    right: { xs: 8, sm: 16 },
                    textTransform: "none",
                    borderRadius: 2,
                    borderColor: "white",
                    color: "white",
                    fontSize: { xs: "0.8rem", sm: "1rem" },
                }}
            >
                Logout
            </Button>

            <Typography
                variant="h4"
                mb={4}
                mt={5}
                color="white"
                textAlign={{ xs: "center", sm: "left" }}
                fontSize={{ xs: "1.5rem", sm: "2rem" }}
            >
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

import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import HotelIcon from "@mui/icons-material/Hotel";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const Explore = () => {
    return (
        <>
            {/* Navigation Bar */}
            <AppBar
                position="sticky"
                sx={{
                    background: "linear-gradient(to right, #00bcd4, #00838f)",
                    boxShadow: "none",
                }}
            >
                <Toolbar>
                    <HotelIcon sx={{ mr: 1, color: "white" }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, color: "white", fontWeight: "bold" }}>
                        World Hotel
                    </Typography>
                    <Button
                        component={Link}
                        to="/dashboard"
                        sx={{
                            color: "white",
                            border: "1px solid white",
                            "&:hover": {
                                backgroundColor: "white",
                                color: "#00838f",
                            },
                        }}
                    >
                        Dashboard
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Hero Section */}
            <Box
                sx={{
                    backgroundImage: `url('https://source.unsplash.com/1600x900/?luxury-hotel')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "75vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    textAlign: "center",
                    boxShadow: "inset 0 0 100px rgba(0, 0, 0, 0.5)",
                    position: "relative",
                }}
            >
                <Typography variant="h3" sx={{ fontWeight: "bold", textShadow: "3px 3px 8px black" }}>
                    Explore Luxury Hotels Worldwide
                </Typography>
            </Box>

            {/* Map Section */}
            <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "" }}>
                    Our Featured Location
                </Typography>
                <Box
                    sx={{
                        mt: 3,
                        width: "100%",
                        height: "400px",
                        borderRadius: "8px",
                        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    {/* OpenStreetMap using react-leaflet */}
                    <MapContainer
                        center={[51.505, -0.09]} // Coordinates for a sample location (London)
                        zoom={13}
                        scrollWheelZoom={false}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[51.505, -0.09]}>
                            <Popup>A luxury hotel here in London!</Popup>
                        </Marker>
                    </MapContainer>
                </Box>
            </Box>

            {/* Footer Section */}
            <Box
                sx={{
                    backgroundColor: "#1c313a",
                    color: "white",
                    py: 4,
                    textAlign: "center",
                }}
            >
                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                    Stay Connected
                </Typography>
                <Box sx={{ mb: 2 }}>
                    <IconButton sx={{ color: "white", mr: 2 }}>
                        <FacebookIcon />
                    </IconButton>
                    <IconButton sx={{ color: "white", mr: 2 }}>
                        <TwitterIcon />
                    </IconButton>
                    <IconButton sx={{ color: "white" }}>
                        <InstagramIcon />
                    </IconButton>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Follow us on social media for the latest updates.
                </Typography>
                <Typography variant="body2">
                    © {new Date().getFullYear()} Hotel Explorer. All rights reserved.
                </Typography>
            </Box>
        </>
    );
};

export default Explore;

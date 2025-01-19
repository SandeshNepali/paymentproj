import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    Grid,
    Paper,
    IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import HotelIcon from "@mui/icons-material/Hotel";
import StarIcon from "@mui/icons-material/Star";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import swimming from "./images/swimming.png"
import login from "./images/login.webp"

const Home = () => {
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
                    backgroundImage: `url(${login})`,
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
                <Box sx={{ zIndex: 10 }}>
                    <Typography variant="h2" sx={{ fontWeight: "bold", textShadow: "4px 4px 10px black" }}>
                        Discover Your Dream Stay
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 2, textShadow: "3px 3px 8px black" }}>
                        Luxury and comfort, wherever you go.
                    </Typography>
                    <Button
                        component={Link}
                        to="/explore"
                        sx={{
                            mt: 4,
                            backgroundColor: "#ff7043",
                            color: "white",
                            padding: "12px 24px",
                            fontSize: "18px",
                            fontWeight: "bold",
                            borderRadius: "50px",
                            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
                            "&:hover": {
                                backgroundColor: "#ff5722",
                            },
                        }}
                    >
                        Explore Hotels
                    </Button>
                </Box>
                {/* Subtle Overlay */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0, 0, 0, 0.3)",
                    }}
                />
            </Box>

            {/* About Us Section */}
            <AboutUs />

            {/* Features Section */}
            <Container>
                <Typography
                    variant="h4"
                    sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        mb: 3,
                        textTransform: "uppercase",
                    }}
                >
                    Why Choose Us?
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={6}
                            sx={{
                                padding: 3,
                                textAlign: "center",
                                backgroundColor: "#f5f5f5",
                                transition: "transform 0.3s, box-shadow 0.3s",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                                },
                            }}
                        >
                            <StarIcon sx={{ fontSize: 40, color: "#ff7043", mb: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Luxury Stays
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#616161" }}>
                                Experience the finest accommodations.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={6}
                            sx={{
                                padding: 3,
                                textAlign: "center",
                                backgroundColor: "#f5f5f5",
                                transition: "transform 0.3s, box-shadow 0.3s",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                                },
                            }}
                        >
                            <SupportAgentIcon sx={{ fontSize: 40, color: "#ff7043", mb: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                24/7 Support
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#616161" }}>
                                Our team is here to assist you around the clock.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Footer Section */}
            <Box
                sx={{
                    backgroundColor: "#1c313a",
                    color: "white",
                    py: 4,
                    mt: 6,
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
                    © {new Date().getFullYear()}  World Hotel. All rights reserved.
                </Typography>
            </Box>
        </>
    );
};

export default Home;


const AboutUs = () => {
    return (
        <Container sx={{ my: 6 }}>
            <Typography
                variant="h4"
                sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    mb: 3,
                    textTransform: "uppercase",
                }}
            >
                About Us
            </Typography>

            <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                    <img
                        src={swimming}
                        alt="Swimming Pool"
                        style={{
                            width: "100%",
                            borderRadius: "8px",
                            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ textAlign: "center", color: "white", mb: 4 }}>
                        At Hotel Explorer, we offer exceptional hospitality experiences by connecting you with the finest hotels
                        worldwide. Your perfect stay is just a click away. Whether you're planning a getaway for relaxation or a business trip, we help you find the best accommodations that meet your needs.
                    </Typography>

                    <Typography variant="body1" sx={{ textAlign: "center", color: "white", mb: 4 }}>
                        Our platform provides a curated list of luxury hotels and resorts that promise comfort and luxury in every stay.
                        With state-of-the-art amenities, breathtaking views, and personalized service, we aim to make your stay unforgettable.
                    </Typography>


                    <Typography variant="body1" sx={{ textAlign: "center", color: "white" }}>
                        Join us at Hotel Explorer and discover a world of exceptional stays with the click of a button.
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    );
};
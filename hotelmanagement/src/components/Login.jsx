import React, { useState } from "react";
import axios from "axios";
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import loginImage from "./images/login.webp"; // Make sure the image is in the right folder

const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const { message, handleLogin } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        handleLogin(formData); // Use handleLogin from context
    };

    const navigate = useNavigate();

    const handleSignupRedirect = () => {
        navigate("/signup");  // Redirect to Signup page using navigate
    };

    return (
        <Box
            sx={{
                boxShadow: 3,
                borderRadius: 2,
                textAlign: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark background
                backdropFilter: "blur(5px)", // Optional: adds blur effect to the background image
                backgroundImage: `url(${loginImage})`, // Use the login image as the background
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white", // Text color
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box sx={{ maxWidth: 400, width: "100%" }}>
                <Typography variant="h5" mb={2} color="primary">
                    Login
                </Typography>

                {message && (
                    <Alert severity={message.type} sx={{ mb: 2 }}>
                        {message.text}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        name="username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: "4px",
                            mb: 2,
                            "& .MuiInputBase-root": { borderRadius: "8px" },
                        }}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: "4px",
                            mb: 3,
                            "& .MuiInputBase-root": { borderRadius: "8px" },
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 2,
                            borderRadius: "8px",
                            backgroundColor: "#1976d2",
                            "&:hover": { backgroundColor: "#1565c0" },
                        }}
                    >
                        Login
                    </Button>
                </form>

                <Typography variant="body2" sx={{ mt: 2, color: "white" }}>
                    Don't have an account?{" "}
                    <Button
                        onClick={handleSignupRedirect}
                        sx={{
                            textDecoration: "underline",
                            padding: 0,
                            color: "#90A4AE",
                            "&:hover": { color: "#ffffff" },
                            backgroundColor: "#186bc3",  // Slight background for contrast
                            borderRadius: "4px",  // Optional rounded corners for the button
                            paddingLeft: "4px",
                            paddingRight: "4px",
                        }}
                    >
                        Sign up
                    </Button>
                </Typography>
            </Box>
        </Box>
    );
};

export default Login;

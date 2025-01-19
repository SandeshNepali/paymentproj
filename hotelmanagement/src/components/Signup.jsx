import React, { useState } from "react";
import axios from "axios";
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { config } from "../utils/config";
import signupImage from "./images/login.webp"; // Import background image
import { toast } from "react-toastify";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "user", // Default role
    });

    const [message, setMessage] = useState(null);  // To show success or error messages
    const navigate = useNavigate();  // Initialize the useNavigate hook

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(config.singup, formData);

            // Check if the signup was successful and handle the response accordingly
            if (response.status === 200 || response.status === 201) {
                // Redirect to login page after 2 seconds
                setMessage(null)
                toast.success("Signup successful! Redirecting to login...", {
                    position: "top-center",  // Position the toast at the top-center
                    autoClose: 3000,  // Auto close the toast after 3 seconds
                    hideProgressBar: true,  // Hide progress bar
                });
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }

        } catch (error) {
            // Handle error messages based on the response
            if (error.response && error.response.data) {
                setMessage({
                    type: "error",
                    text: error.response.data.message || "An error occurred during signup.",
                });
            } else if (error.request) {
                setMessage({
                    type: "error",
                    text: "Network error. Please check your internet connection.",
                });
            } else {
                setMessage({
                    type: "error",
                    text: "An unexpected error occurred. Please try again later.",
                });
            }
        }
    };

    const handleLoginRedirect = () => {
        navigate("/login");  // Redirect to Login page using navigate
    };

    return (
        <Box
            sx={{
                boxShadow: 3,
                borderRadius: 2,
                textAlign: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark background
                backdropFilter: "blur(5px)", // Blur effect to the background
                backgroundImage: `url(${signupImage})`, // Background image
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white", // Text color
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "16px", // Padding to prevent content from touching screen edges
            }}
        >
            <Box
                sx={{
                    maxWidth: 400,
                    width: "100%",
                    padding: { xs: 2, sm: 3 }, // Padding adjustment for different screen sizes
                    borderRadius: 2, // Rounded corners
                }}
            >
                <Typography variant="h5" mb={2} color="primary">
                    Signup
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
                            borderRadius: "8px",
                            mb: 2,
                            "& .MuiInputBase-root": { borderRadius: "8px" },
                        }}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
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
                            borderRadius: "8px",
                            mb: 2,
                            "& .MuiInputBase-root": { borderRadius: "8px" },
                        }}
                    />
                    <TextField
                        label="Role"
                        name="role"
                        select
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formData.role}
                        onChange={handleChange}
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            mb: 2,
                            "& .MuiInputBase-root": { borderRadius: "8px" },
                        }}
                    >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
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
                        Signup
                    </Button>
                </form>

                <Typography variant="body2" sx={{ mt: 2, color: "white" }}>
                    Already have an account?{" "}
                    <Button
                        onClick={handleLoginRedirect}  // Trigger the onClick handler
                        sx={{
                            textDecoration: "underline",
                            padding: 0,
                            color: "#90A4AE",
                            "&:hover": { color: "#ffffff" },
                            backgroundColor: "#186bc3",  // Slight background for contrast
                            borderRadius: "4px",
                            paddingLeft: "4px",
                            paddingRight: "4px",
                        }}
                    >
                        Login
                    </Button>
                </Typography>
            </Box>
        </Box>
    )

    return (
        <Box
            sx={{
                boxShadow: 3,
                borderRadius: 2,
                textAlign: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark background
                backdropFilter: "blur(5px)", // Blur effect to the background
                backgroundImage: `url(${signupImage})`, // Background image
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
                    Signup
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
                            borderRadius: "8px",
                            mb: 2,
                            "& .MuiInputBase-root": { borderRadius: "8px" },
                        }}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
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
                            borderRadius: "8px",
                            mb: 2,
                            "& .MuiInputBase-root": { borderRadius: "8px" },
                        }}
                    />
                    <TextField
                        label="Role"
                        name="role"
                        select
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formData.role}
                        onChange={handleChange}
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            mb: 2,
                            "& .MuiInputBase-root": { borderRadius: "8px" },
                        }}
                    >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
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
                        Signup
                    </Button>
                </form>

                <Typography variant="body2" sx={{ mt: 2 }}>
                    Already have an account?{" "}
                    <Button
                        onClick={handleLoginRedirect}  // Trigger the onClick handler
                        sx={{
                            textDecoration: "underline",
                            padding: 0,
                            color: "#90A4AE",
                            "&:hover": { color: "#ffffff" },
                            backgroundColor: "#186bc3",  // Slight background for contrast
                            borderRadius: "4px",
                            paddingLeft: "4px",
                            paddingRight: "4px",
                        }}
                    >
                        Login
                    </Button>
                </Typography>
            </Box>
        </Box>
    );
};

export default Signup;

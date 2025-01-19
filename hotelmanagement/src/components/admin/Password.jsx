import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Modal,
    Box,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { config } from "../../utils/config";
import { toast } from "react-toastify";
import { useTheme } from '@mui/system';

const Password = () => {
    const [users, setUsers] = useState([]); // Stores all users
    const [loading, setLoading] = useState(true); // Tracks loading state
    const [error, setError] = useState(null); // Tracks errors
    const [open, setOpen] = useState(false); // Modal open/close state
    const [selectedUser, setSelectedUser] = useState(null); // Selected user for password update
    const [newPassword, setNewPassword] = useState(""); // New password input
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(config.allusers, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Auth token
                    },
                });
                setUsers(response.data.users);
                setLoading(false);
            } catch (err) {
                setError(err.response ? err.response.data.message : "Something went wrong");
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Handle password change
    const handlePasswordChange = async () => {
        try {
            await axios.put(
                `${config.users}/${selectedUser.id}`,
                { new_password: newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Auth token
                    },
                }
            );
            toast.success(`Password updated successfully for ${selectedUser.email}`, {
                position: "top-center",  // Position the toast at the top-center
                autoClose: 3000,  // Auto close the toast after 3 seconds
                hideProgressBar: true,  // Hide progress bar
            });
            setOpen(false);
            setNewPassword("");
        } catch (err) {
            alert(err.response ? err.response.data.message : "Failed to update password");
        }
    };

    // Modal open/close handlers
    const handleOpen = (user) => {
        setSelectedUser(user);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setNewPassword("");
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <Typography variant="h4" gutterBottom color="white" marginTop={5}>
                All Users
            </Typography>
            <TableContainer component={Paper} sx={{ backgroundColor: "#394851", width: isSmallScreen ? "350px" : "100%", }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: "#B0BEC5" }}>ID</TableCell>
                            <TableCell sx={{ color: "#B0BEC5" }}>Email</TableCell>
                            <TableCell sx={{ color: "#B0BEC5" }}>Username</TableCell>
                            <TableCell sx={{ color: "#B0BEC5" }}>Role</TableCell>
                            <TableCell sx={{ color: "#B0BEC5" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell sx={{ color: "#90A4AE" }}>{user.id}</TableCell>
                                <TableCell sx={{ color: "#90A4AE" }}>{user.email}</TableCell>
                                <TableCell sx={{ color: "#90A4AE" }}>{user.username}</TableCell>
                                <TableCell sx={{ color: "#90A4AE" }}>{user.role}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpen(user)}
                                    >
                                        Change Password
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal for changing password */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: isSmallScreen ? "300px" : 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Change Password for {selectedUser?.email}
                    </Typography>
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handlePasswordChange}
                        disabled={!newPassword}
                    >
                        Update Password
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default Password;

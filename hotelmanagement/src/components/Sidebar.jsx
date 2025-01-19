import React from "react";
import { Drawer, List, ListItem, ListItemText, Divider, ListItemIcon, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext"; // Assuming useAuth is managing the user's state
import DashboardIcon from '@mui/icons-material/Dashboard';
import HotelIcon from '@mui/icons-material/Hotel';
import RoomIcon from '@mui/icons-material/Room';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReportIcon from '@mui/icons-material/Report';
import LockIcon from '@mui/icons-material/Lock';
import BookIcon from '@mui/icons-material/Book';
import CancelIcon from '@mui/icons-material/Cancel';
import { blueGrey } from '@mui/material/colors';

const Sidebar = () => {
    const { user } = useAuth(); // Accessing the user context to determine the role

    return (
        <Drawer
            sx={{
                width: 240,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: 240,
                    boxSizing: "border-box",
                    backgroundColor: blueGrey[800], // Dark background color for the sidebar
                    color: 'white',
                    paddingTop: 2,
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Box sx={{ padding: 2, textAlign: "center" }}>
                {
                    user?.role === "admin" &&
                    <h2>Hotel Admin</h2>
                }
                {
                    user?.role !== "admin" &&
                    <h2>World Hotel</h2>
                }
            </Box>

            <List>
                <ListItem button component={Link} to="/dashboard" sx={{ '&:hover': { backgroundColor: blueGrey[700] } }}>
                    <ListItemIcon sx={{ color: 'white' }}><DashboardIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard" sx={{ color: 'white' }} />
                </ListItem>
                <Divider sx={{ backgroundColor: 'white' }} />

                {/* Show Hotels link only if the user is an admin */}
                {user?.role === "admin" && (
                    <>
                        <ListItem button component={Link} to="/hotels" sx={{ '&:hover': { backgroundColor: blueGrey[700] } }}>
                            <ListItemIcon sx={{ color: 'white' }}><HotelIcon /></ListItemIcon>
                            <ListItemText primary="Hotels" sx={{ color: 'white' }} />
                        </ListItem>
                        <ListItem button component={Link} to="/room" sx={{ '&:hover': { backgroundColor: blueGrey[700] } }}>
                            <ListItemIcon sx={{ color: 'white' }}><RoomIcon /></ListItemIcon>
                            <ListItemText primary="Rooms" sx={{ color: 'white' }} />
                        </ListItem>
                        <ListItem button component={Link} to="/booklist" sx={{ '&:hover': { backgroundColor: blueGrey[700] } }}>
                            <ListItemIcon sx={{ color: 'white' }}><ListAltIcon /></ListItemIcon>
                            <ListItemText primary="Booking List" sx={{ color: 'white' }} />
                        </ListItem>
                        <ListItem button component={Link} to="/report" sx={{ '&:hover': { backgroundColor: blueGrey[700] } }}>
                            <ListItemIcon sx={{ color: 'white' }}><ReportIcon /></ListItemIcon>
                            <ListItemText primary="Report List" sx={{ color: 'white' }} />
                        </ListItem>
                        <ListItem button component={Link} to="/changepassword" sx={{ '&:hover': { backgroundColor: blueGrey[700] } }}>
                            <ListItemIcon sx={{ color: 'white' }}><LockIcon /></ListItemIcon>
                            <ListItemText primary="Change Password" sx={{ color: 'white' }} />
                        </ListItem>
                    </>
                )}

                {/* If user role is 'user', show relevant links */}
                {user?.role === "user" && (
                    <>
                        <ListItem button component={Link} to="/booking" sx={{ '&:hover': { backgroundColor: blueGrey[700] } }}>
                            <ListItemIcon sx={{ color: 'white' }}><BookIcon /></ListItemIcon>
                            <ListItemText primary="My Booking" sx={{ color: 'white' }} />
                        </ListItem>
                        <ListItem button component={Link} to="/cancelroom" sx={{ '&:hover': { backgroundColor: blueGrey[700] } }}>
                            <ListItemIcon sx={{ color: 'white' }}><CancelIcon /></ListItemIcon>
                            <ListItemText primary="Cancel Booked Rooms" sx={{ color: 'white' }} />
                        </ListItem>
                    </>
                )}
            </List>
        </Drawer>
    );
};

export default Sidebar;

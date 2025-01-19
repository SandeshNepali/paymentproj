import React, { useState } from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    ListItemIcon,
    IconButton,
    Box,
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HotelIcon from "@mui/icons-material/Hotel";
import RoomIcon from "@mui/icons-material/Room";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ReportIcon from "@mui/icons-material/Report";
import LockIcon from "@mui/icons-material/Lock";
import BookIcon from "@mui/icons-material/Book";
import CancelIcon from "@mui/icons-material/Cancel";
import { blueGrey } from "@mui/material/colors";

const Sidebar = () => {
    const { user } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleDrawer = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawerWidth = 240;

    const drawerContent = (
        <>
            <Box sx={{ padding: 2, textAlign: "center" }}>
                {user?.role === "admin" ? (
                    <Typography variant="h6">Hotel Admin</Typography>
                ) : (
                    <Typography variant="h6">World Hotel</Typography>
                )}
            </Box>

            <List>
                <ListItem
                    button
                    component={Link}
                    to="/dashboard"
                    sx={{ "&:hover": { backgroundColor: blueGrey[700] } }}
                >
                    <ListItemIcon sx={{ color: "white" }}>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" sx={{ color: "white" }} />
                </ListItem>
                <Divider sx={{ backgroundColor: "white" }} />

                {user?.role === "admin" && (
                    <>
                        <ListItem
                            button
                            component={Link}
                            to="/hotels"
                            sx={{ "&:hover": { backgroundColor: blueGrey[700] } }}
                        >
                            <ListItemIcon sx={{ color: "white" }}>
                                <HotelIcon />
                            </ListItemIcon>
                            <ListItemText primary="Hotels" sx={{ color: "white" }} />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/room"
                            sx={{ "&:hover": { backgroundColor: blueGrey[700] } }}
                        >
                            <ListItemIcon sx={{ color: "white" }}>
                                <RoomIcon />
                            </ListItemIcon>
                            <ListItemText primary="Rooms" sx={{ color: "white" }} />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/booklist"
                            sx={{ "&:hover": { backgroundColor: blueGrey[700] } }}
                        >
                            <ListItemIcon sx={{ color: "white" }}>
                                <ListAltIcon />
                            </ListItemIcon>
                            <ListItemText primary="Booking List" sx={{ color: "white" }} />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/report"
                            sx={{ "&:hover": { backgroundColor: blueGrey[700] } }}
                        >
                            <ListItemIcon sx={{ color: "white" }}>
                                <ReportIcon />
                            </ListItemIcon>
                            <ListItemText primary="Report List" sx={{ color: "white" }} />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/changepassword"
                            sx={{ "&:hover": { backgroundColor: blueGrey[700] } }}
                        >
                            <ListItemIcon sx={{ color: "white" }}>
                                <LockIcon />
                            </ListItemIcon>
                            <ListItemText primary="Change Password" sx={{ color: "white" }} />
                        </ListItem>
                    </>
                )}

                {user?.role === "user" && (
                    <>
                        <ListItem
                            button
                            component={Link}
                            to="/booking"
                            sx={{ "&:hover": { backgroundColor: blueGrey[700] } }}
                        >
                            <ListItemIcon sx={{ color: "white" }}>
                                <BookIcon />
                            </ListItemIcon>
                            <ListItemText primary="My Booking" sx={{ color: "white" }} />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/cancelroom"
                            sx={{ "&:hover": { backgroundColor: blueGrey[700] } }}
                        >
                            <ListItemIcon sx={{ color: "white" }}>
                                <CancelIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Cancel Booked Rooms"
                                sx={{ color: "white" }}
                            />
                        </ListItem>
                    </>
                )}
            </List>
        </>
    );

    return (
        <>
            {/* Hamburger menu for mobile view */}
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer}
                sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    zIndex: 1300, // Ensure it's above the Drawer
                    display: { sm: "none" }, // Only show on mobile
                }}
            >
                <MenuIcon sx={{ color: 'white' }} />
            </IconButton>

            {/* Permanent drawer for desktop */}
            <Drawer
                sx={{
                    display: { xs: "none", sm: "block" },
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: blueGrey[800],
                        color: "white",
                    },
                }}
                variant="permanent"
                open
            >
                {drawerContent}
            </Drawer>

            {/* Temporary drawer for mobile */}
            <Drawer
                sx={{
                    display: { xs: "block", sm: "none" },
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: blueGrey[800],
                        color: "white",
                    },
                }}
                variant="temporary"
                open={mobileOpen}
                onClose={toggleDrawer}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
            >
                <Box display="flex" justifyContent="flex-end" p={1}>
                    <IconButton onClick={toggleDrawer} sx={{ color: "white" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Sidebar;

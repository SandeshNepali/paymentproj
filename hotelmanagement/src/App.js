import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Hotels from "./components/admin/Hotels";
import { AuthProvider } from "./AuthContext";
import Sidebar from "./components/Sidebar"; // Sidebar component
import Password from "./components/admin/Password";
import Room from "./components/admin/Room";
import Booking from "./components/user/Booking";
import Cancel from "./components/user/Cancel";
import BookedList from "./components/admin/BookedList";
import Report from "./components/admin/Report";
import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";
import Home from "./components/Home";
import Explore from "./components/Explore";

// Layout for routes that include the Sidebar
const LayoutWithSidebar = () => (
  <div style={{ display: "flex" }}>
    <Sidebar /> {/* Sidebar is always visible */}
    <div style={{ flexGrow: 1, padding: "20px" }}>
      <Outlet /> {/* Outlet renders the nested routes' content */}
    </div>
  </div>
);

function App() {
  return (
    // <Box sx={{ backgroundColor: "#303c46", minHeight: "100vh" }}>
    <Box sx={{ backgroundColor: "#384750", minHeight: "100vh" }}>

      <ToastContainer />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            {/* Routes without Sidebar */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* Routes with Sidebar Layout */}
            <Route element={<LayoutWithSidebar />}>
              <Route path="/dashboard" element={<Dashboard />} />

              {/* admin  */}
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/changepassword" element={<Password />} />
              <Route path="/room" element={<Room />} />
              <Route path="/booklist" element={<BookedList />} />
              <Route path="/report" element={<Report />} />


              {/* user  */}
              <Route path="/booking" element={<Booking />} />
              <Route path="/cancelroom" element={<Cancel />} />

            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </Box>
  );
}

export default App;

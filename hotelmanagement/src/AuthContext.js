import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { config } from "./utils/config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 < Date.now(); 
        } catch (err) {
            return true; 
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            if (isTokenExpired(token)) {
                handleLogout();
            } else {
                axios
                    .get(config.users, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    .then((response) => {
                        setUser(response.data);
                    })
                    .catch(() => {
                        setMessage({ type: "error", text: "Failed to fetch user data." });
                        handleLogout();
                    });
            }
        } else {
            navigate("/");
        }
    }, []); 

    const handleLogin = async (formData) => {
        try {
            const response = await axios.post(config.login, formData);
            const { token } = response.data;
            localStorage.setItem("token", token);

            axios
                .get(config.users, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    setUser(response.data);
                    setMessage(null);
                    navigate("/dashboard");
                })
                .catch(() => {
                    setMessage({ type: "error", text: "Failed to fetch user data after login." });
                });

        } catch (error) {
            setMessage({ type: "error", text: error.response?.data?.message || "Login failed." });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ user, message, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

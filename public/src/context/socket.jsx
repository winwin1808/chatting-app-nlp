import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { host } from '../utils/ApiRoutes';

const SocketContext = createContext();
const currentUser = JSON.parse(localStorage.getItem("register-user"));
export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if (currentUser) {
            // Initialize socket connection
            const socket = io(host, {
                query: {
                    userId: currentUser._id,
                },
                withCredentials: true,
            });

            setSocket(socket);

            // Event listener for online users
            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            // Event listener for new customer messages
            socket.on("newCustomerMessage", (message) => {
                console.log("New customer message:", message);
                // Handle new customer message
            });

            // Event listener for new agent messages
            socket.on("newAgentMessage", (message) => {
                console.log("New agent message:", message);
                // Handle new agent message
            });

            // Clean up the socket when the component unmounts or user logs out
            return () => {
                socket.close();
                setSocket(null);
            };
        }
    }, []); // Depend on the currentUser state to reinitialize the socket if necessary

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

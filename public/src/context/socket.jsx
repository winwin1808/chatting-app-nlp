import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { host } from '../utils/ApiRoutes';

const SocketContext = createContext();
const user = JSON.parse(localStorage.getItem("register-user"));

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if (user) {
            // Initialize socket connection
            const socket = io(host, {
                query: {
                    userId: user._id,
                },
                withCredentials: true,
            });

            setSocket(socket);

            // Event listener for online users
            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            // Clean up the socket when the component unmounts or user logs out
            return () => {
                socket.close();
                setSocket(null);
            };
        }
    }, []); // Depend on the user state to reinitialize the socket if necessary

    useEffect(() => {
    }, [onlineUsers]); // Depend on onlineUsers to log when it changes

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

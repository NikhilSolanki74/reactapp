import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ sellerId, children }) => {
    const [ws, setWs] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:4000');
        setWs(socket);

        socket.onopen = () => {
            console.log(`Connected as seller ${sellerId}`);
            socket.send(JSON.stringify({ sellerId }));
        };

        socket.onmessage = (event) => {
            // console.log(event,'hhhhhhhhhhh')
            const data = JSON.parse(event.data);
            if (data.type === 'ORDER_NOTIFICATION') {
                setNotifications((prev) => [...prev, data.message]);
                console.log(data);
            }
        };

        return () => socket.close();
    }, [sellerId]);

    return (
        <WebSocketContext.Provider value={{ ws, notifications }}>
            {children}
        </WebSocketContext.Provider>
    );
};

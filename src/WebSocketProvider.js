import React, { createContext, useContext, useEffect, useState } from 'react';
import { triggerNotification } from "./Component/Notification";
import { setCart } from './Redux/Features/UserCartSlice';
import { useDispatch ,useSelector} from 'react-redux';
const WebSocketContext = createContext(null);

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ sellerId, children }) => {
    const cart = useSelector(state=> state.cart)
    const dispatch = useDispatch();
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
            const data = JSON.parse(event.data);
            if (data.type === 'ORDER_NOTIFICATION') {
                triggerNotification(data.message,"info")
                setNotifications((prev) => [...prev, data.message]);
                // console.log(notifications,'notify');
                dispatch(setCart({tag:true}));
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

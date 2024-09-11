import React, { createContext, useContext, useEffect, useState } from 'react';
import { triggerNotification } from "./Component/Notification";
import { setCart } from './Redux/Features/UserCartSlice';
import { useDispatch ,useSelector} from 'react-redux';
const WebSocketContext = createContext(null);

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ sellerId, children }) => {
    const dispatch = useDispatch();
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:4000');
        setWs(socket);

        socket.onopen = () => {
            socket.send(JSON.stringify({ sellerId }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'ORDER_NOTIFICATION') {
                triggerNotification(data.message,"info")
                dispatch(setCart({tag:true}));

            }else if(data.type === 'ORDER_CHANGE'){
                triggerNotification(data.message,"info")
                dispatch(setCart({tag:true}));

            }
        };

        return () => socket.close();
    }, [sellerId]);

    return (
        <WebSocketContext.Provider value={{ ws }}>
            {children}
        </WebSocketContext.Provider>
    );
};

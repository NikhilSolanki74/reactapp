const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const { db } = require('./dbConnection/db');
const sellerRoutes = require('./Routes/SellerRoute');
const userRoutes = require('./Routes/Route');
const adminRoutes = require('./Routes/AdminRoute');

db();
const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

 let clients = {};

wss.on('connection', (ws, req) => {
    ws.on('message', (message) => {
        const { sellerId } = JSON.parse(message);
        clients[sellerId] = ws;
    });

    ws.on('close', () => {
        for (let sellerId in clients) {
            if (clients[sellerId] === ws) {
                delete clients[sellerId];
            }
        }
    });
});


app.use(express.json());
app.use(cors());
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Access-Control-Allow-Headers, Content-Type, Authorization, Origin, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true)
    next();
});

app.use('/api/v1/user/',(req,res,next)=>{req.body.clients = clients;next()}, userRoutes);
app.use('/api/v1/admin/', adminRoutes);
app.use('/api/v1/seller/', sellerRoutes);

server.listen(4000, () => {
    console.log('App is running on port:4000');
});


module.exports = {clients};

require('dotenv').config();

const express = require('express')
const app = express();
const http = require("http")
const cors = require("cors");
const {Server} = require('socket.io')

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: process.env.CORS_ORIGIN || "realtimechatapp-seven.vercel.app",
        methods:["GET", "POST"],
        credentials: true,
    }
})

// In-memory storage for messages (replace with database for production)
const roomMessages = {};

io.on("connection",(socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);

        if (roomMessages[data]) {
            socket.emit("previous_messages", roomMessages[data]);
        } else {
            roomMessages[data] = [];
        }
    });

    socket.on("send_message", (data) => {

        if (!roomMessages[data.room]) {
            roomMessages[data.room] = [];
        }
        roomMessages[data.room].push(data);

        socket.to(data.room).emit("receive_message", data);
    });
    
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id)
    })
})

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
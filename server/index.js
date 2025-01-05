const express = require('express')
const app = express();
const http = require("http")
const cors = require("cors");
const {Server} = require('socket.io')

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin:"https://real-time-chat-bot.vercel.app/",
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

        // Send previous messages to the user
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

        // Broadcast the message to other users in the room
        socket.to(data.room).emit("receive_message", data);
    });
    
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id)
    })
})

server.listen(3000, () => {
    console.log("server running")
})
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    },
    allowEIO3: true
});

let users = ['User'];
let messages = [];

io.on('connection', (socket) => {

    socket.on('auth_user', (data) => {
        console.log('a user connected', data);
        socket.username = data;
        if (users.indexOf(data) === -1) {
            users.push(data);
        }
        io.sockets.emit('users', users);
    });
    socket.on('add_message', (data) => {
        console.log('a user add message', data, socket.username);
        io.sockets.emit('new_message', {
            text: data,
            username: socket.username,
            time: Date.now()
        });
    })
});

server.listen(4444, () => {
    console.log('listening on: 4444');
});
const { Server } = require("socket.io");
const ACTIONS = require("./Actions");

const userSocketMap = {};
const roomCodeMap = {};
const roomUsers = {};
const roomMessages = {};

function getAllConnectedClients(io, roomId) {
    const uniqueUsers = new Map();
    Array.from(io.sockets.adapter.rooms.get(roomId) || []).forEach((socketId) => {
        const username = userSocketMap[socketId];
        if (username) {
            uniqueUsers.set(username, { socketId, username });
        }
    });
    return Array.from(uniqueUsers.values());
}

function initializeSocket(server) {
    const io = new Server(server, {
        cors: { origin: "*", methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
            console.log("User joined:", { roomId, username, socketId: socket.id });
            const existingSockets = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            existingSockets.forEach((existingSocketId) => {
                if (userSocketMap[existingSocketId] === username) {
                    const existingSocket = io.sockets.sockets.get(existingSocketId);
                    if (existingSocket && existingSocket.id !== socket.id) {
                        existingSocket.leave(roomId);
                        delete userSocketMap[existingSocketId];
                    }
                }
            });

            userSocketMap[socket.id] = username;
            socket.join(roomId);
            if (!roomUsers[roomId]) roomUsers[roomId] = new Set();
            roomUsers[roomId].add(username);

            const clients = getAllConnectedClients(io, roomId);
            io.to(roomId).emit(ACTIONS.JOINED, { clients, username, socketId: socket.id });

            if (roomCodeMap[roomId]) {
                socket.emit(ACTIONS.CODE_CHANGE, { code: roomCodeMap[roomId] });
            }

            if (!roomMessages[roomId]) {
                roomMessages[roomId] = [];
            }
        });

        socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
            roomCodeMap[roomId] = code;
            socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
        });

        socket.on(ACTIONS.SYNC_CODE, ({ socketId, roomId, code }) => {
            if (code !== undefined) {
                roomCodeMap[roomId] = code;
            }
            if (roomCodeMap[roomId]) {
                io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code: roomCodeMap[roomId] });
            }
        });

        socket.on(ACTIONS.SEND_MESSAGE, ({ roomId, message, username }) => {
            console.log("Server received message:", { roomId, message, username });
            const messageData = { id: Date.now(), username, message, timestamp: new Date().toISOString() };

            if (!roomMessages[roomId]) roomMessages[roomId] = [];
            roomMessages[roomId].push(messageData);
            if (roomMessages[roomId].length > 100) {
                roomMessages[roomId] = roomMessages[roomId].slice(-100);
            }

            console.log("Broadcasting message to room:", roomId);
            io.to(roomId).emit(ACTIONS.RECEIVE_MESSAGE, messageData);
        });

        socket.on(ACTIONS.FETCH_MESSAGES, ({ roomId }) => {
            console.log("Fetching messages for room:", roomId);
            const messages = roomMessages[roomId] || [];
            console.log("Found messages:", messages);
            socket.emit(ACTIONS.FETCH_MESSAGES, { messages });
        });

        socket.on("disconnecting", () => {
            const rooms = Array.from(socket.rooms);
            rooms.forEach((roomId) => {
                if (roomId !== socket.id) {
                    const username = userSocketMap[socket.id];
                    const hasOtherConnections = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
                        .some((sid) => sid !== socket.id && userSocketMap[sid] === username);

                    if (!hasOtherConnections) {
                        socket.to(roomId).emit(ACTIONS.DISCONNECTED, { socketId: socket.id, username });
                        if (roomUsers[roomId]) {
                            roomUsers[roomId].delete(username);
                            if (roomUsers[roomId].size === 0) {
                                delete roomUsers[roomId];
                                delete roomCodeMap[roomId];
                                delete roomMessages[roomId];
                            }
                        }
                    }
                }
            });
            delete userSocketMap[socket.id];
        });
    });

    return io;
}

module.exports = { initializeSocket };
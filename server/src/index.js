const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
const PORT = process.env.PORT || 8080;
app.get('/', (req, res) => {
        res.send('Hello World');
});

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    // Handle offer from a client
    socket.on('offer', (data) => {
        console.log('Offer received from:', socket.id);
        socket.broadcast.emit('offer', data);
    });

    // Handle answer from a client
    socket.on('answer', (data) => {
        console.log('Answer received from:', socket.id);
        socket.broadcast.emit('answer', data);
    });

    // Handle ICE candidates from a client
    socket.on('candidate', (data) => {
        console.log('Candidate received from:', socket.id);
        socket.broadcast.emit('candidate', data);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

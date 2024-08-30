const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const {
    OFFER_SIGNAL,
    ANSWER_SIGNAL,
    CONSOLE_FORMAT_CLIENT2SERVER,
    CONSOLE_FORMAT_SERVER2CLIENT,
} = require('../../common/src/constances/webRTCKeyConstances');

app.use(cors());
const PORT = process.env.PORT || 8080;
app.get('/', (req, res) => {
        res.send('Hello World');
});

// Connection Event: https://socket.io/docs/v4/emitting-events/#basic-emit
io.on("connection", (socket) => {
    console.log(CONSOLE_FORMAT_CLIENT2SERVER, "a user connected", socket.id);
    // https://socket.io/docs/v4/tutorial/step-3
    socket.on("disconnect", () => {
        console.log(CONSOLE_FORMAT_CLIENT2SERVER, "a user disconnected", socket.id);
    });

    socket.emit("me", socket.id);

    // TODO: Use event handlers to handle the events (https://socket.io/docs/v4/server-application-structure/#each-file-registers-its-own-event-handlers)
    socket.on(OFFER_SIGNAL, ({ sourceSocketId, targetSocketId, data }) => {
        console.log(CONSOLE_FORMAT_CLIENT2SERVER, "receiveOfferSignal, sourceSocketId: ", sourceSocketId, " targetSocketId: ", targetSocketId);
        // console.log(CONSOLE_FORMAT_CLIENT2SERVER, "receiveOfferSignal, data: ", data);

        io.to(targetSocketId).emit(OFFER_SIGNAL, { sourceSocketId, data });
        console.log(CONSOLE_FORMAT_SERVER2CLIENT, "sendOfferSignal, sourceSocketId: ", sourceSocketId);
        // console.log(CONSOLE_FORMAT_SERVER2CLIENT, "sendOfferSignal, data: ", data);
    });

    socket.on(ANSWER_SIGNAL, ({ sourceSocketId, targetSocketId, data }) => {
        console.log(CONSOLE_FORMAT_CLIENT2SERVER, "receiveAnswerSignal, sourceSocketId: ", sourceSocketId, " targetSocketId: ", targetSocketId);
        // console.log(CONSOLE_FORMAT_CLIENT2SERVER, "receiveAnswerSignal, data: ", data);

        io.to(targetSocketId).emit(ANSWER_SIGNAL, { targetSocketId, data });
        console.log(CONSOLE_FORMAT_SERVER2CLIENT, "sendAnswerSignal, sourceSocketId: ", sourceSocketId);
        // console.log(CONSOLE_FORMAT_SERVER2CLIENT, "sendAnswerSignal, data: ", data);
    });

    socket.on('chat', ({msg, sender, receiver}) => {
        console.log(CONSOLE_FORMAT_CLIENT2SERVER, 'chat', {msg, sender, receiver});
        io.emit('chat', {msg, sender, receiver});
    });
});
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

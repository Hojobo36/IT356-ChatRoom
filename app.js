const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const messagesFile = './messages.json';

const loadMessages = () => {
    try {
        return JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
    } catch (err) {
        return [];
    }
};

const saveMessages = (messages) => {
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
};

let users = loadMessages();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.render("home", { data: users });
});

app.post("/", (req, res) => {
    const inputUserName = req.body.userName;
    const inputUserMessage = req.body.userMessage;

    const newMessage = { userName: inputUserName, userMessage: inputUserMessage };
    users.push(newMessage);
    saveMessages(users);

    // Emit the new message to all connected clients
    io.emit('newMessage', newMessage);

    res.redirect("/"); // After posting the message, redirect to the home page
});

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log("App is running on port 3000");
});

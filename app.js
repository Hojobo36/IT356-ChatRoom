const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Path to the messages JSON file
const messagesFilePath = path.join(__dirname, 'messages.json');

// Function to read the messages from the JSON file
function getMessages() {
    if (fs.existsSync(messagesFilePath)) {
        const data = fs.readFileSync(messagesFilePath, 'utf8');
        return JSON.parse(data);
    }
    return []; // Return an empty array if no file exists
}

// Function to save the messages to the JSON file
function saveMessages(messages) {
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
}

// Render home page with stored messages
app.get("/", function (req, res) {
    const users = getMessages();
    res.render("home", { data: users });
});

// Handle new message submissions
app.post("/", (req, res) => {
    const inputUserName = req.body.userName;
    const inputUserMessage = req.body.userMessage;

    const users = getMessages();
    users.push({
        userName: inputUserName,
        userMessage: inputUserMessage,
    });

    saveMessages(users);

    // Redirect to avoid resubmission of the form on refresh
    res.redirect("/");
});

app.listen(3000, (req, res) => {
    console.log("App is running on port 3000");
});

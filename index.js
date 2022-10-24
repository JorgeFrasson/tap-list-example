const express = require('express');
const app = express();
const port = 3030;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/connect/", function(req, res) {
    res.send(JSON.stringify({action: "connect filho da puta"}));
});

app.get("/disconnect/", function(req, res) {
    res.send(JSON.stringify({action: "disconnect"}));
});

io.on('connection', (socket) => {
    console.log("User connected", socket);
    socket.on('action', (msg) => {
            socket.send(JSON.stringify({
                action: msg
            }));
    });
})

app.use(express.static(__dirname + "/static"));

// start the server listening for requests
app.listen(process.env.PORT || port, 
	() => console.log("Server is running..."));

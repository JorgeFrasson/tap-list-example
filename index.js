const express = require('express');
const app = express();
const port = 3030;
const bodyParser = require('body-parser')

let connections = [];

let API_URL_WSS = 'https://8ffxu1gb54.execute-api.us-east-1.amazonaws.com/dev/@connections'

app.use(bodyParser.json());

app.post("/connect", function(req, res){
    const connectionId = req.body.connectionId;
    connections.push(connectionId);
    console.log("O user: " + connectionId + " se conectou a sala de chat");
    res.sendStatus(200);
});

app.get("/disconnect", function (req, res){
    console.log("/disconnect endpoint is invoked");
    res.sendStatus(200);
});

app.post("/sendmessage", function(req, res){
    for(let i = 0; i < connections.length; i ++){
        console.log("O usuário " + connections[i] + " está conectado!");
    }
    res.send(req.body.message);
});

app.post("/send", function(req, res){
    console.log(req.headers);
    console.log(req.query);
    console.log(req.body);
    res.send(req.body.payload.message);
});

app.get("/", function(req, res){
    console.log("Tô aqui buceta de dragão");
    res.send(JSON.stringify(req.body));
});

// start the server listening for requests
app.listen(process.env.PORT || port, 
	() => console.log("Server is running..."));

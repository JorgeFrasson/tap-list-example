const express = require('express');
const app = express();
const port = 3030;
const bodyParser = require('body-parser')

let connections = [];

app.use(bodyParser.json());

app.get("/connect", function(req, res){
    console.log("/connect endpoint is invoked");
    console.log(req.headers);
    res.sendStatus(200);
});

app.get("/disconnect", function (req, res){
    console.log("/disconnect endpoint is invoked");
    res.sendStatus(200);
});

app.post("/sendmessage", function(req, res){
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

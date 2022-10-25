const express = require('express');
const app = express();
const port = 3030;
const bodyParser = require('body-parser')

app.use(bodyParser.json());

app.get("/connect", function(req, res){
    console.log("/connect endpoint is invoked");
    res.sendStatus(200);
});

app.get("/disconnect", function (req, res){
    console.log("/disconnect endpoint is invoked");
    res.sendStatus(200);
});

app.post("/sendmessage", function(req, res){
    const msg = JSON.parse(req.body.message);
    res.send(JSON.stringify({"messageFromServer": msg}));
});

app.post("/send", function(req, res){
    console.log(req.body);
    console.log(req.query);
    console.log(req.headers);
    res.send(JSON.stringify({message: "hello from sendmessage route"}));
});

app.get("/", function(req, res){
    console.log("Tô aqui buceta de dragão");
    res.send(JSON.stringify(req.body));
});

// start the server listening for requests
app.listen(process.env.PORT || port, 
	() => console.log("Server is running..."));

const express = require('express');
const app = express();
const port = 3030;
const bodyParser = require('body-parser')
const axios = require('axios');
const aws4 = require('aws4')

let connections = [];
let API_URL_WSS = 'https://8ffxu1gb54.execute-api.us-east-1.amazonaws.com/dev/@connections'

app.use(bodyParser.json());

app.post("/connect", function(req, res){
    const connectionId = req.body.connectionId;
    connections.push(connectionId);
    console.log("O user: " + connectionId + " se conectou a sala de chat");
    res.sendStatus(200);
});

app.post("/disconnect", async (req, res) => {
    const connectionId = req.body.connectionId;
    console.log("o usuario " + connectionId + " desconectou");
    connections.splice(connections.indexOf(connectionId), 1);
    res.sendStatus(200);
});

app.post("/sendmessage", async (req, res) => {
    console.log("s,kdvsjmldvsdjnvsdjnv");
    const connectionId = req.body.connectionId;
    
    for(let i = 0; i < connections.length; i ++){
        let request = {
            method: 'POST',
            url: API_URL_WSS + "/" + connections[i],
            body: req.body.msg
        }
    
        let signedRequest = aws4.sign(request,{
            secretAccessKey: "G1kD45/8rcfZ0zVi23tq+f+bE12aojOCu9uB6cir",
            accessKeyId: "AKIA23GEF46NXMHWM3VW"
        })
    
        delete signedRequest.headers['Host']
        delete signedRequest.headers['Content-Length']

        let response = await axios(signedRequest);
        console.log(response);

    }
    res.send("Mensagem recebida de " + req.body.connectionId);
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

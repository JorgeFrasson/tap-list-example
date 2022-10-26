const express = require('express');
const app = express();
const port = 3030;
const bodyParser = require('body-parser')
const axios = require('axios');

let connections = [];
let API_URL_WSS = 'https://8ffxu1gb54.execute-api.us-east-1.amazonaws.com/dev/@connections'

app.use(bodyParser.json());

app.post("/connect", function(req, res){
    const connectionId = req.body.connectionId;
    connections.push(connectionId);
    console.log("O user: " + connectionId + " se conectou a sala de chat");
    res.sendStatus(200);
});

app.post("/disconnect", function (req, res){
    const connectionId = req.body.connectionId;
    console.log("o usuario " + connectionId + " desconectou");
    connections.splice(connections.indexOf(connectionId), 1);
    res.sendStatus(200);
});

app.post("/sendmessage", function(req, res){
    console.log("s,kdvsjmldvsdjnvsdjnv");
    
    const connectionId = req.body.connectionId;
    const HEADER = {
        headers: {
            Accept: 'application/json',
            Authorization:"AWS4-HMAC-SHA256 Credential=AKIA23GEF46NXMHWM3VW/20221025/us-east-1/execute-api/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=1099985bc4a3080125583daf04250e0d829a034f2428bc0c1abef5052bb2db9e",
            "x-amz-date": "20160726T033659Z"
        }
    }

    axios
        .post(API_URL_WSS + "/" + connectionId, req.body.payload.message, HEADER)
        .then((response) => {
            if(response.status === 201){
                console.log(response.data);
                console.log(response.headers);
            }
        })
        .catch((e) => {
            console.log(e);
        })
    for(let i = 0; i < connections.length; i ++){
        console.log("O usuário " + connections[i] + " está conectado!");
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

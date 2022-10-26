const express = require('express');
const app = express();
const port = 3030;
const bodyParser = require('body-parser')
const axios = require('axios');
const aws4 = require('aws4');
const AWS = require('aws-sdk');

AWS.config.loadFromPath('./credentials.json');

let connections = [];

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
    const region = req.body.region;
    const domainName = req.body.domainName;
    const stage = req.body.stage;
    const postData = req.body.payload.message; 

    const apiEndpoint = domainName + '/' + stage;
    
    console.log("connectionId: ", connectionId);
    console.log("region: ", region);
    console.log("apiEndpoint: ", apiEndpoint);
    console.log("Data ", postData);

    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: 'v2',
        region: region,
        endpoint: apiEndpoint
    });

    for(let i = 0; i < connections.length; i ++){
        try {
            await apigwManagementApi.postToConnection({ 
                ConnectionId: connections[i],
                Data: postData
            }).promise()
        } catch (e) {
            console.log('Não foi possível enviar a mensagem devido a: ', e);
        }
    }
    res.send("Mensagem recebida de " + connectionId);
});

app.post("/sendtap", async (req, res)=> {
    const connectionId = req.body.connectionId;
    const region = req.body.region;
    const domainName = req.body.domainName;
    const stage = req.body.stage;
    const postData = JSON.stringify(req.body.payload.tap); 

    const apiEndpoint = domainName + '/' + stage;
    
    console.log("connectionId: ", connectionId);
    console.log("region: ", region);
    console.log("apiEndpoint: ", apiEndpoint);
    console.log("Data ", postData);

    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: 'v2',
        region: region,
        endpoint: apiEndpoint
    });

    for(let i = 0; i < connections.length; i ++){
        try {
            await apigwManagementApi.postToConnection({ 
                ConnectionId: connections[i],
                Data: postData
            }).promise()
        } catch (e) {
            console.log('Não foi possível enviar a mensagem devido a: ', e);
        }
    }
    res.send("Mensagem recebida de " + connectionId);
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

const express = require('express');
const app = express();
const port = 3030;
const bodyParser = require('body-parser')
const axios = require('axios');
const aws4 = require('aws4');
const AWS = require('aws-sdk');
const { TokenFileWebIdentityCredentials } = require('aws-sdk');

AWS.config.loadFromPath('./credentials.json');

let connections = [];
let devices = [];
let activeTokens = [];
let tapListByToken = [];

function getTaplistByDevice(device){
    if(activeTokens.indexOf(device.token) === -1){
        return
    }

    tapListByToken.forEach(tapList => {
        if(tapList.token === token){
            return tapList;
        }
    });
}

app.use(bodyParser.json());

app.post("/ping", function(req, res){
    const connectionId = req.body.connectionId;
    const token = req.body.payload.token;
    const deviceId = req.body.paylad.deviceId; 
    
    connections.push(connectionId);
    activeTtokens.push(token);
    devices.push(deviceId);

    console.log("O dispositivo: ", deviceId);
    console.log("ConnectionId: ", connectionId);
    console.log("Token: ", token);
    
    res.sendStatus(200);
});

app.post("/connect", function(req, res){
    res.sendStatus(200);
});

app.post("/disconnect", async (req, res) => {
    const connectionId = req.body.connectionId;
    const token = req.body.payload.token;

    console.log("o usuario " + connectionId + " desconectou");
    
    connections.splice(connections.indexOf(connectionId), 1);
    activeTokens.splice(activeTokens.indexOf(token), 1);
    res.sendStatus(200);
});


app.post("/sendtaplist", async (req, res)=> {
    const connectionId = req.body.connectionId;
    const device = req.body.deviceId;
    const region = req.body.region;
    const domainName = req.body.domainName;
    const stage = req.body.stage;
    
    tapList = getTaplistByDevice(JSON.parse(device));
    
    const postData = JSON.stringify(tapList); 
    const apiEndpoint = domainName + '/' + stage;
    
    console.log("connectionId: ", connectionId);
    console.log("region: ", region);
    console.log("apiEndpoint: ", apiEndpoint); 
    console.log("Data ", tapList);

    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: 'v2',
        region: region,
        endpoint: apiEndpoint
    });

    try {
        await apigwManagementApi.postToConnection({ 
            ConnectionId: connectionId,
            Data: postData
        }).promise()
    } catch (e) {
        console.log('Não foi possível enviar a mensagem devido a: ', e);
    }
    res.send("Mensagem recebida de " + connectionId);
});

app.post("/", function(req, res){
    console.log("Tô aqui buceta de dragão");
    res.send(JSON.stringify(req.body));
});

// start the server listening for requests
app.listen(process.env.PORT || port, 
	() => console.log("Server is running..."));



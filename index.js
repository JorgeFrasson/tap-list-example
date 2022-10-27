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

function getDeviceById(deviceId){
    let device = {};

    devices.forEach(item => {
        console.log("Tô aqui piranha!!");
        console.log(deviceId.toString());
        console.log(item);
        console.log(item['id']);
        if(item['id'] == deviceId.toString()){
            device = item;
        }
    });

    return device;

}

function getTokenByDevice(device){
    if(activeTokens.indexOf(device.token) === -1){
        return true
    }
}

app.use(bodyParser.json());

app.post("/ping", function(req, res){
    const connectionId = req.body.connectionId;
    const token = req.body.payload.token;
    const deviceId = req.body.payload.deviceId; 
    let deviceCount = -1;
    let device = {
        id: deviceId,
        connectionId: connectionId,
        token: token,
    }

    devices.forEach(item => {
        if(item['id'] == deviceId){
            deviceCount+= 1;
        } 
    });

    if(deviceCount == -1){
        connections.push(connectionId);
        activeTokens.push(token);
        devices.push(device);
    }

    console.log("O dispositivo:", deviceId);
    console.log("ConnectionId:", connectionId);
    console.log("Token:", token);

    console.log(devices);
    res.sendStatus(200);
});

app.post("/connect", function(req, res){
    res.sendStatus(200);
});

app.post("/disconnect", async (req, res) => {
    const connectionId = req.body.connectionId;
    console.log("o usuario " + connectionId + " desconectou");
    connections.splice(connections.indexOf(connectionId), 1);
    res.sendStatus(200);
});


app.post("/sendtaplist", async (req, res)=> {
    const connectionId = req.body.connectionId;
    const deviceId = req.body.payload.deviceId;
    const region = req.body.region;
    const domainName = req.body.domainName;
    const stage = req.body.stage;
    const tapList = req.body.payload.taplist;
    
    const device = getDeviceById(deviceId);
    
    const postData = JSON.stringify(tapList); 
    const apiEndpoint = domainName + '/' + stage;

    console.log("connectionId: ", device['connectionId']);
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
            ConnectionId: device['connectionId'],
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



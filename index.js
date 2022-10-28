const express = require('express');
const app = express();
const port = 3030;const bodyParser = require('body-parser')

const AWS = require('aws-sdk');

AWS.config.loadFromPath('./credentials.json');

let connections = [];
let devices = [];
let activeTokens = [];
let tokenHasConnection = [];

function insertToken(){
    let token = generateToken();

    while(activeTokens.indexOf(token) > -1){
        token = generateToken();
    }

    activeTokens.push(token);
    return token
}

function generateToken(){
    let token = "";
    for(let i = 0; i < 6; i++){
        token = token + String(Math.floor(Math.random() * 10));
    }
    return token; 
}

function getDeviceById(deviceId){
    let device = {};
    devices.forEach(item => {
        if(item['deviceId'] == deviceId.toString()){
            device = item;
        }
    });
    return device;
}

function validateToken(token){
    if(activeTokens.indexOf(token) > -1){
        return true;
    }
    return false;
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
    let deviceCount = -1;
    let device = {
        connectionId: connectionId,
        token: token,
    }

    devices.forEach(item => {
        if(activeTokens.indexOf(token) == item.token){
            deviceCount += 1;
        } 
    });

    if(deviceCount == -1){
        connections.push(connectionId);
        activeTokens.push(token);
        devices.push(device);
    }
    
    console.log(devices);
    console.log("ConnectionId:", connectionId);
    console.log("Token:", token);

    console.log(devices);
    res.sendStatus(200);
});

app.post("/get-token", async (req, res) => {
    const token = insertToken();
    const connectionId = req.body.connectionId;
    const region = req.body.region;
    const domainName = req.body.domainName;
    const stage = req.body.stage;
    const apiEndpoint = domainName + '/' + stage;

    console.log("connectionId: ", connectionId);
    console.log("region: ", region);
    console.log("apiEndpoint: ", apiEndpoint); 
    console.log("Data ", token);

    let device = {
        "deviceId": connectionId,
        "token": token,
        "connectionId": ""
    };

    devices.push(device);

    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: 'v2',
        region: region,
        endpoint: apiEndpoint
    });

    try {
        await apigwManagementApi.postToConnection({ 
            ConnectionId: connectionId,
            Data: JSON.stringify({"token": token})
        }).promise()
    } catch (e) {
        console.log('Não foi possível enviar a mensagem devido a: ', e);
    }

    tokenHasConnection.push({"deviceId": connectionId, "token": token});

    res.send("Token enviado para" + connectionId);
});

app.post("/connect", async (req, res) => {
    res.sendStatus(200);
});

app.post("/disconnect", async (req, res) => {
    const connectionId = req.body.connectionId;
    console.log("o usuario " + connectionId + " desconectou");
    if (connections.indexOf(connectionId) > -1) {
        connections.splice(connections.indexOf(connectionId), 1);
    }
    res.sendStatus(200);
});


app.post("/sendtaplist", async (req, res)=> {
    const deviceId = req.body.payload.deviceId;
    const region = req.body.region;
    const domainName = req.body.domainName;
    const stage = req.body.stage;
    const tapList = req.body.payload.taplist;
    const postData = JSON.stringify(tapList); 
    const apiEndpoint = domainName + '/' + stage;


    console.log("connectionId: ", deviceId);
    console.log("region: ", region);
    console.log("apiEndpoint: ", apiEndpoint); 
    console.log("Data ", tapList);

    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: 'v2',
        region: region,
        endpoint: apiEndpoint
    });

    console.log("Torneiras enviadas a tela de conexão", deviceId);

    try {
        await apigwManagementApi.postToConnection({ 
            ConnectionId: device['connectionId'],
            Data: postData
        }).promise()
    } catch (e) {
        console.log('Não foi possível enviar a mensagem devido a: ', e);
    }

    res.send("Taplist enviada a" + device['connectionId']);
});

app.post("/validate-token", async (req, res) => {
    const token = req.body.payload.token;
    const connectionId = req.body.connectionId; 
    const region = req.body.region;
    const domainName = req.body.domainName;
    const stage = req.body.stage;
    const tokenStatus = "valid";
    let deviceId = "";
    if(!validateToken(token)){
        res.send("Token inválido tente novamente!");
        return
    }
    
    devices.forEach((device) => {
        if(token === device.token){
            device.connectionId = connectionId;
            deviceId = device.deviceId;
        }
    });

    const postData = JSON.stringify({
        deviceId: deviceId,
        tokenStatus: tokenStatus
    });
    const apiEndpoint = domainName + '/' + stage;
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: 'v2',
        region: region,
        endpoint: apiEndpoint
    });

    try {
        await apigwManagementApi.postToConnection({ 
            ConnectionId: deviceId,
            Data: postData
        }).promise()
    } catch (e) {
        console.log('Não foi possível enviar a mensagem devido a: ', e);
    }

    res.send("Token validado");
})

app.post("/", function(req, res){
    console.log("Tô aqui buceta de dragão");
    res.send(JSON.stringify(req.body));
});

// start the server listening for requests
app.listen(process.env.PORT || port, 
	() => console.log("Server is running..."));



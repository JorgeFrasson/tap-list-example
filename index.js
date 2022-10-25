const express = require('express');
const app = express();
const port = 3030;

app.use(bodyParser.json());

app.get("/connect", async (req, res) => {
    console.log("/connect endpoint is invoked");
    res.sendStatus(200);
});

app.get("/disconnect", async (req, res) => {
    console.log("/disconnect endpoint is invoked");
    res.sendStatus(200);
});

app.get("/sendtap", async (req, res) => {
    res.send(JSON.stringify({message: "hello from sendtap route"}));
});

app.post("/send", async (req, res)=> {
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

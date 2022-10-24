const express = require('express');
const app = express();
const port = 3030;

app.get("/connect/", function(req, res) {
    res.send(JSON.stringify({conectou: "filho da puta"}));
});

app.get("/disconnect/", function(req, res) {
    res.send(JSON.stringify({desconectou: "filho da puta"}));
});

app.use(express.static(__dirname + "/static"));

// start the server listening for requests
app.listen(process.env.PORT || port, 
	() => console.log("Server is running..."));

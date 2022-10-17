const express = require('express');
const app = express();
const port = 3030;

app.get("/", function(req, res) {
    res.sendFile("index.html", {root: __dirname});
});

app.use(express.static(__dirname + "/static"));

// start the server listening for requests
app.listen(process.env.PORT || port, 
	() => console.log("Server is running..."));

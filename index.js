const express = require('express');
const app = express();
const port = 3030;

app.get('/', function(req, res) {
    res.sendFile('index.html', {root: __dirname});
});

app.use(express.static(__dirname + '/static'));

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});

// Library
var express = require('express');

const app = express();

app.use(express.static(__dirname + '/dist/'));

var port = process.env.PORT || 8100

app.listen(port, function() {
    console.log('Server listens on port ' + port + '.');
})
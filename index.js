// Library
var express = require('express');

const app = express();

app.get('*.js', function (req, res, next) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    next();
});

app.use(express.static(__dirname + '/dist/'));


var port = process.env.PORT || 8080

app.listen(port, function() {
    console.log('Server listens on port ' + port + '.');
})
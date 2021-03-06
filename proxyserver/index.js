//express proxy and static files -server for WMS viewer
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var _open = require('open');


var app = express();
app.use('/', express.static("./"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({
  type: 'application/json'
}));
app.post('/proxy', function(req, res) {
  var proxyUrl = req.body.proxy;
  request.get({
    //timeout: 1000,
    rejectUnauthorized: false,
    url: proxyUrl
  }, function(error, response, body) {
    if (error) {
      return console.error('proxy failed:', error);
    }
    if (response.headers['content-type'].lastIndexOf('text/html') >= 0) {
      res.status(406).json({
        error: 'The requested resource is only capable of generating content not acceptable according to the Accept headers sent in the request'
      });
    } else {
      res.set('Content-Type', response.headers['content-type']);
      res.send(body);
    }
  });
});


var server = {};
server.start = function(port){
  var port = port || 9005;
  var _server = app.listen(port, function() {
    var host = _server.address().address;
    var port = _server.address().port;
    console.log('proxy server for wms-app listening at http://%s:%s', host, port);
  });
}



//_open("http://localhost:" + port + "/src/index.html#/wms", "firefox");


module.exports = server;

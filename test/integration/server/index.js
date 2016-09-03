const 
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    auth = require('./../../../index')
;

module.exports =  (port, errorCallback) => {

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(auth({
        name : 'secret',
        secret: 'this-is-some-secret-value'
    }, errorCallback));

    let server = app.listen(port, () => {
        console.log(`Started web server on port: ${port}`);
    });

    return server;
}

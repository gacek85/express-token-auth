# Static token authorization

This method takes **request body** and looks for a `token` property. Then compares it with the token provided in the *configuration*.

## Setup

``` js
const 
	express = require('express'),
    parser = require('body-parser'),
    auth = require('token-auth'),
    app = express()
;

function handleUnauthorized (res, errors, next)
{
	res.writeHead(401); // Unauthorized
    res.write(JSON.stringify({
        errors : errors
    }));
    res.send();
}

app.use(parser.urlEncoded({
	extended: true
});

app.use(auth({
	name : 'token',
    token: 'this-is-some-token-value'
}, handleUnauthorized));

// ... //
```


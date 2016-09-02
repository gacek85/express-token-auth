# Dynamic token authorization

This method takes **request body** and looks for a `token` and `seed` properties. Then
calculates a `secret` from configuration and calculates a server-side token from the `seed` and
the `secret`. Finaly compares it with the token provided by the request.
That requires calculating a token on the client side, but provides more secure procedure.

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
	name : 'secret',
    secret: 'this-is-some-secret-value'
}, handleUnauthorized));

// ... //
```

## Client implementations

### PHP

``` php
<?php

function generateRandomSeed ($length = 10): string
{
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    $charactersLength = mb_strlen($characters);
    $randomStringArr = [];
    for ($i = 0; $i < $length; $i++) {
        $randomStringArr[] = $characters[mt_rand(0, $charactersLength - 1)];
    }
    return join('', $randomStringArr);
}

$secret = "this-is-some-secret-value";     // Same secret as in the config file
$seed = generateRandomSeed();  // Eg. method that generates random string
$token = sha1(implode("|", array(
    $secret,
    $seed
)));
```

``` js
function generateRandomSeed (len = 10)
{
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    function doGenerateRandom (len, buffer)
    {
        return !len ? buffer.join('') : (() => {
            return doGenerateRandom(len - 1, buffer.concat(
                 possible.charAt(Math.floor(Math.random() * possible.length))
            ));
        })();
    }

    return doGenerateRandom(len, []);
}

const
    secret = `this-is-some-secret-value`,
    seed = generateRandomSeed(),
    token = ((input) => {
        return require('crypto')
                .createHash('sha1')
                .update(input, 'utf8')
                .digest('hex')
        ;
    })([secret, seed].join('|'))
;

```


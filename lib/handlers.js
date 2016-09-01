const 
    crypto              =   require('crypto'),
    authErrorFactory    =   require('./error.js'),
    _                   =   require('lodash')
;

/**
 * Generates/recreates hash for given secret and seed
 * 
 * @param       {String}    secret
 * @param       {String}    seed
 * @returns     {String}
 */
function generateHash (secret, seed)
{
    const shasum = crypto.createHash('sha1');
    shasum.update(`${secret}|${seed}`, 'utf8');
    
    return shasum.digest('hex');
}

class Secret 
{

    /**
     * Secret based handler
     * 
     * @constructor         Creates a secret handler 
     */
    constructor ({secret}) {
        this.secret = secret;
    }

    /**
     * Validates the request
     * 
     * @param       {Object}          req
     * @returns     {undefined}
     */
    validate (req)
    {
        if (generateHash(this.secret, req.body.seed) !== req.body.token) {
            throw authErrorFactory("Invalid token", [
                "Provided token is invalid"
            ]);
        }
    }
}


class Token 
{
    constructor ({token}) {
        this.token = token;
    }

    /**
     * Validates the request
     * 
     * @param       {Object}          req
     * @returns     {undefined}
     */
    validate (req)
    {     
        if (this.token !== req.body.token) {
            throw authErrorFactory("Invalid token", [
                "Provided token is invalid"
            ]);
        }
    }
}


/**
 * Contains handlers for auth checking
 */
const handlers = {
    secret : Secret,
    token : Token
};


/**
 * Applies proper handler given with handler name
 * 
 * @param {Auth} auth
 * @param {String} handlerName
 * @param {Object} config
 */
module.exports = function (auth, config = {name}) 
{
   if (!handlers[config.name]) {
       throw new Error(`Handler with name ${config.name} does not exist!`);
   }

   auth
        .resetHandlers()
        .addHandler(new handlers[config.name](config))
    ;
};
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


function findHandler (config)
{
    let resultHandler;
    _.each(handlers, (handler) => {
        if (handler.canHandle(config)) {
            resultHandler = handler;
            return false;
        }
        return true;
    });
    return resultHandler;
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

/**
  * Checks if this handler can handle given config
  * 
  * @return {boolean}
  */
Secret.canHandle = ({secret = false}) => {
    return !!secret;
};


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
  * Checks if this handler can handle given config
  * 
  * @return {boolean} 
  */
Token.canHandle =  ({token = false}) => {
    return !!token;
};


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
module.exports = function (auth, config) 
{
    let handler;
    const name = config.name;
    if (!!name && handlers[name]) {
        handler = handlers[name];
    } else {
        handler = findHandler(config, handlers);
    }

    handler && auth
        .resetHandlers()
        .addHandler(new handler(config))
    ;

    if (!handler) {
        throw new Error(`Handler for given configuration does not exist!`);
    }
};
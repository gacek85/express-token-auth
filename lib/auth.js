const _ = require('lodash');

/**
 * Validates registered handler
 * 
 * @param       {Object}        handler
 * @returns     {Object}        The same given handler object
 * @throws      {TypeError}     If the handler does not implement 'validate' method
 */
function validateHandler (handler)
{
    if (typeof handler.validate !== 'function') {
        throw new TypeError('The validator must implement method validate!');
    }
    
    return handler;
}


class Auth {
    
    /**
     * Constructs the object
     */
    constructor () 
    {
        this.handlers = [];
        this.errors = null;
    }

    /**
     * Returns the errors array or null
     * 
     * @retturn {Array}
     */
    getErrors ()
    {
        return this.errors;
    }


    /**
     * Registers auth handler 
     * 
     * @param   {Object}    A handler for checking if given request is valid
     */
    addHandler (handler)
    {
        this.handlers.push(validateHandler(handler));
        return this;
    }
    
    
    /**
     * Clears all the handlers
     * 
     * @return  {Auth}      This instance
     */
    resetHandlers ()
    {
        this.handlers = [];
        return this;
    }
    
    
    /**
     * Validates if given request can be processed. If errors
     * occur, modifies the request setting errors property
     * - an array of errors.
     * 
     * @param   {Object}    req
     * @returns {Boolean}
     */
    hasAccess  (req)
    {
        let hasAccess = true;
        _.each(this.handlers, (handler) => {
            try {
                handler.validate(req);
            } catch (err) {
                if (err.constructor.name !== 'AuthError') {
                    throw err;
                }
                hasAccess = false;
                this.errors = err.getErrors()
            }
        });

        return hasAccess;
    }
    
    
    /**
     * Returns an array of reasons why the request was denied taken from the 
     * request
     * 
     * @param       {Object}        The request object
     * @returns     {Array}
     */
    getErrors (req)
    {
        return req.errors || [];
    }
};

module.exports.Auth = Auth;
module.exports.default = new Auth();
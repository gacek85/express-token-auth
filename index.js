const 
    auth                =   require('./lib/auth.js'),
    applyHandler        =   require('./lib/handlers.js')
;

/**
 * 
 * @param   {Object}    config      Config object containing the name of the 
 *                                  handler under `name` property and configuration
 * 
 * @param   {Function}  errorCb     Error callback, if no access granted. Takes 3 params:
 *                                  the response, the errors array and the `next` callback.
 * 
 * @returns {Function}              The middleware function
 */
exports = (config, errorCb) => {
   
    // Register handlers in the auth object
    applyHandler(auth.default, config);
    
    return (req, res, next) => {
        if (auth.default.hasAccess(req)) {
            next();
        } else {
            errorCb(res, auth.default.getErrors(), next);
        }
    };
};
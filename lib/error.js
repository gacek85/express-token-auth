/**
 * Auth error used to gather error messages for authorization
 * 
 * @author      Maciej Garycki <maciekgarycki@gmail.com>
 */
class AuthError extends Error
{
    /**
     * 
     * @param       {String}        message         The reason of the error
     * @param       {Array}         errors          The error strings
     * @constructor
    */
    constructor (message, errors) {
        super(message);
        this.message = message;
        this.errors = errors;
    }

    /**
     * Returns the error objects provided by the error thrown
     * 
     * @return      {Array}         An array of Objects
     */
    getErrors ()
    {
        return this.errors;
    }

    /**
     * Returns the message
     * 
     * @return      {String}  
     */
    getMessage ()
    {
        return this.message;
    }
}


/**
 * Creates new error instance
 *  
 * @param       {String}        message
 * @param       {Array}         errors
 * @returns     {AuthError}
 */
module.exports = (message, errors) => {
    return new AuthError(message, errors);
};
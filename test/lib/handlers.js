
const 
    expect              = require('chai').expect,
    authErrorFactory    = require('./../../lib/error.js'),
    auth                = require('./../../lib/auth.js'),
    applyHandler        = require('./../../lib/handlers.js'),
    crypto              = require('crypto')
;
    
    

/**
 * Generates random string of given length
 * 
 * @param       {Number}    len     Integer number of generated string length
 * @returns     {String}            The random string
 */
function generateRandom (len = 10)
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


/**
 * Generates data object containing seed, secret and token properties
 * 
 * @return {Object}
 */
function generateMockData ()
{
    const 
        seed = generateRandom(10),
        secret = generateRandom(20)
    ;
    return {
        seed,
        secret,
        token : ((input) => {
                return crypto
                    .createHash('sha1')
                    .update(input, 'utf8')
                    .digest('hex')
                ;
            })([secret, seed].join('|'))
    };
}

    
describe('lib/handlers', () => {
    
    describe("handlers.secret.validate", () => {
        
        it ("Should allow valid requests containing correctly calculated tokens.", () => {
            const {seed, secret, token} = generateMockData();
            
            applyHandler(auth.default, {
                name : 'secret',
                secret
            });
            
            expect(auth.default.handlers.length).to.equal(1);
            expect(auth.default.hasAccess({
                body : { token, seed }
            })).to.equal(true);
        });

        
        it ("Should ban invalid requests not containing seeds.", () => {
            const {seed, secret, token} = generateMockData();
            
            applyHandler(auth.default, {
                name : 'secret',
                secret
            });
            
            expect(auth.default.handlers.length).to.equal(1);
            expect(auth.default.hasAccess({
                body : { token }
            })).to.equal(false);
        });
        

        it ("Should ban invalid requests containing incorrectly calculated tokens.", () => {
            const {seed, secret, token} = generateMockData();
            
            applyHandler(auth.default, {
                name : 'secret',
                secret
            });
            
            expect(auth.default.handlers.length).to.equal(1);
            expect(auth.default.hasAccess({
                body : { token : "Invalid token value", seed }
            })).to.equal(false);
        });
        
        
        it ("Should ban invalid requests not containing tokens.", () => {
            const {seed, secret, token} = generateMockData();
            
            applyHandler(auth.default, {
                name : 'secret',
                secret
            });
            
            expect(auth.default.handlers.length).to.equal(1);
            expect(auth.default.hasAccess({
                body : { seed }
            })).to.equal(false);
        });
    });
    
    
    
    describe("handlers.token.validate", () => {
        
        it ("Should allow valid requests containing correct, matching tokens.", () => {
            const token = generateRandom(10);
            applyHandler(auth.default, { 
                name : 'token',
                token 
            });
            
            expect(auth.default.handlers.length).to.equal(1);
            expect(auth.default.hasAccess({
                body : { token }
            })).to.equal(true);
        });
        
        it ("Should disallow invalid requests containing incorrect, non-matching tokens.", () => {
            const token = generateRandom(10);
            applyHandler(auth.default, { 
                name : 'token',
                token 
            });
            
            expect(auth.default.handlers.length).to.equal(1);
            expect(auth.default.hasAccess({
                body : { token : generateRandom(11) }
            })).to.equal(false);
        });
    });
});
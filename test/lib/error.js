
const 
    expect              = require('chai').expect,
    authErrorFactory    = require('./../../lib/error.js')
;

describe('lib/error', () => {
    
    describe('error', () => {
        
        const message = "Random message",
            errors = [
                "Some error reason 1", 
                "Some error reason 2"
            ],
            error = authErrorFactory(message, errors);
        
        it ("Should create a new AuthError", () => {
            expect(error.constructor.name).to.be.equal('AuthError');
        });
        
        it ("Should return proper error message", () => {
            expect(error.getMessage()).to.be.equal(message);
        });
        
        it ("Should return proper error reasons", () => {
            expect(error.getErrors()).to.be.a('array');
            expect(error.getErrors()).to.include.members(errors);
        });
    });
    
});
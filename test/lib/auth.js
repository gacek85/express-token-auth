
const 
    expect              = require('chai').expect,
    path                = './../../lib/',
    authErrorFactory    = require('./../../lib/error.js'),
    auth                = require('./../../lib/auth.js'),
    requestMock         = { body : {} }
;
        
    
describe('lib/auth', () => {
    
    describe("Auth.hasAccess", () => {

        it("Should be able to register handlers and call them when asked if access is granted.", () => {
            auth.default.resetHandlers().addHandler({
                validate (req) {
                    expect(req).to.equal(requestMock);
                }
            });
            expect(auth.default.handlers.length).to.equal(1);
            auth.default.hasAccess(requestMock);
        });

        it ("Should return false if registered handler throws an auth error.", () => {
            auth.default.resetHandlers().addHandler({
                validate (req) {
                    throw authErrorFactory("Some Error", ["Some Error Reason"]);
                }
            });
            expect(auth.default.handlers.length).to.equal(1);
            expect(auth.default.hasAccess(requestMock)).to.equal(false);
        });

        it ("Should return true if registered handler doesn't throw an auth error.", () => {
            auth.default.resetHandlers().addHandler({
                validate (req) {
                    // Pretending I'm working...
                }
            });
            expect(auth.default.handlers.length).to.equal(1);
            expect(auth.default.hasAccess(requestMock)).to.equal(true);
        });

        it ("Should throw error if the handler throws any other error than auth error.", () => {
            auth.default.resetHandlers().addHandler({
                validate (req) {
                    throw new Error('Some error');
                }
            });
            expect(auth.default.handlers.length).to.equal(1);
            expect(auth.default.hasAccess).to.throw(Error);
        });
    });
});
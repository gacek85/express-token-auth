const 
    expect = require('chai').expect,
    callback = (res, errors, next) => {
        res.writeHead(401); // Unauthorized
        res.write(JSON.stringify({
            errors
        }));
        res.send();
    },
    port = 9999,
    server = require('./server/index')(port, callback),
    request = require('request')
;
        
describe('Integration', () => {
    
    describe("Express integration", () => {

        it("Should return error callback on non-authed request.", (done) => {
            request.get({
                url : `http://localhost:${port}/`
            }, (err, res, body) => {
                const json = JSON.parse(body);                   
                expect(res.statusCode).to.be.equal(401);
                expect(json.errors).to.include.members(["Provided token is invalid"]);
                done();
            });
        });

    });

    after((done) => {
        server.close(done);
    });

});
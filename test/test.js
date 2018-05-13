const request = require('request-promise').defaults({
    resolveWithFullResponse: true,
    simple: false
});
const pick = require('lodash/pick');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const session = require('supertest-session');

const User = require('../models/users');
const {port, url: url_site} = require('../configs/default');


function getURL(path) {
    return `${url_site}:${port}${path}`;
};

function getCSRFWithSession (dataSession, url, done){
    let url1;
    let url2;
    if(typeof url == 'string'){
        url1 = url;
        url2 = '';
    }else if(typeof url == 'object'){
        url1 = url[0];
        url2 = url[1];
    }
	dataSession.testSession = session(getURL(url1));
   	return dataSession.testSession.get(url2)
      .end(function (err, res) {
        if (err) return new Error(err);
        const dom = new JSDOM(res.text);
      	dataSession.csrf = dom.window.document.querySelector("input[name='_csrf']").value;
        if(done && typeof done == 'function'){
      	     done();
        }
    });
}

describe("User Auth", function(done) {
	 let existingUserData = {
	 	login: 'john',
        email: "john@test.ru",
        password: "12345678"
    };
     let existingVerifiedUserData = {
        login: 'john2',
        email: "john2@test.ru",
        password: "12345678",
        verified: true
    };
    let newUserData = {
        email: "alice@test.ru",
        login: "alice",
        password: "12345678"
    };
    let users = {
        existingUser: null,
        existingVerifiedUser: null
    }
    let testSession = null;

    before(async function(){
        users.existingUser = await User.create(existingUserData);
        return users.existingVerifiedUser = await User.create(existingVerifiedUserData);
    });

    after(async function(){
        await User.remove(pick(existingUserData, ['login', 'email']));
        return await User.remove(pick(existingVerifiedUserData, ['login', 'email']));
    });

    beforeEach(async function() {
        // load fixtures
    });

    afterEach(async function(){
        await User.remove(pick(newUserData, ['login', 'email']));
    });

    context("Check CSRF", require('./csrf')(request, getURL));

    context("POST /register", require('./register')(request, getURL, getCSRFWithSession, newUserData, existingUserData));

    context("POST /login", require('./login')({
        getCSRFWithSession, 
        pick, 
        existingUserData, 
        users, 
        existingVerifiedUserData,
        newUserData
    }) );

    context("User profile", require('./user')({
        getCSRFWithSession,
        existingVerifiedUserData,
        request,
        users, 
        pick,
        getURL,
        User,
        session
    }) );

});
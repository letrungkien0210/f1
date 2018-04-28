const chai = require('chai');
const helper = require('./common').helper;
const promisify = require('es6-promisify');
const properties = require('./common').properties;
const request = require('request')
  .defaults({
    jar: true,
    strictSSL: false
  }); // eslint-disable-line
const sinonChai = require('sinon-chai');
const validate = require('./common').validate;
const rp = require('request-promise');

chai.use(sinonChai);
const expect = chai.expect;

// const get = promisify(request.get, { multiArgs: true });

/**
 * Tests for the Grant Type of Authorization Code.
 * This follows the testing guide roughly from
 * https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/OAuth2orize-Authorization-Server-Tests
 */
describe('Grant Type Authorization Code', () => {
  it('should redirect when trying to get authorization without logging in', () =>
    rp({
      method: 'GET',
      uri: properties.logout,
      jar: true,
      strictSSL: false,
      json: true,
    })
      .then(() => helper.getAuthorization({}))
      .then(res => expect(res.req.path.indexOf('/?code=')).to.eql(-1)));
  
  it('should work with the authorization_code asking for a refresh token', () =>
    helper.login()
      .then(() => {
        return helper.getAuthorization({ scope: 'offline_access' });
      })
      .then(res => {
        expect(res.req.path.indexOf('/?code='))
          .to
          .eql(0);
        const code = res.req.path.slice(7, res.req.path.length);
        validate.authorizationCode(code);
        return code;
      })
      .then(code => helper.postOAuthCode(code))
      .then(res => {
        validate.accessRefreshToken(res, res.body);
        return res.body;
      })
      .then((tokens) => {
        const userInfo = helper.getUserInfo(tokens.access_token)
          .then(res => validate.userJson(res, res.body));
        const refreshToken = helper.postRefeshToken(tokens.refresh_token)
          .then(res => {
            validate.accessToken(res, res.body);
          });
        
        const refreshToken2 = helper.postRefeshToken(tokens.refresh_token)
          .then(res => {
            validate.accessToken(res, res.body);
          });
        return Promise.all([userInfo, refreshToken, refreshToken2]);
      })
      // .catch(error => {
      //   console.error(error);
      // });
  );
  
  it('should give invalid code error when posting code twice', () =>
    helper.login()
      .then(() => helper.getAuthorization({ scope: 'offline_access' }))
      .then(res => {
        expect(res.req.path.indexOf('/?code='))
          .eql(0);
        const code = res.req.path.slice(7, res.req.path.length);
        validate.authorizationCode(code);
        return code;
      })
      .then(code =>
        Promise.all([helper.postOAuthCode(code), helper.postOAuthCode(code)]))
      .then(([res1, res2]) => {
        validate.accessRefreshToken(res1, res1.body);
        validate.invalidCodeError(res2, res2.body);
      }));
  
  it('should work with the authorization_code not asking for a refresh token', () =>
    helper.login()
      .then(() => helper.getAuthorization({}))
      .then((res) => {
        expect(res.req.path.indexOf('/?code='))
          .eql(0);
        const code = res.req.path.slice(7, res.req.path.length);
        validate.authorizationCode(code);
        return code;
      })
      .then(code => helper.postOAuthCode(code))
      .then((res) => {
        validate.accessToken(res, res.body);
        return res.body;
      })
      .then(body => helper.getUserInfo(body.access_token))
      .then((res) => validate.userJson(res, res.body)));
  
  it('should give an error with an invalid client id', () =>
    helper.login()
      .then(() => helper.getAuthorization({ clientId: 'someinvalidclientid' }))
      .then((res) => expect(res.statusCode)
        .to
        .eql(403)));
  
  it('should give an error with a missing client id', () =>
    helper.login()
      .then(() => {
        return rp({
          method: 'GET',
          uri: `${properties.authorization}?redirect_uri=${properties.redirect}&response_type=code`,
          jar: true,
          strictSSL: false,
          json: true,
          transform: function(body, res) {
            return res;
          },
        });
      })
      .then((res) => expect(res.statusCode)
        .to
        .eql(400)));
  
  it('should give an error with an invalid response type', () =>
    helper.login()
      .then(() => helper.getAuthorization({ responseType: 'invalid' }))
      .then((res) => expect(res.statusCode)
        .to
        .eql(501)));
});

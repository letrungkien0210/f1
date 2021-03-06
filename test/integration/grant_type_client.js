const helper = require('./common').helper;
const validate = require('./common').validate;

/**
 * Tests for the Grant Type of Client.
 * This follows the testing guide roughly from
 * https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/OAuth2orize-Authorization-Server-Tests
 */
describe('Grant Type Client', () => {
  it('should work with asking for an access token', () =>
    helper.postOAuthClient({})
      .then(res => {
        validate.accessToken(res, res.body);
        return res.body;
      })
      .then(tokens => {
        return helper.getClientInfo(tokens.access_token);
      })
      .then((res) => {
        return validate.clientJson(res, res.body);
      }));
  
  it('should work with a scope of undefined', () =>
    helper.postOAuthClient(undefined)
      .then(res => {
        validate.accessToken(res, res.body);
        return res.body;
      })
      .then(tokens => helper.getClientInfo(tokens.access_token))
      .then(res => validate.clientJson(res, res.body)));
});

'use strict';

// This is needed to start the server for the tests since these are more integration than unit tests
// require('../../app.js');

const helper   = require('./common').helper;
const validate = require('./common').validate;

/**
 * Tests for the Grant Type of Password.
 * This follows the testing guide roughly from
 * https://github.com/FrankHassanabad/Oauth2orizeRecipes/wiki/OAuth2orize-Authorization-Server-Tests
 */
describe('Grant Type Password', () => {
  it('should work with asking for an access token and refresh token', () =>
    helper.postOAuthPassword('offline_access')
    .then(res => {
      const bodyJson = JSON.parse(res.body);
      validate.accessRefreshToken(res, bodyJson);
      return bodyJson;
    })
    .then((tokens) => {
      const userInfo = helper.getUserInfo(tokens.access_token)
      .then(res => {
        validate.userJson(res, res.body);
      });

      const refreshToken = helper.postRefeshToken(tokens.refresh_token)
      .then(res => validate.accessToken(res, res.body));

      const refreshToken2 = helper.postRefeshToken(tokens.refresh_token)
      .then(res => validate.accessToken(res, res.body));

      return Promise.all([userInfo, refreshToken, refreshToken2]);
    }));

  it('should work just an access token and a scope of undefined', () =>
    helper.postOAuthPassword(undefined)
    .then(res => {
      const bodyJson = JSON.parse(res.body);
      validate.accessToken(res, bodyJson);
      return bodyJson;
    })
    .then(tokens => helper.getUserInfo(tokens.access_token))
    .then(res => validate.userJson(res, res.body)));
});

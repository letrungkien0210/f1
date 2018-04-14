const {
  authorization,
  clientId,
  clientinfo,
  clientSecret,
  login,
  password,
  redirect,
  username,
  userinfo,
  revokeToken,
  token,
  tokenInfo,
} = require('./properties.js');
const rp = require('request-promise');
/**
 * These are all request helpers to help with testing
 */
module.exports = {
  /**
   * Logins as the login dialog/form would
   * @returns {Promise} The login success
   */
  login: () => rp({
    method: 'POST',
    uri: login,
    form: {
      username,
      password,
    },
    jar: true,
    strictSSL: false
  }),
  /**
   * Posts to the OAuth2 Authorization server the code to get the access token
   * @param   {String}  code  - The Authorization code
   * @returns {Promise} The auth code resolved
   */
  postOAuthCode: code =>
    rp({
      method: 'POST',
      uri: token,
      form: {
        code,
        redirect_uri: redirect,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authoriztion_code',
      },
      jar: true,
      strictSSL: false
    }),
  /**
   * Posts to the OAuth2 Authorization server the code to get the access token
   * @param   {String}  scope - The optional scope to use
   * @returns {Promise} OAuthPassword resolved
   */
  postOAuthPassword: (scope) => {
    const basicAuth = new Buffer(`${clientId}:${clientSecret}`).toString('base64');
    return rp({
      method: 'POST',
      uri: token,
      form: {
        username,
        password,
        scope,
        grant_type: 'password',
      },
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
      jar: true,
      strictSSL: false
    });
  },
  /**
   * Posts to the OAuth2 Authorization server the code to get the access token
   * @param   {String}   scope - The optionally scope to use
   * @returns {Promise}  post resolved
   */
  postOAuthClient: (scope) => {
    const basicAuth = new Buffer(`${clientId}:${clientSecret}`).toString('base64');
    return rp({
      method: 'POST',
      uri: token,
      form: {
        username,
        password,
        scope,
        grant_type: 'client_credentials',
      },
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
      jar: true,
      strictSSL: false,
      json: true,
      transform: function(body, res) {
        // res.data = JSON.parse(body);
        return res;
      },
    });
  },
  
  /**
   * Gets a new access token from the OAuth2 authorization server
   * @param   {String}  refreshToken - The refresh token to get the new access token from
   * @returns {Promise} refresh token resolved
   */
  postRefeshToken: (refreshToken) => {
    const basicAuth = new Buffer(`${clientId}:${clientSecret}`).toString('base64');
    return rp({
      method: 'POST',
      uri: token,
      form: {
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      },
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
      jar: true,
      strictSSL: false
    });
  },
  
  /**
   * Gets the authorization code from the OAuth2 authorization server
   * @param {Object} options - Options which if not set will be defaults like so
   * {
   *    authorization: 'https://localhost:3000/dialog/authorize'
   *    redirect: 'https://localhost:3000'
   *    responseType: 'code'
   *    scope: ''
   * }
   * @returns {Promise} authorization resolved
   */
  getAuthorization: (options = {}) => {
    const auth = (options.authorization) || authorization;
    const redirect_uri = (options.redirect) || redirect;    // eslint-disable-line camelcase
    const response_type = (options.responseType) || 'code'; // eslint-disable-line camelcase
    const client_id = (options.clientId) || clientId;       // eslint-disable-line camelcase
    const scope = (options.scope) || '';
    return rp({
      method: 'GET',
      uri: `${auth}?redirect_uri=${redirect_uri}&response_type=${response_type}&client_id=${client_id}&scope=${scope}`, // eslint-disable-line camelcase
      jar: true,
      strictSSL: false
    });
  },
  
  /**
   * Gets the user info from the OAuth2 authorization server
   * @param   {String}  accessToken - The access token to get the user info from
   * @returns {Promise} User Info resolved
   */
  getUserInfo: accessToken =>
    rp({
      method: 'GET',
      uri: userinfo,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      jar: true,
      strictSSL: false
    }),
  /**
   * Gets the client info from the OAuth2 authorization server
   * @param   {String}  accessToken - The access token to get the client info from
   * @returns {Promise} Client Info resolved
   */
  getClientInfo: accessToken =>
    rp({
      method: 'GET',
      uri: clientinfo,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      jar: true,
      strictSSL: false,
      json: true,
      transform: function(body, res) {
        // res.data = JSON.parse(body);
        return res;
      },
    }),
  /**
   * Gets the token info from the OAuth2 authorization server
   * @param   {String}  accessToken - The access token to get the user info from
   * @returns {Promise} User Info resolved
   */
  getTokenInfo: accessToken =>
    rp({
      method: 'GET',
      uri: `${tokenInfo}?access_token=${accessToken}`,
      jar: true,
      strictSSL: false
    }),
  /**
   * Revokes a token from the OAuth2 authorization server
   * @param   {String}  accessToken - The access token to revoke
   * @returns {Promise} User revocation resolved
   */
  getRevokeToken: accessToken =>
    rp({
      method: 'GET',
      url: `${revokeToken}?token=${accessToken}`,
      jar: true,
      strictSSL: false
    }),
};

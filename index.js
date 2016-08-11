var OAuth2 = require('authport/lib/services/oauth2')
  , util = require('util')
  , Url = require('url')

function MakerPass(options) {
  var authUrl = Url.parse(options.authUrl || 'https://auth.makerpass.com')
  var authProtocol = authUrl.protocol.split(':')[0]

  var apiUrl = Url.parse(options.apiUrl || 'https://api.makerpass.com')

  this.code = {
    protocol: authProtocol,
    host: authUrl.host,
    pathname: '/oauth/authorize',
    query: {
      client_id: options.id,
      response_type: options.response_type || 'code',
      redirect_uri: options.redirect_uri,
      scope: options.scope || '',
    }
  }

  this.token = {
    method: 'POST',
    host:   authUrl.host,
    path:   '/oauth/token',
    query: {
      client_id: options.id,
      client_secret: options.secret,
      grant_type: 'authorization_code',
    }
  }

  this.user = function (accessToken) {
    return {
      host: apiUrl.host,
      path: '/me',
      headers: {
        'Authorization': 'bearer ' + accessToken
      }
    }
  }

  this.on('request', this.onRequest.bind(this))

  OAuth2.call(this, options);
}

util.inherits(MakerPass, OAuth2)

module.exports = MakerPass

// auth-strategy

var passport = require('koa-passport');
var {OAuth2Strategy} = require('passport-google-oauth');

require('../../pages/models/User');

var {
  credentials = {}
} = require('../../configs');

var normalize = (profile = {}) => {
  let {
    id = '',
    displayName = '',
    gender = '',
    photos = [],
    emails = []
  } = profile;

  let photo = '';
  if (photos.length) {
    photo = photos[0].value;
  }

  let email = '';
  if (emails.length) {
    email = emails[0].value;
  }

  return {
    id,
    displayName,
    gender,
    photo,
    email
  };
};


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

var {
  google = {}
} = credentials;

var {
  clientID = '',
  clientSecret = '',
  callbackURL = ''
} = google;

if (clientID && clientSecret) {

  passport.use(new OAuth2Strategy({
    clientID,
    clientSecret,
    callbackURL
  }, (accessToken, refreshToken, profile, done) => {
    done(null, normalize(profile));
  }));
}

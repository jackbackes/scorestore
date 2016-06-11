'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function (app, db) {

    var User = db.model('user');

    var googleConfig = app.getValue('env').GOOGLE;

    var googleCredentials = {
        clientID: googleConfig.clientID,
        clientSecret: googleConfig.clientSecret,
        callbackURL: googleConfig.callbackURL
    };

    var verifyCallback = function (accessToken, refreshToken, profile, done) {
        console.log( 'google: verifying callback' )
        console.log(profile);
        let profileJson = profile._json;
        var newUser = {
          google_id: profileJson.id,
          firstName: profileJson.given_name,
          lastName: profileJson.family_name,
          email: profileJson.email
        }
        User.findOne({
                where: {
                    google_id: newUser.google_id
                }
            })
            .then(function (user) {
                if (user) {
                    return user;
                } else {
                    return User.create(newUser);
                }
            })
            .then(function (userToLogin) {
                done(null, userToLogin);
            })
            .catch(function (err) {
                console.error('Error creating user from Google authentication', err);
                done(err);
            });

    };

    passport.use(new GoogleStrategy(googleCredentials, verifyCallback));

    app.get('/auth/google', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {failureRedirect: '/login'}),
        function (req, res) {
            console.log('===== AUTHENTICATING GOOGLE =====');
            console.log( req.user );
            res.redirect('/');
        });

};

'use strict';

var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function (app, db) {

    var User = db.model('user');

    var twitterConfig = app.getValue('env').TWITTER;

    var twitterCredentials = {
        consumerKey: twitterConfig.consumerKey,
        consumerSecret: twitterConfig.consumerSecret,
        callbackUrl: twitterConfig.callbackUrl
    };

    var createNewUser = function (token, tokenSecret, profile) {
        return User.create({
            twitter_id: profile.id
        });
    };

    var verifyCallback = function (token, tokenSecret, profile, done) {
        let twitterJson = profile._json;
        let fullName = twitterJson.name.split(' ');
        let firstName = fullName.shift();
        let lastName = fullName.join(' ') || "";
        let avatar = twitterJson.profile_image_url;
        let userInfo = {
          email: twitterJson.id + '@twitter.com',
          firstName: firstName,
          lastName: lastName,
          twitter_id: twitterJson.id,
          twitterData: twitterJson
        }
        // console.log(twitterJson);

        User.findOne({
            where: {
                twitter_id: profile.id
            }
        }).then(function (user) {
                if (user) { // If a user with this twitter id already exists.
                    user.twitterData = userInfo.twitterData;
                    return User.update(user);
                } else { // If this twitter id has never been seen before and no user is attached.
                    return User.create(userInfo);
                }
            })
            .then(function (user) {
                done(null, user);
            })
            .catch(function (err) {
                console.error('Error creating user from Twitter authentication', err);
                done(err);
            });

    };

    passport.use(new TwitterStrategy(twitterCredentials, verifyCallback));

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {failureRedirect: '/login'}),
        function (req, res) {
            res.redirect('/');
        });

};

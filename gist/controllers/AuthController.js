var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

var GITHUB_ID = "fc2f26b9a7815a548b34";
var GITHUB_SECRET = "bbce7ec6d5ed258861f45727036743211a82255f";

//Support presistent login sessions.
//passport needs to be able to seialize users into a session
//we can access the users object
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: GITHUB_ID,
    clientSecret: GITHUB_SECRET,
    callbackUrl: "http://dacechavez.me/auth/github/callback"}, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    }));

module.exports.init = function(app) {
    app.use(passport.initialize());
    app.use(passport.session());
}

module.exports.auth = function() {
    return passport.authenticate('github');
}

module.exports.callback = function() {
    return passport.authenticate('github', {failureRedirect: '/'});
}

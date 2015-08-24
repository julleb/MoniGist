var User = require('../models/UserModel.js');
var GistModel = require('../models/GistModel.js');

module.exports.renderFirstPage = function(req, res) {
    GistModel.recentGists(5, function(rows){
        GistModel.convertAge(rows, function(age_array) {
            res.render('index', { user: req.user, rows: rows, age_array : age_array });
        });
        
    });

}

module.exports.createUser = function(req, res, next) {
    var id = req.user.id;
    var username = req.user.username;
    var avatarUrl = req.user._json.avatar_url;
    var profileUrl = req.user.profileUrl;
    User.createUser(id, username, avatarUrl, profileUrl, function() {
        next();
    });
}


module.exports.renderProfile = function(req, res) {
    User.exists(req.params.user, function(result) {
        if(result.rows.length == 0) {
            var error = 'this user doesnt exists';
            res.render('error', {error : error});
        }else {
            GistModel.convertAge(result.rows, function(age_array) {
                 res.render('profile', {rows : result.rows, user : req.user, age_array: age_array});
            });
           
        }
    });
}

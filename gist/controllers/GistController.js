var Gist = require('../models/GistModel.js');
var util = require('util');
var helperFuncs = require('../models/Helper.js');

module.exports.createGist = function(req, res, next) {
    var gistText = req.body.textarea;
    var newGistUrl=1;
    var isPrivate = req.body.privateCheckbox;
    var username = 'a';
    var userid = -1;
    if(req.user) {
        username = req.user.username;
        userid = req.user.id;
    }
    Gist.createGist(gistText, username, isPrivate, false, function(newGistUrl) {
        Gist.getGistID(newGistUrl, function(newGistID) {
            Gist.createOwnership(userid, newGistID, function() {
                res.redirect(newGistUrl);
            });
        });
    });
}

module.exports.createGistWithCompilation = function(req, res, Docker, next) {
    var gistText = req.body.textarea;
    var newGistUrl=1;
    var isPrivate = req.body.privateCheckbox;
    var username = 'a';
    var userid = -1;
    if(req.user) {
        username = req.user.username;
        userid = req.user.id;
    }
    Gist.createGist(gistText, username, isPrivate, true, function(newGistUrl) {
        Gist.getGistID(newGistUrl, function(newGistID) {
            Gist.createOwnership(userid, newGistID, function() {
                Docker.prepare(gistText, newGistID, function() { 
                    next(newGistUrl);

                });
            });
        });
    });
}

module.exports.getGistWithCompilation = function(req, res, requestedUrl) {
    console.log("::::::::::::::::::::"+ requestedUrl);
    Gist.getGistWithCompilation(requestedUrl, function(rows) {
        if (rows.length === 0) {
            res.render("error", { error : "No such gist" })
        } else {
            helperFuncs.convertTime(rows[0].age, function(time) {
                res.render("newWithCompilation", { rows : rows, time : time })
            });

        }
    });
}

module.exports.getGist = function(req, res, requestedUrl) {
    Gist.getGist(requestedUrl, function(rows) {
        if (rows.length === 0) {
            res.render("error", { error : "No such gist" })
        } else {
            helperFuncs.convertTime(rows[0].age, function(time) {
                res.render("new", { rows : rows, time : time })
            });

        }
    });
}

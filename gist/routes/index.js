var express = require('express');
var router = express.Router();
var AuthController = require('../controllers/AuthController.js');
var GistController = require('../controllers/GistController.js');
var UserController = require('../controllers/UserController.js');
var DockerController = require('../controllers/DockerController.js');
var CompilationController = require('../controllers/CompilationController.js');


//logout a user
router.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
});

//get firstpage
router.get('/', function(req, res) { // ,next??

    UserController.renderFirstPage(req, res);
});

router.get('/socket.io/', function(req, res) {
    console.log("------------this is not an user req, it is socket");
    DockerController.handleSocket("nej", "null from socket");
});

//anonymous profile should not exist!
router.get('/ANONYMOUS', function(req, res) {
    var error = 'this user doesnt exists';
    res.render('error', {error : error});
});

router.post('/req/ajax', function(req, res) {
    //UserController.userExists(req.params.user);
    var longUrl = req.body.gistURL;
    console.log("AJAX REQUEST")
    var url = require('url');
    var gistURL = url.parse(longUrl).pathname;
    CompilationController.isCompilationFinished(gistURL, function(finished) {
        if(finished) {
            CompilationController.getFinishedCompilation(gistURL, function(output) {
                res.send(output);
            });
        } else {
            res.send("STILL COMPILING");
        }
    });

    // var util = require('util');
    // console.log(util.inspect(req, false, null));
    // GistController.getGist(req, res, '/'+req.params.user);
});


//creating a new gist
router.post('/new', function(req, res) {
    console.log("in NEW");
    var compileTheCode = req.body.compileCheckbox;
    if (compileTheCode) {
        if (req.user) {
            UserController.createUser(req, res, function () {
                GistController.createGistWithCompilation(req, res, DockerController, function(newGistUrl) {
                    res.redirect(newGistUrl);
                });
                
            });
        } else {
            GistController.createGistWithCompilation(req, res, DockerController, function(newGistUrl) {
                res.redirect(newGistUrl);
            });
        }
    } else {
        if (req.user) {
            UserController.createUser(req, res, function () {
                GistController.createGist(req, res, function(newGistUrl) {
                    res.redirect(newGistUrl);
                });
                
            });
        } else {
            GistController.createGist(req, res, function(newGistUrl) {
                res.redirect(newGistUrl);
            });
        }
    }
});

router.get('/auth/github', AuthController.auth(), function(req, res) {});

router.get('/auth/github/callback', AuthController.callback(), function(req, res) {
    // Authentication succesful
    res.redirect("/");
});

//get a gist from anonymous
router.get('/a/:randomUrl', function(req, res) {
    GistController.getGist(req, res, '/a/'+req.params.randomUrl);
});

//get a gist from a user
router.get('/:user/:randomUrl', function(req, res) {
    GistController.getGist(req, res, '/'+req.params.user+'/'+req.params.randomUrl);
});

router.get('/a/c/:randomUrl', function(req, res) {
    console.log("--------------------/a/c/:randomUrl");
    GistController.getGistWithCompilation(req, res, '/a/c/'+ req.params.randomUrl);
});

router.get('/:user/c/:randomUrl', function(req, res) {
    GistController.getGistWithCompilation(req, res, '/'+req.params.user+'/c/'+req.params.randomUrl);
});




//get user profile
router.get('/:user', function(req, res) {
    //UserController.userExists(req.params.user);
    console.log("get user profile");
    UserController.renderProfile(req, res);
    // GistController.getGist(req, res, '/'+req.params.user);
});



router.init = function(app, io) {
    AuthController.init(app);
}

module.exports = router;

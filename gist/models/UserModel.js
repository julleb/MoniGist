var pg = require('pg');
var url = "postgres://postgres:julle@localhost/gist";
var shortId = require('shortid');

module.exports.createUser = function(id, username, avatarUrl, profileUrl, next) {
    pg.connect(url, function(err, client, done) {
        if(err) {
            console.log('ERROR fetching client from db:' +  err);
        }
        client.query('SELECT * FROM users WHERE uid=$1;', [id], function(err,result) {
            if(err) {
                console.log('Error running select UID in users ' +  err);
                return;
            }

            // DB did not have such user, create it
            if (result.rows.length === 0) {
                client.query('INSERT INTO users VALUES($1, $2, $3, $4)',
                             [id, username, avatarUrl, profileUrl], function(err,result) {
                                 if(err) {
                                     console.log('Error inserting new user ' +  err);
                                 }
                                 client.end();
                                 next();
                             });

            } else {
                // DB found an user append this gist to this user
                next();
            }
        })
    });
}

//checks if a username exists in the db
//-------OSB --------- not in use at the moment
module.exports.exists = function(user, next) {
    pg.connect(url, function(err, client, done) {
        if(err){
            console.log('ERROR fetching client from db:' +  err);
        }
        client.query('SELECT * FROM users where username=$1;', [user], function(err, result) {
            if(err) {
                console.log('Error running select * from user where name=$1' +  err);
                return;
            }
            client.end();
            if(result.rows.length == 0) {
                next(false);
            }else {
                next(true);
            }
            
        });
    });
}

//gets all the gists from a user
module.exports.exists = function(user, next) {
    pg.connect(url, function(err, client, done) {
        if(err){
            console.log('ERROR fetching client from db:' +  err);
        }
   
        client.query('SELECT *, age(now(), date) FROM gists natural join owns natural join users where username=$1 order by id desc;', [user], function(err, result) {
            if(err) {
                console.log('Error running select UID in users ' +  err);
                return;
            }
            client.end();
            next(result);
        });
    });

}



var pg = require('pg');
var url = "postgres://postgres:julle@localhost/gist";
var shortId = require('shortid');
var helperFuncs = require('../models/Helper.js');

module.exports.recentGists = function(amount, next) {
     pg.connect(url, function(err, client, done) {
        client.query('SELECT *, age(now(),date) FROM gists natural join owns natural join users where public=true order by date desc limit $1', [amount], function(err, result) {
            if(err) {
                console.log('Error in getGistID ' +  err);
            }
            client.end();
            next(result.rows);
        })
    });

}


/*
    converts each rows' age to less specific time
    and return the ages in an array
*/
module.exports.convertAge = function(rows, next) {
    var age_array = [];
    for(i=0;i < rows.length; i++) {
        helperFuncs.convertTime(rows[i].age, function(age_string) {
            age_array.push(age_string);
        });
        
    }
    next(age_array);
}

module.exports.createGist = function(gistText, owner, isPrivate, compileTheCode, next) {
    // Generate random string for URL
    var randomUrl = shortId.generate();
    var completeUrl = '/' + owner + '/' + randomUrl;
    if (compileTheCode) {
        completeUrl = '/' + owner + '/c/' + randomUrl;
    }
    var isPublic = typeof isPrivate === "undefined" ? true : false;
    // Connect to database
    pg.connect(url, function(err, client, done) {
        // Failed to connect to database
        if(err) {
            console.log('ERROR fetching client from db:' +  err);
        }
        // Insert new anonymous gist to database
        client.query('INSERT INTO gists (url, text, date, public ) VALUES($1, $2, now(), $3);',
                     [completeUrl, gistText, isPublic], function(err,result) {
                         if(err) {
                             console.log('Error inserting new anonymous gist ' +  err);
                         }
                         client.end();
                         next(completeUrl);
                     });
    });
}

module.exports.getGistID = function(newGistUrl, next) {
    pg.connect(url, function(err, client, done) {
        client.query('SELECT id FROM gists WHERE url=$1', [newGistUrl], function(err, result) {
            if(err) {
                console.log('Error in getGistID ' +  err);
            }
            client.end();
            next(result.rows[0].id);
        })
    });
}

/*
    adds to the ownership table in our db.
    So we know which user who owns which gist
*/
module.exports.createOwnership = function(uid, id, next) {
    pg.connect(url, function(err, client, done) {
        client.query('INSERT INTO owns VALUES($1, $2)', [uid, id], function(err,result) {
            if(err) {
                console.log('Error inserting new owns ' +  err);
            }
            client.end();
            next();
        });
    });
}

//SELECT text FROM gists WHERE url=$1', [requestedUrl],
//next(result.rows[0].text
module.exports.getGistWithCompilation = function(requestedUrl, next) {
    pg.connect(url, function(err, client, done) {
        client.query('SELECT *, age(now(), date) FROM gists natural join owns natural join users NATURAL JOIN has NATURAL JOIN compilations WHERE url=$1', [requestedUrl], function(err, result) {
            if(err) {
                console.log('Error in getGistID ' +  err);
            }
            client.end();
            next(result.rows);
        })
    });
}

module.exports.getGist = function(requestedUrl, next) {
    pg.connect(url, function(err, client, done) {
        client.query('SELECT *, age(now(), date) FROM gists natural join owns natural join users WHERE url=$1', [requestedUrl], function(err, result) {
            if(err) {
                console.log('Error in getGistID ' +  err);
            }
            client.end();
            next(result.rows);
        })
    });
}

/*
    converts an age attribute from the db
    For example
    instead of 1 year, 2 days, 2 secs, we 
    convert it to 1 year.
*/
module.exports.returnTime = function(time, next) {
    var time_string;
    if(typeof time.years != 'undefined') {
        time_string = time.years + " years";
    }
    else if(typeof time.days != 'undefined') {
        time_string = time.days + " days";
    }
    else if(typeof time.hours != 'undefined') {
       time_string = time.hours + " hours";
    }
    else if(typeof time.minutes != 'undefined') {
      time_string = time.minutes + " minutes";
    }
    else if(typeof time.seconds != 'undefined') {
       time_string = time.seconds + " seconds";
    }else{
        time_string = 0 + " seconds";
    }
    next(time_string);

}


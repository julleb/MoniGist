// push to DB
var pg = require('pg');
var url = "postgres://postgres:julle@localhost/gist";

// Ajax will query this row until compiled == true
module.exports.insertEmptyCompilation = function(next) {
    pg.connect(url, function(err, client, done) {
        var compID = -11;
        client.query("INSERT INTO compilations (output, compiled) values('mannen ;)', false) RETURNING cid", function(err, result) {
            if(err) {
                console.log('Error in CompilationModel insertEmptyCompilation ' +  err);
            }
            client.end();
            compID = result.rows[0].cid;
            next(compID);
        });
    });
}


// The gist has been created and the docker is compiling
// we need to create ownership/relation between the gist
// and the unfinished compilation
module.exports.createHasRelation = function(compID, gistID, next) {
    pg.connect(url, function(err, client, done) {
        client.query("INSERT INTO has VALUES($1, $2)", [compID, gistID], function(err, result) {
            if(err) {
                console.log('Error in CompilationModel createHasRelation ' +  err);
            }
            client.end();
            next();
        });
    });
}

// If the docker finished compiling, we update the unfinished compilation
// because ajax is waiting
module.exports.finishCompilation = function(stdout, compID, next) {
    pg.connect(url, function(err, client, done) {
        client.query("UPDATE compilations SET output=$1, compiled=true WHERE cid=$2", [stdout, compID], function(err, result) {
            if(err) {
                console.log('Error in docker insert ' +  err);
            }
            client.end();
            next();
            //finishedCompilation(data);
        });
    });
}

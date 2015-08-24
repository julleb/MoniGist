var pg = require('pg');
var url = "postgres://postgres:julle@localhost/gist";

module.exports.isCompilationFinished = function(gistURL, next) {
    pg.connect(url, function(err, client, done) {
        client.query('SELECT compiled FROM compilations NATURAL JOIN has NATURAL JOIN gists WHERE url=$1', [gistURL], function(err, result) {
            if(err) {
                console.log('Error in CompilationController!!! ' +  err);
            }
            client.end();
            if (result.rows.length === 0) {
                console.log("RETURN FALSE BECAUSE NO ROWS");
                next(false);
            } else if (result.rows[0].compiled === true) {
                console.log("RETURN TRUE FINISHED COMPILATION ;)");
                next(true);
            } else {
                console.log("RETURN FALSE COMP because" +result.rows[0].compiled);
                next(false);
            }
        })
    });


}


// lite onödig att querya engång till
// vi vet ju att ovan har vi returnat "true"
module.exports.getFinishedCompilation = function(gistURL, next) {
    pg.connect(url, function(err, client, done) {
        client.query('SELECT output FROM compilations NATURAL JOIN has NATURAL JOIN gists WHERE url=$1', [gistURL], function(err, result) {
            if(err) {
                console.log('Error in CompilationController!!! ' +  err);
            }
            client.end();

            next(result.rows[0].output);

        })
    });
}

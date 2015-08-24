var shortId = require('shortid');
var CompilationModel = require('../models/CompilationModel.js');

var prepare = function(gistCode, gistID, next) {
    // Kill process after 20 sec
    var timeout = 20;

    // Create a random file name for user's code
    var randomFileName = shortId.generate();


    // Current path
    var path = __dirname + "/../tmp/";
    var projectRoot = __dirname + "/../";

    // Create the tmp folders
    var exec = require('child_process').exec;
    var fs = require('fs');
    console.log("in prepare");

    CompilationModel.insertEmptyCompilation(function(compID) {
        CompilationModel.createHasRelation(compID, gistID, function() {
            exec("mkdir " + path+randomFileName+" && cp "+ projectRoot+"script.sh " + path+randomFileName, function(st) {
                fs.writeFile(path + randomFileName+"/"+randomFileName+".cpp", gistCode, function(err) {
                    if(err) {
                        console.log("error in Docker.prepare"+err);
                    } else {
                        console.log("WROTE: "+gistCode+"\nTO FILENAME: "+randomFileName+"\nIN FOLDER: "+path);
                        copyFile(projectRoot+"script.sh", path+randomFileName+"/script.sh", function(err) {
                            if (err) {
                                console.log("error using copyFile!" + err)
                            }
                            console.log("copied script.sh to randomFileFolder")
                            // Prepare statement
                            var st = projectRoot +
                                "Docker.sh " +
                                timeout + "s " +
                                "-i -t -v " +
                                projectRoot + "tmp/" + randomFileName +
                                ":/usercode ubuntucpp /usercode/script.sh g++ "+randomFileName+".cpp ./a.out"

                            // Fill stdout when compiling is finished
                            //handleSocket("not done");
                            exec(st, function(err, stdout, stderr) {
                                if (err) {
                                    console.log(err);
                                }
                                
                                CompilationModel.finishCompilation(stdout, compID, function() {
                                    console.log("dockern klar, DB klar,"+stdout);
                                    next();
                                });
                            });
                        });
                    }
                });
            });
        });
    });
}


module.exports = {
    prepare: prepare,
}

function copyFile(source, target, cb) {
    var fs = require('fs');
    var cbCalled = false;

    var rd = fs.createReadStream(source);
    rd.on("error", done);

    var wr = fs.createWriteStream(target);
    wr.on("error", done);
    wr.on("close", function(ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}

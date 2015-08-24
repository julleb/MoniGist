

/*  Converts timestamp to less specific timestamp
    for example: 1 hour, 2 minutes, 1 secs will be converted to 1 hour
*/
module.exports.convertTime = function(time, next) {
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
function dateFormatter () {
    var currentDate = (new Date()).toLocaleDateString();
    var dateArray = currentDate.split("/");
    var day = dateArray[0]
    var mon = dateArray[1]
    var yr = dateArray[2]
    var newDate =  `${yr}-${day}-${mon}`
    return newDate;
}
function dateFormatterParam (excDate) {
    var currentDate = (excDate).toLocaleDateString()
    var dateArray = currentDate.split("/");
    var day = dateArray[0]
    if(day.length < 2) {
        day = `0${day}`
    }
    var mon = dateArray[1]
    if(mon.length < 2) {
        mon = `0${mon}`
    }
    var yr = dateArray[2]
    var newDate =  `${yr}-${day}-${mon}`
    return newDate;
}

function timeFormatter () {
    var currentTime = (new Date().toTimeString());
    var timeArray = currentTime.split(" ");
    var timeArray2 = timeArray[0];
    var timeArray3 = timeArray2.split(":");
    var hr = timeArray3[0];
    var min = timeArray3[1];
    var sec = timeArray3[2]; 
    var newTime =  `${hr}${min}${sec}`
    return newTime;
}


module.exports = {
    dateFormatter,
    dateFormatterParam,
    timeFormatter
}
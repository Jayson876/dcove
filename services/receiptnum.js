function getReceiptNumber() {
    var date = new Date().toLocaleDateString();
    var dateArray = date.split('/');
    var newDate = `${dateArray[2]}` + `${dateArray[1]}` + `${dateArray[0]}`;
    var time = new Date().toLocaleTimeString();
    var timeArray = time.split(':');
    var lastRemainderArray = timeArray[2].split(' ');
    var lastRemainder = lastRemainderArray[0];
    var newTime = `${timeArray[0]}` + `${timeArray[1]}` + `${lastRemainder}`;
    var randomNumber = Math.floor(Math.random() * 10);
    var token = `${newDate}` + `${newTime}` + `${randomNumber}`;

    return token;
    
}

module.exports = {
    getReceiptNumber
}
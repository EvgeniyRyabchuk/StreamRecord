const fs = require("fs");

function writeLog(text) {
    let timestamp = new Date();
    const [hour, minutes, seconds] = [timestamp.getHours(), timestamp.getMinutes(), timestamp.getSeconds()];
    let date = hour + ":" + minutes + ":" + seconds;
    fs.appendFile("logs/logs.txt", '\r\n' + text + '1' + ` [${date}]`, function (err) {
        if (err) {
            return console.log(err);
        }
        //console.logs("The file was saved!");
    });
}

module.exports = writeLog;
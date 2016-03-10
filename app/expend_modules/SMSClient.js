var http = require('http');
var querystring = require('querystring')
var serviceURL = "http://sdk2.zucp.net:8060/webservice.asmx/mt";
var crypto = require('crypto');
var md5 = crypto.createHash('md5');

var sms = function(sn,password){
	this.sn = sn;// 序列号
	this.password = password;// 密码
	md5.update(sn+password);
	var d = md5.digest('hex');
	this.pwd = d.toUpperCase();
}

sms.prototype.send = function(mobile,content,ext,stime,rrid){
	var data =querystring.stringify({
		sn : this.sn,
		pwd : this.pwd,
		mobile : mobile,
		content : content+"【腾讯·大秦家居补贴帮】",
		ext : "",
		stime : "",
		rrid : ""
	});
	console.info(data);
	var opt = {
		method : "POST",
		host : 'sdk2.zucp.net',
		port: 8060,
		path : '/webservice.asmx/mt',
		headers : {
			"Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
		}
	}

	var req = http.request(opt,function(serverFeedback){
		if (serverFeedback.statusCode == 200) {
            var body = "";
            serverFeedback.on('data', function (data) {
            	body += data;
           	}).on('end', function () {
           		console.info(body);
           	});
        }
        else {
            console.info(serverFeedback);
        }
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
	req.write(data+"\n");
	req.end();
}

module.exports = new sms('SDK-WSS-010-07888','b5ea9@f1');
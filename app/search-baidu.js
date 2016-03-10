var http = require("http"),
	env = require('jsdom').env,
	qs = require("querystring");

//https://www.baidu.com/s?ie=utf-8&f=3&rsv_bp=0&rsv_idx=1&tn=baidu&wd=ww&rsv_pq=d3b00d7400006786&rsv_t=f5caZ9%2Fbv0DkytZEoEoFwJHDu9XJsCJTSDG66U%2F%2B7E3iVXcbl4CEBNzRCkw&rsv_enter=0&rsv_sug3=3&rsv_sug1=2&prefixsug=ww&rsp=0&inputT=69457&rsv_sug4=70810
var SEARCH_URL = 'https://www.baidu.com/s';

var search = function(wd){
	var querystring = qs.stringify({wd:wd});

	var options = {
		hostname : 'www.baidu.com',
		port : 80,
		path : '/s?'+querystring,
		method : 'GET'
	};

	req = http.request(options,function(res){
		console.log('STATUS: ' + res.statusCode);  
	    console.log('HEADERS: ' + JSON.stringify(res.headers));  
	    res.setEncoding('utf8');  
	    res.on('data', function (chunk) {  
	        env(chunk, function (errors, window) {
			    var $ = require('jquery')(window);
			    console.log($('.t').html());
			 });
	    });  
	});

	req.on('error', function (e) {  
	    console.log('problem with request: ' + e.message);  
	});

	req.end();
}

search("王鹏");

(function () {
  'use strict';

  var env = require('jsdom').env
    , html = '<html><body><h1>Hello World!</h1><p class="hello">Heya Big World!</body></html>'
    ;

  // first argument can be html string, filename, or url
  env(html, function (errors, window) {
    console.log(errors);

    var $ = require('jquery')(window)
      ;

    console.log($('.hello').text());
  });
}());
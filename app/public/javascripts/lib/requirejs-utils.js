define(function(require,exports,module){
	
	var $ = require('jquery');
	var $window = require('window');
	
	var moneyFormat = function( str ,qz) {
		str = ""+str;
	    var newStr = "";
	    var count = 0;

	    if(str.indexOf(".")==-1){
	        for(var i=str.length-1;i>=0;i--){
	            if(count % 3 == 0 && count != 0){
	                newStr = str.charAt(i) + "," + newStr;
	            }else{
	                newStr = str.charAt(i) + newStr;
	            }
	            count++;
	        }
	        str = newStr + ".00"; //自动补小数点后两位
	    }
	    else
	    {
	        for(var i = str.indexOf(".")-1;i>=0;i--){
	            if(count % 3 == 0 && count != 0){
	                newStr = str.charAt(i) + "," + newStr;
	            }else{
	                newStr = str.charAt(i) + newStr; //逐个字符相接起来
	            }
	            count++;
	        }
	        str = newStr + (str + "00").substr((str + "00").indexOf("."),3);
	    }
	    return qz+str;
	};
	
	var dateFormat = function(date, format){  
		
	    date = new Date(date);  
	    var map = {  
	        "M": date.getMonth() + 1, //月份   
	        "d": date.getDate(), //日   
	        "h": date.getHours(), //小时   
	        "m": date.getMinutes(), //分   
	        "s": date.getSeconds(), //秒   
	        "q": Math.floor((date.getMonth() + 3) / 3), //季度   
	        "S": date.getMilliseconds() //毫秒   
	    };  
	    if(format==null || format==''){
	    	format = 'yyyy-MM-dd'
	    }
	    format = format.replace(/([yMdhmsqS])+/g, function(all, t){  
	        var v = map[t];  
	        if (v !== undefined) {  
	            if (all.length > 1) {  
	                v = '0' + v;  
	                v = v.substr(v.length - 2);  
	            }  
	            return v;  
	        }  
	        else if (t === 'y') {  
	                return (date.getFullYear() + '').substr(4 - all.length);  
	            }  
	        return all;  
	    });  
	    return format;  
	};
	
	var next = function(url){
		window.location.href = url;
	};
	
	var _alert = function(msg){
		alert(msg);
	};
	
	var strNotBlankOrNull = function(str){
		 return (null != str && "" != str);
	};
	
	var strIsBlankOrNull = function(str){
		 return !strNotBlankOrNull(str);
	};
	
	var getParams = function(selector){
		var _element = $(selector);
		var params = {};
		_element.find(":input").each(function(){
			if(null != $(this).attr("name") && '' != $(this).attr("name")){
				if($(this).attr("type")=="radio" || $(this).attr("type")=="checkbox"){
					if(this.checked){
						if(params[$(this).attr("name")]){
							params[$(this).attr("name")] += "," +$.trim($(this).val());
						}else{
							params[$(this).attr("name")] = $.trim($(this).val());
						}
					}
				}else if($(this).val()!=null && $(this).val()!=""){
					params[$(this).attr("name")] = $.trim($(this).val());
				}
			}
		});
		return params;
	};

	var parseUrl = function(url){
		return $window.base_path +url;
	}

	var back = function(){
		window.history.back();
	}
	
	exports.getParams = getParams;
	exports.moneyFormat = moneyFormat;
	exports.dateFormat = dateFormat;
	exports.next = next;
	exports.alert = _alert;
	exports.strNotBlankOrNull = strNotBlankOrNull;
	exports.strIsBlankOrNull = strIsBlankOrNull;
	exports.parseUrl = parseUrl;
	exports.back = back;
})

define(['jquery'],function(){
	
	var	Ajax = function(url){
		if(url.indexOf('?')==-1){
			url += "?_TIMESTAMP_="+ new Date().getTime();
		}else{
			url += "&_TIMESTAMP_="+ new Date().getTime();
		}
		this._url = url;
		this._params = {};
		this._success = function(){};
		this._error = function(){};
		this._method = 'GET';
		this._async = true;
		this._dataType = 'json';
	};
	
	Ajax.prototype.params = function(key,value){
		if(arguments.length == 1 && typeof(key) == 'object'){
			this._params = $.extend(this._params,key);
		}else if(typeof(key) == 'string' && typeof(value) == 'string'){
			var _para = {};
			_para[key] = value;
			this.params(_para);
		}
		return this;
	}
	
	Ajax.prototype.async = function(async){
		this._async = !!async;
		return this;
	}
	
	Ajax.prototype.dataType = function(dataType){
		this._dataType = dataType;
		return this;
	}
	
	Ajax.prototype.success = function(successCall){
		this._success = successCall;
		return this;
	}
	
	Ajax.prototype.error = function(errorCall){
		this._error = errorCall;
		return this;
	}
	
	Ajax.prototype.go = function(){
		var ajax = this;
		$.ajax(ajax._url,{
			type : ajax._method,
			data : ajax._params,
			dataType : this._dataType,
			async : ajax._async,
			error : ajax._error,
			success : ajax._success
		})
		return this;
	}
	
	Ajax.prototype.method = function(method){
		this._method = method;
		return this;
	}
	
	var Http = {
			Get : function(url){return new Ajax(url).method('GET');},
			Post : function(url){return new Ajax(url).method('POST');},
			Put : function(url){return new Ajax(url).method('PUT');},
			Delete : function(url){return new Ajax(url).method('DELETE');},
			Patch : function(url){return new Ajax(url).method('PATCH');},
			ValidateResp : {
				success : function(resp){
					return resp.status == 0 ;
				}
			}
	};
	
	return Http;
})
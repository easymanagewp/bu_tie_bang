define(['jquery','utils','window','http','jquery.validate.zh'],function($, u,W,http){
		

	/* 创建Form对象，初始化target和inputs，如果oOptions存在，那么将对表单进行初始化 */
	var Form = function(sSelector,oOptions,oOptions2,id){
		this.target = $(sSelector);
		this.inputs = {};
		
		if(typeof(oOptions)=='string'){
			var _mode = oOptions;
			oOptions = oOptions2;
			oOptions.url = W.basePath + _mode + ".do";
			if(id){
				oOptions.putUrl = W.basePath + _mode + '/'+id+'.do',
				oOptions.data = W.basePath + _mode + '/' + id+'.do'
			}
		}

		var _arrInputs = this.target.find(':input[name]');
		for(var iIndex = 0;iIndex<_arrInputs.length; iIndex++){
			var _oInput = $(this);
			var _sInputName = _oInput.attr('name');
			this.inputs[_sInputName] = _oInput;
		}
		
		if(oOptions){
			this.init(oOptions);
		}
	}

	/* 

	初始化form表单 
	{
		url : '',									// 表单提交地址
		data : 'http://xxx'/{aa:cc},				// 表单数据
		filter : {
			beforeLoad : function(oParams){},		// 加载数据之前执行
			afterLoad : function(oData){},			// 加载数据之后执行
			beforeSubmit : function(oParams){},		// 数据提交之前执行
			afterSubmit : function(err,oData){}		// 数据提交之后执行
		},
		validate : function(){						// 数据验证
			
		}
	}
	*/
	Form.prototype.init = function(oOptions){
		var _target = this.target;

		/* 如果url和method不存在，则从表单属性获取 */
		if(!oOptions.url){oOptions.url = _target.attr('action');}
		if(!oOptions.method){oOptions.method = _target.attr('method');}

		var _defaultOptions = {
			'url' : null,
			'putUrl' : null,
			'method' : 'post',
			'data' : null,
			'submitBtn' : '#submit',
			'filter' : {
				'beforeLoad' : function(oParams){return oParams;},
				'afterLoad' : function(resp){return resp;},
				'beforeSubmit' : function(oParams){return oParams;},
				'afterSubmit' : function(err,resp){
					if(err){
						u.alert('服务器链接错误');
					}else{
						if(http.ValidateResp.success(resp)){
							u.alert(resp.message);
						}else{
							u.alert(resp.message);
						}
					}
				}
			},
			'validate' : function(oParams){
				var validator = $(_target).data('validator');
				if(validator) {
					return validator.form();
				}else{
					return false;
				}
			}
		}
		oOptions = $.extend(true,{},_defaultOptions,oOptions);
		this.options = oOptions;

		// 如果初始化数据存在，则加载数据
		if(oOptions.data){
			this.data(oOptions.data);
		}
		
		
		var _form = this;
		// 绑定提交事件
		$(oOptions.submitBtn).unbind('click');
		$(oOptions.submitBtn).bind('click',function(){
			var params = _form.data();
			var validated = oOptions.validate(params);
			if(validated){
				params = oOptions.filter.beforeSubmit(params);
				// update
				var ajax = null;
				if(params.id){
					ajax = http.Put(oOptions.putUrl);
				}else{
					ajax = http.Post(oOptions.url);
				}
				ajax.params(params).success(function(resp){
					oOptions.filter.afterSubmit(null,resp);
				}).error(function(err){
					oOptions.filter.afterSubmit(err,resp);
				}).go();
			}
			return false;
		});

		
	}

	/*
	 加载表单数据
	*/
	Form.prototype.data = function(oData){
		var _form = this;
		
		// 参数存在，加载数据
		if(oData){
			if(typeof(oData)=='string'){
				// 远程加载数据
				var _params = {};
				_params = this.options.filter.beforeLoad(_params);
				http.Get(oData).params(_params).success(function(resp){
					console.info(oData);
					if(http.ValidateResp.success(resp)){
						resp = resp.result;
						resp = _form.options.filter.afterLoad(resp);
						_form.data(resp);
					}else{
						u.alert(resp.message);
					}
				}).go();
			}else{
				// 获取对象类型数据
				this.target.find(":input").each(function(){
					var name = $(this).attr("name");
					if(null != name && '' != name){
						var nameArr = name.split(".");
						var value = oData;
						for(var iIndex = 0;iIndex<nameArr.length;iIndex++){
							 value = value[nameArr[iIndex]];
							 if(value==null){
								 break;
							 }
						}
						if(value!=null){
							if($(this).attr("type")=="radio" || $(this).attr("type")=="checkbox"){
								if($(this).val()==value){
									$(this).attr("checked","checked");
									if(this.onclick){
										this.onclick();
									}
								}
							}else{
								$(this).val(value);
							}
						}
					}
				});
			};
		}

		// 参数不存在，获取数据
		if(!oData){
			var params = {};
			var _element = this.target;
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
		}
	};

	// 表单清空
	Form.prototype.clear = function(){
		this.target.find(':input')  
		 .not(':button, :submit, :reset, :hidden')  
		 .val('')  
		 .removeAttr('checked')  
		 .removeAttr('selected');
	}
	
	return {
		init : function(selector,options,options2,id){
			return new Form(selector,options,options2,id);
		}
	};
})

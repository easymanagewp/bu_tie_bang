define(function(){
	window.loadPage = function(_url){
		$("iframe[name='MianFrame']").attr('src', basePath + _url);
	};
	return window;
});
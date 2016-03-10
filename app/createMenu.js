var WechatAPI = require('wechat-api');
var api = new WechatAPI("wx4b0d39f71618d396", "a98f970881201c2666cb3cc5e8e09dad");
//var registration = require('./dao/registration');


var menus = {
 "button":[
   {
     "type":"view",
     "name":"活动介绍",
     "url":"http://xian.qq.com/zt2016/20160215qbt/index.htm"
   },
   {
     "type":"click",
     "name":"我要报名",
     "key":"BAO_MING"
   },
   {
     "type":"view",
     "name":"产品介绍",
     "url":"http://t.bzb365.com/wechat/product.htm"
   }]
}

api.createMenu(menus,function(err,result){
	console.info(result);
})

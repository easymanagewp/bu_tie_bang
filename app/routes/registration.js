var express = require('express');
var router = express.Router();
var api = require('../expend_modules/wechat-api');
var response = require('../expend_modules/response');
var smsClient = require('../expend_modules/SMSClient');
var registrationDao = require('../dao/registration');

var validateMobiles = {};

var getValidateCode = function(){
	var validateCode="";
	for(var i=0;i<6;i++)
	{
		validateCode+=Math.floor(Math.random()*10);
	}
	return validateCode;
}

/* 获取短信验证码 */
router.get('/registration/validate_code.do',function(req,res){
	var mobile = req.query.mobile;
	if(mobile==null || mobile==''){
		res.json(response.create(response.STATUS.FAIL,{},'请填写手机号'));
	}else {
		var validateCode = getValidateCode();
		smsClient.send(mobile,validateCode+'（动态验证码），请在60秒内填写');
		validateMobiles[req.query.mobile] = validateCode;
		res.json(response.create(response.STATUS.SUCCESS,{code:validateCode},'验证码获取成功'));
	}
});

/* 报名 */
router.post('/registration.do',function(req,res){
	var mobile = req.body.mobile;
	var validateCode = req.body.validate_code;
	var openid = req.body.openid;
	if(mobile ==null || mobile ==''){
		res.json(response.create(response.STATUS.FAIL,{},'请填写手机号'));
	}else if(validateCode ==null || validateCode ==''){
		res.json(response.create(response.STATUS.FAIL,{},'请填写验证码'));
	}else if(validateMobiles[mobile] ==null || validateMobiles[mobile] != validateCode){
		res.json(response.create(response.STATUS.FAIL,{},'验证码错误'));
	}else if(openid==null || openid ==''){
		res.json(response.create(response.STATUS.FAIL,{},'请在微信环境下进行报名'));
	}else{
		// 验证成功 | 报名通过
		var validateCode = getValidateCode();
		registrationDao.update({openid:openid},{$set:{mobile:mobile,validate_code:validateCode}},{},function(err,result){
			api.sendText(req.body.openid, '恭喜您成功报名【腾讯·大秦家居】补贴帮《装修抢补贴》活动 ！您的装修补贴兑换码为:'+validateCode
					+'\r\n兑换地址：腾讯·大秦家居线下体验店（西安市丈八东路与子午大道十字东南角帮众宝\r\n'
					+'预约咨询电话：4000-560-365', function(err,result){
				if(err){
					console.info(err);
				}else {
					console.info(result);
				}
			});

			res.json(response.create(response.STATUS.SUCCESS,{validateCode:validateCode},'报名成功'));
		})

	}
});

router.get('/registion.html', function(req, res, next) {
	api.getUser({openid: req.query.openid, lang: 'zh'},function(err,result){
		res.render('registion', {openid:req.query.openid,userInfo:result });
	})
});

/* 跳转登录页面 */
router.get("/user_list.html",function(req,res,next){
	var validate_code = req.query.validate_code;
	var mobile = req.query.mobile;
	var query_params = {};
	if(validate_code){
		query_params.validate_code = validate_code;
	}
	if(mobile){
		query_params.mobile = mobile;
	}
	registrationDao.find(query_params,{},{sort:[{'_id':-1}]},function(err,docs){
		res.render('registration/user_list',{docs:docs});
	})
});

module.exports = router;
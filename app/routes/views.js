var express = require('express');
var router = express.Router();
var api = require('../expend_modules/wechat-api.js');

router.get('/registration.html', function(req, res, next) {
	api.getUser({openid: req.query.openid, lang: 'zh'},function(err,result){
		res.render('registion', {openid:req.query.openid,userInfo:result });
	})
});

router.get('/registration/success.html',function(req,res,next){
	console.info(req.query.validateCode);
	res.render('registration_success',{validateCode:req.query.validateCode});
})

module.exports = router;
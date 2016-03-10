var wechat_oauth = require('../../expend_modules/wechat-oauth'),
    registration_dao = require('../../dao/registration');

var to_page = function(openid,req,res){
    if(openid == null || openid == null){
        // 请在微信环境下进入该页面 || 无法获取到用户信息，请您重新进入该页面
    }

    registration_dao.find({openid:openid},function(err,docs){
        res.render('validate_code/hong_bao_2',{docs:docs});
    });
};

module.exports = function(req,res){
    var user_code = req.query.code;
    if(user_code == null || user_code == ""){
        to_page(null,req,res);
        return;
    }

    wechat_oauth.getAccessToken(user_code,function(err,result){
        var openid = result.data.openid;
        to_page(openid,req,res);
    });
};
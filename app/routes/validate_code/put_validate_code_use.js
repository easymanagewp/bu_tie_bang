var api = require('../../expend_modules/wechat-api');
var response = require('../../expend_modules/response');
var smsClient = require('../../expend_modules/SMSClient');
var registrationDao = require('../../dao/registration');

module.exports = function(req,res){
    var registration_user_id = req.body._id;
    console.info(registration_user_id);
    registrationDao.update({_id:registration_user_id},{$set:{is_used:true}},{},function(err){
        if(err){
            res.json(response.create(response.STATUS.FAIL,{},"兑换失败"));
            console.error(err);
        }else{
            res.json(response.create(response.STATUS.SUCCESS,{},'兑换成功'));
            registrationDao.find({_id:registration_user_id},function(e,result){
                smsClient.send(result[0].mobile,"您的兑换劵消费成功！");
            })
        }
    });
};
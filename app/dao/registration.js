/*
 用户数据接口
 */

var datasource = require('../expend_modules/datasource');
var $ = require('../expend_modules/utils');
var base_dao = require('./base_dao');

// Schema 结构
var registration = new datasource.mongoose.Schema({
    openid : {type : String},
    mobile : {type : String},
    nickname : {type : String},
    head_img : {type : String},
    validate_code : {type:String},
    create_time : {type:Date,default:new Date()},
    is_used : {type:Boolean,default:false},
    parent : {type :{} }
});

// 创建运营商数据
var model = datasource.db.model('registration',registration);

module.exports = $.extend(new base_dao(model,registration),{
});
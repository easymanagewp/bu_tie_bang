/* 数据库配置 */
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://bt.bzb365.com:27017/btb');

// 链接错误
db.on('error', function(error) {
    console.log(error);
});

exports.mongoose = mongoose;
exports.db = db;
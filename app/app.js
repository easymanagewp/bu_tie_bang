var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var api = require('./expend_modules/wechat-api');
var http = require("https");
var fs = require("fs");
var registrationDao = require('./dao/registration');

var views = require('./routes/views');
var registration = require('./routes/registration');

var wechat = require('wechat');
var config = {
  token: 'butiebang_365_com',
  appid: 'wx4b0d39f71618d396',
  encodingAESKey: '5RD7PFQTcdrRlx1BMffiV5MLVEdcSs3TIQdEk4wfhUM'
};

var app = express();
app.use(express.query());
app.use(function(req,res,next){
  var _render = res.render;
  res.render = function(){
    if(!arguments[1]){
      arguments[1] = {};
    }
    arguments[1].query = req.query;
    _render.call(res,arguments[0],arguments[1],arguments[2]);
  }
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/v', views);
app.use('/',registration);
app.use('/',require('./routes/validate_code'))

app.use('/', wechat(config, wechat.text(function (message,req, res, next) {
  // 微信输入信息都在req.weixin上
  if(message.Content=='推广'){
    // 创建二维码
    api.createLimitQRCode("001_"+message.FromUserName, function(err,result){
          // 获取二维码图片
          var qrurl = api.showQRCodeURL(result.ticket);
          http.get(qrurl, function(res2){
            var imgData = "";

            res2.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开


            res2.on("data", function(chunk){
                imgData+=chunk;
            });

            res2.on("end", function(){
              var fileUrl = "./public/file/wechat_qrcode/001_"+message.FromUserName+".png";
                fs.writeFile(fileUrl, imgData, "binary", function(err){
                    // 上传二维码到微信服务器并且给用户返回
                    api.uploadMaterial(fileUrl, 'image', function(err,result){
                      res.reply({
                        type : 'image',
                        content:{
                          mediaId : result.media_id
                        }
                      })
                    });
                });
            });
        });
    });
  }else{

  }

}).image(function (message,req, res, next) {
}).voice(function (message,req, res, next) {
}).video(function (message,req, res, next) {
}).shortvideo(function (message,req, res, next) {
}).location(function (message,req, res, next) {
}).link(function (message,req, res, next) {
}).event(function (message,req, res, next) {
  if(message.Event=='subscribe'){
    // 关注
    if(message.EventKey && message.EventKey.indexOf('qrscene_')!=-1){
      // 带参数关注
      var eventKeys = message.EventKey.split('_');
      if(eventKeys.length ==3 && eventKeys[1] == '001'){
        // 大秦网报名活动
        var parentUserId = eventKeys[2];
        // 获取当前用户信息
        api.getUser({openid: message.FromUserName, lang: 'zh'},function(err,result){
          // 获取父用户信息
          registrationDao.find({openid:parentUserId},function(err,parent){
            // 获取当前用户信息
            registrationDao.find({openid:message.FromUserName},function(err,result3){
              // 不存在-保存
              if(result3.length<1){
                registrationDao.save({openid : message.FromUserName,nickname:result.nickname,head_img:result.headimgurl,parent:parent[0]},function(err,result2){
                  res.reply(result.nickname+',欢迎您参加【腾讯·大秦家居】补贴帮《装修抢补贴》栏目。请点击，<a href="http://bt.bzb365.com/v/registration.html?openid='+message.FromUserName+'">【我要报名】</a>。');
                })
              }else{
                // 存在 更新
                registrationDao.update({openid : message.FromUserName},{$set:{parent:parent[0]}},{},function(err,result2){
                  res.reply(result.nickname+',欢迎您参加【腾讯·大秦家居】补贴帮《装修抢补贴》栏目。请点击，<a href="http://bt.bzb365.com/v/registration.html?openid='+message.FromUserName+'">【我要报名】</a>。');
                })
              }
            })
          })
        })
      }
    }else{
      api.getUser({openid: message.FromUserName, lang: 'zh'},function(err,result){
        registrationDao.find({openid:message.FromUserName},function(err,result2){
          if(result2.length<1){
            registrationDao.save({openid : message.FromUserName,nickname:result.nickname,head_img:result.headimgurl},function(err,result){
            })
          }
        })
        res.reply(result.nickname+',欢迎您参加【腾讯·大秦家居】补贴帮《装修抢补贴》栏目。请点击，<a href="http://bt.bzb365.com/v/registration.html?openid='+message.FromUserName+'">【我要报名】</a>。');
      })

    }
  }else if(message.Event == 'unsubscribe'){
    // 取消关注
  }else if(message.Event == 'CLICK'){
    if(message.EventKey == 'BAO_MING'){
      api.getUser({openid: message.FromUserName, lang: 'zh'},function(err,result){
        res.reply('<a href="http://bt.bzb365.com/v/registration.html?openid='+message.FromUserName+'">点我报名</a>。');
      })
    }
  }
  
  
}).device_text(function (message,req, res, next) {
  
}).device_event(function (message,req, res, next) {
  
})));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

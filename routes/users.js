var express = require('express');
var router = express.Router();

var pool = require('../modules/db.js')
var md5 = require('md5');

router.get('/login', function(req, res, next) {
  res.render("login",{
    title:"登录"
  });
});

router.post('/login', function(req, res, next) {
  var loginName = req.body.loginName;
  var password = req.body.password;
  var type = req.body.type;
  var remember = req.body.remember;
  if(!loginName || !password){
    res.json({code:201,message:"帐号或密码不能为空!"})
    return;
  }

  pool.query("SELECT * FROM `users` WHERE loginName=? AND password=? AND type=?",[loginName,md5(password),type],function(err,result){
    if(err){
      res.json({code:202,message:'数据库操作失败！'});
      return;
    }

    if(result.length == 0){
      res.json({code:203,message:'帐号或密码或类型有误！'});
      return;
    }

    if(result.length > 1){
      res.json({code:204,message:'您的帐号存在异常！'});
      return;
    }

    var user = result[0];
    if(user.status != 0){
      res.json({code:205,message:"您的帐号被禁用或删除！"});
      return;
    }

    delete user.password;
    req.session.user = user;
    req.session.save();

    res.cookie("user",user);

    res.json({code:200,message:"成功！"});
  })


    
  // console.log(type);
  // console.log(remember);
  // res.json({code:200});

});

module.exports = router;

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

    if(remember === "true"){
      res.cookie("loginName",user.loginName);
    }else{
      res.clearCookie("loginName");
    }

    // console.log(typeof remember);

    res.json({code:200,message:"成功！"});
  })


    
  // console.log(type);
  console.log(remember);
  // res.json({code:200});

});


router.post('/logout',function(req,res,next){
  // 清空session和cookie
  req.session.user = null;
  res.clearCookie("user");
  
  // 客户端跳转：ajax跳转较为灵活，可以把接口和视图分为两个独立的项目，有利于业务逻辑和视图分离；服务器端跳转而route耦合性较高，视图和route需要在同一项目文件下
  
  // 向客户端相应数据。客户端再根据获取到的数据再进行跳转，我们成为"客户端跳转（渲染）（推荐）
  res.json({code:200,message:"退出成功"});

  // 方式1：直接跳转到login.ejs视图，缺点：代码和get('/login')重复，并且浏览器上显示的是/logout接口
  // res.render('login',{title:"登录"});
  // 方式2：解决了方式1的两个缺点，推荐使用
  // res.redirect('login');
})

module.exports = router;

var express = require('express');
var router = express.Router();
var checkLogin = require('../modules/checklogin')


router.get('/',checkLogin, function(req, res, next) {
  res.render('index', { title: '学生管理系统' });
});

module.exports = router;

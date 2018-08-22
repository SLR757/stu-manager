function checkLogin(req,res,next){
    if(!(req.session && req.session.user)){
        res.render('login',{title:"登录"});
        return;
    }
    // 或者if(!req.session.user)
    next();
}

module.exports = checkLogin;
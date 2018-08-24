var express = require('express');
var router = express.Router();

var md5 = require('md5');
var pool = require('../modules/db.js');
var checkLogin = require('../modules/checklogin.js');
var pager = require('../modules/pager.js')


router.get('/add',checkLogin,function(req,res,next){
    var sql=`
    SELECT * FROM majors WHERE status = 0;
    SELECT * FROM classes WHERE status = 0;
    SELECT * FROM departments WHERE status = 0;
    `;
    pool.query(sql,function(err,result){
        if(err){
            res.json({code:201,message:"数据库操作异常"});
            console.log(err);
            return;
        }

        var majors = result[0];
        var classes = result[1];
        var departs = result[2];

        res.render('teachers/add',{title:"教师信息添加",majors,classes,departs})
    })

})

router.post('/add',checkLogin,function(req,res,next){

    var tno = req.body.tno;
    var name = req.body.name;
    var sex = req.body.sex;
    var birthday = req.body.birthday;
    var card = req.body.card;
    var majorId = req.body.majorId - 0;
    var classId = req.body.classId - 0;
    var departId = req.body.departId - 0;
    var nativePlace = req.body.nativePlace;
    var address = req.body.address;
    var qq = req.body.qq;
    var phone = req.body.phone;
    var email = req.body.email;

    if(!tno || !name || !sex|| !birthday || !card || majorId == -1 || classId == -1 || departId == -1) {
        $('#myModal .modal-body').text('教师编号，姓名，性别，出生日期，身份证号，专业，班级，学院不能为空');
        $('#myModal').modal();
        return;
    }

    pool.query('select * from teachers where tno = ?',[tno],function(err,result){
        if(err){
            res.json({code:201,message:"数据库操作异常"});
            return;
        }
        if(result.length > 0){
            res.json({code:202,message:"您添加的教师信息已存在"});
            return;
        }


        var sql = `INSERT INTO teachers(tno,name,sex,birthday,card,majorId,classId,departId,nativePlace,address,qq,phone,email,status,createTime,createUserId)VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        var data = [tno, name, sex, birthday, card, majorId, classId, departId, nativePlace, address, qq, phone, email, 0, new Date(), req.session.user.id];
        pool.query(sql,data,function(err,result){
            if(err){
                res.json({code:201,message:"数据库操作异常"});
                return;
            }

            pool.query("INSERT INTO users(loginName, password, type, status)VALUE(?,?,?,?)", [tno, md5('123456'), 1, 0], function (err, result2) {
                if (err) {
                    res.json({ code: 201, message: "数据库操作异常！" });
                    return;
                }

                res.json({ code: 200, message: '保存成功！' })
            })
        })
    })

})


router.get('/list',function(req,res,next){
  
    var sql = `
    select * from majors where status = 0;
    select * from classes where status = 0;
    select * from departments where status = 0;
    SELECT COUNT(*) as totalCount FROM teachers;
    SELECT t.id,t.tno,t.name,t.sex,t.birthday,t.card,
    t.majorId,t.classId,t.departId,t.nativePlace,t.address,t.qq,
    t.phone,t.email,t.status,t.createTime,t.createUserId,t.updateTime,
    t.updateUserId, d.name as departName, m.name as majorName, c.name as className, 
    u1.loginName as createUserName, u2.loginName as updateUserName 
    FROM teachers t
    LEFT JOIN departments d ON t.departId = d.id
    LEFT JOIN majors m ON t.majorId = m.id
    LEFT JOIN classes c ON t.classId = c.id
    LEFT JOIN users u1 ON t.createUserId = u1.id
    LEFT JOIN users u2 ON t.updateUserId = u2.id where (1=1)`;

    var tno = req.query.tno;
    var name= req.query.name;
    var sex= req.query.sex;
    var majorId= req.query.majorId;
    var classId= req.query.classId;
    var departId= req.query.departId;
    var status= req.query.status;
    var birthdayBegin= req.query.birthdayBegin;
    var birthdayEnd  = req.query.birthdayEnd;
    var card = req.query.card;

    if(tno){
        sql += `AND t.tno like '%${tno}%'`;
    }
    if(name){
        sql += `AND t.name like '%${name}%'`;
    }
    if(sex && sex != -1){
        sql += `AND t.sex='${sex}'`;
    }
    if(majorId && majorId != -1){
        sql += `AND t.majorId='${majorId}'`;
    }
    if(classId && classId != -1){
        sql += `AND t.classId='${classId}'`;
    }
    if(departId && departId != -1){
        sql += `AND t.departId='${departId}'`;
    }
    if(status && status != -1){
        sql += `AND t.status='${status}'`;
    }
    // if(birthdayBegin){
    //     sql += `AND t.birthday>='${birthdayBegin}'`;
    // }
    // if(birthdayEnd){
    //     sql += `AND t.birthday<='${birthdayEnd}'`;
    // }
    if(birthdayBegin && birthdayEnd){
        try{
            var begin = new Date(birthdayBegin);
            var end = new Date(birthdayEnd);
            if(begin >= end){
                sql +=` AND t.birthday>='${birthdayEnd}' AND t.birthday<='${birthdayBegin}'`;

            }else{
                sql += `AND t.birthday>='${birthdayBegin}' AND t.birthday<='${birthdayEnd}'`
            }
        }catch{
            res.json({code:201,message:"日期输入有误"});
            return;
        }
        
    }else{
        if(birthdayBegin){
            sql += `AND t.birthday>='${birthdayBegin}'`;
        }
        if(birthdayEnd){
            sql += `AND t.birthday<='${birthdayEnd}'`;
        }
    }
    // 
    if(card){
        sql += `AND t.card like '%${card}%'`;
    }

    var page = req.query.page || 1;
    page = page - 0;
    // 每页显示条数
    var pageSize = 10;
    /* （page - 1）*pagesize,pagesize
    0,10
    10,10
    20,10*/
    sql += ` LIMIT ${(page -1) * pageSize},${pageSize}`;
    

    pool.query(sql, function (err, result) {
        if (err) {
            res.json({ code: 201, message: "数据库操作异常1！" });
            return;
            console.log(err);
        }
        // 取当前表中数据总记录数
        var totalCount = result[3][0].totalCount;
        var totalPage= Math.ceil(totalCount/pageSize);
        var pages = pager(page,totalPage);
        console.log(totalCount);

        res.render('teachers/list', {
            title: "教师列表",
            teachers: result[4],
            majors: result[0],
            classes:result[1],
            departs:result[2],
            pageInfo:{
                page,//当前页
                pages,
                pageSize,//每页显示个数
                totalPage,//总页数
                totalCount//表总记录数
            }
        })
    })
})

router.post('/remove',checkLogin,function(req,res,next){
    var id = req.body.id;
    console.log(id);
    if(!id){
        res.json({code:201,message:"参数错误"});
        return;
    }
    pool.query('UPDATE teachers SET status=1 WHERE id=?',[id],function(err,result){
        if(err){
            res.json({code:201,message:"数据库操作异常2"});
            return;
        }
        res.json({code:200,message:"编辑成功"})
    })
})


router.post('/multiRemove',checkLogin,function(req,res,next){
    var ids = req.body.ids;
    if(!ids){
        res.json({code:201,message:"参数错误"});
        return;
    }
    pool.query(`UPDATE teachers SET status = 1 WHERE id in (${ids})`,function(err,result){
        if(err){
            res.json({code:201,message:"数据库操作异常3"});
            return;
        }
        res.json({code:200,message:"编辑成功"})
    })
})


router.get('/edit/:id',checkLogin,function(req,res,next){
    var id = req.params.id;
    if(!id){
        res.json({code:201,message:"参数Id必填"});
        return;
    }
    pool.query(`
    SELECT * FROM teachers WHERE id = ?;
    SELECT * FROM majors WHERE status = 0;
    SELECT * FROM classes WHERE status = 0;
    SELECT * FROM departments WHERE status = 0;
    `,[id],function(err,result){
        if(err){
            res.json({ code: 201, message: "数据库操作异常" });
            return; 
        }
        if(result[0].length !=1){
            res.json({ code: 201, message: "所编辑教师不存在" });
            return;
        }
        res.render('teachers/edit',{
            title:"编辑教师信息",
            teacher:result[0][0],
            majors:result[1],
            classes:result[2],
            departs:result[3]

        });
    })
})


router.post('/edit',checkLogin,function(req,res,next){
    var id = req.body.id;
    var tno = req.body.tno;
    var name = req.body.name;
    var sex = req.body.sex;
    var birthday = req.body.birthday;
    var card = req.body.card;
    var majorId = req.body.majorId - 0;
    var classId = req.body.classId - 0;
    var departId = req.body.departId - 0;
    var nativePlace = req.body.nativePlace;
    var address = req.body.address;
    var qq = req.body.qq;
    var phone = req.body.phone;
    var email = req.body.email;
    if (!id || !tno || !name || !sex || !birthday || !card || majorId == -1 || classId == -1 || departId == -1) {
        res.json({ code: 201, message: '教师编号,姓名,性别,生日,身份证号,所属专业,所属班级,所属院系不能为空' });
        return;
    }
    pool.query('select * from teachers where id = ?',[id],function(err,result){
        if (err) {
            res.json({ code: 201, message: "数据库操作异常！" });
            return;
        }
        if (result[0].length > 1 || result[0].length < 1) {
            res.json({ code: 201, message: "你编辑的教师不存在" });
            return;
        }

        var sql = `update teachers set tno=?,name=?,sex=?,birthday=?,card=?,majorId=?,classId=?,departId=?,nativePlace=?,address=?,qq=?,phone=?,email=?,updateTime=?,updateUserId=? where
        id = ?`;
        var data =[tno, name, sex, birthday, card, majorId, classId, departId, nativePlace, address, qq, phone, email, new Date(), req.session.user.id, id];
        pool.query(sql,data,function(err,result){
            if (err) {
                res.json({ code: 201, message: "数据库操作异常！" });
                return;
            }
            res.json({ code: 200, message: '编辑成功！' })
        })
    })
})
module.exports = router;
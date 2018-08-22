$('#btnSave').click(function (e) {
    e.preventDefault();
    // 客户端判断
    var sno = $.trim($('#sno').val());
    var name = $.trim($('#name').val());
    var sex = $.trim($('#sex').val());
    var birthday = $.trim($('#birthday').val());
    var card = $.trim($('#card').val());
    
    // 字符串-0可以转换为数字
    var majorId = $.trim($('#majorId').val()) - 0;
    var classId = $.trim($('#classId').val()) - 0;
    var departId = $.trim($('#departId').val()) - 0;
    var phone = $.trim($('#phone').val());
    var email = $.trim($('#email').val());
    // []属性选择器
    var id = $("#id").val();

    if (!sno || !name || !sex || !birthday || !card || majorId == -1 || classId == -1 || departId == -1) {
        $('#myModal .modal-body').text('学号,姓名,性别,出生日期,身份证号,专业,班级,学院不能为空');
        $('#myModal').modal();
        return;
    }
    var patternCard = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
    if (!patternCard.test(card)){ 
        $('#myModal .modal-body').text('请检查身份证是否合法');
        $('#myModal').modal();
        return;
    }

    // 身份证验证，邮箱验证，手机号验证 ，自己加
    if(phone){
        var patternPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!patternPhone.test(phone)){ 
            $('#myModal .modal-body').text('请检查手机号是否合法');
            $('#myModal').modal();
            return;
        }
    }
    if(email){
        var patternEmail = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
        if (!patternEmail.test(email)){ 
            $('#myModal .modal-body').text('请检查邮箱是否合法');
            $('#myModal').modal();
            return;
        }
    }
    
    

    var data = {
        // 赋值名称相同可以省略，即sno:sno,=>sno,
        id,sno, name, sex, birthday, card, majorId, classId, departId,
        nativePlace: $('#nativePlace').val(),
        address: $('#address').val(),
        qq: $('#qq').val(),
        phone: $('#phone').val(),
        email: $('#email').val()
    }
    // console.log($('#majorId').val());
    // console.log(classId);
    // console.log(departId);

    $.post('/students/edit', data, function (d) {
        if (d.code != 200) {
            $('#myModal .modal-body').text(d.message);
            $('#myModal').modal();
            return;
        }
        location.href = '/students/list';
    })
})
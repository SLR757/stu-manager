
$(".remove").click(function () {

    var id = $(this).data('id');

    console.log(id);
    $.post('/students/remove', { id }, function (data) {
        if (data.code != 200) {
            $('#myModal .modal-body').text(data.message);
            $('#myModal').modal();
            return;
        }

        // 跳转
        location.href = '/students/list';
        // 刷新
        // location.reload();
    })

})

$("#btnRemove").click(function(){
    var selected = $('.selectSingle:checked');
    if(selected.length <= 0){
        $('#myModal .modal-body').text("请选择当前要删除的数据");
        $('#myModal').modal();
        return;
    }

    var ids = '';
    // each是jquery函数   第一个参数索引，第二个参数是函数原生htmlb标签
    selected.each(function(i,ele){
        console.log($(ele).data('id'));
        ids += $(ele).data('id') + ',';
    })
    if(ids.length > 0){
        ids = ids.substring(0, ids.length - 1);
    }
    // console.log(ids);

    $.post('/students/multiRemove',{ids},function(data){
        if (data.code != 200) {
            $('#myModal .modal-body').text(data.message);
            $('#myModal').modal();
            return;
        }

        location.href = '/students/list';
    })
})

$(".selectAll").click(function(){
    $('.selectSingle').prop('checked',$(this).prop('checked'));
})
// prop 类型是rediobtn checkbox的时候用
// attr常用h5自带属性，万能，都能用
// data 常用取自定义属性

$('.selectSingle').click(function(){
    // var selected = $(".selectSingle:checked");
    // if(selected.length == $('.selectSingle').length){
    //     $('.selectAll').prop("checked",true);
    // }else{
    //     $('.selectAll').prop("checked",false);
    // }

    $('.selectAll').prop('checked',$('.selectSingle:checked').length == $('.selectSingle').length);
})
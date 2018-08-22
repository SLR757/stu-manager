
$('#logout').on('click', function () {
  $.post('/logout', function (data) {
    if (data.code != 200) {
      $('#myModal .modal-body').text('注销出现异常！');
      $('#myModal').modal();
      return;
    }
    location.href = "/login";
  }
  )
})

// 点击选项卡显示突出当前选项
/* //1.存储cookie判断位置
$('.list-group a').click(function(){
  $.cookie("activeLink",$(this).attr('href'));

})
var activeLink = $.cookie("activeLink");
$('.list-group a').removeClass('active');
if(activeLink){
  $(`.list-group a[href='${activeLink}']`).parent().addClass('active');
  // parent()当前元素直接父级
}*/

// 2.通过当前url判断位置
// var url = purl();
// console.log(url.data.attr.path);
// 获取当前激活状态下的URL路径中的path属性，如students/add
var activeLink = purl().data.attr.path;
// 先把所有类名带有.list-group的元素下的a标签所对应父元素li，把样式类active移除。
$('.list-group a').parent().removeClass('active');
// 再把当前激活的URL所对应的a标签的父元素li添加active属性
$(`.list-group a[href='${activeLink}']`).parent().addClass('active');



$('.panel-title a').attr('aria-expanded', false);
$('.panel-collapse').removeClass('in');

// .closest（）当前元素向上最近的父级类
if ($(`.list-group a[href='${activeLink}']`).length == 0) {
  $('.panel-title:first a').attr('aria-expanded', true);
  $('.panel-collapse:first').addClass('in');
} else {
  $(`.list-group a[href='${activeLink}']`).closest('.panel-default').find('.panel-title a').attr('aria-expanded', true);
  $(`.list-group a[href='${activeLink}']`).closest('.panel-collapse').addClass('in');
}



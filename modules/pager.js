// 用来获取视图显示分页信息
// page当前页码，totalPage总页码
function getPages(page,totalPage){
    var pages = [page];
    var left = page - 1;
    var right = page + 1;

    while(pages.length < 10 && (left >= 1 || right <= totalPage)){
        if(left >= 1){
            pages.unshift(left--);
        }
        if(right <= totalPage){
            pages.push(right++);
        }
    }
    return pages;
}

module.exports = getPages;
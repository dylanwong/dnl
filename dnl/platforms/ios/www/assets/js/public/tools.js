/**
 * 获取本周、本季度、本月、上月的开始日期、结束日期
 */
var now = new Date();                    //当前日期   
var nowDayOfWeek = now.getDay();         //今天本周的第几天   
var nowDay = now.getDate();              //当前日   
var nowMonth = now.getMonth();           //当前月   
var nowYear = now.getYear();             //当前年   
nowYear += (nowYear < 2000) ? 1900 : 0;  //  

var lastMonthDate = new Date();  //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
var lastYear = lastMonthDate.getYear();
var lastMonth = lastMonthDate.getMonth();

//格式化日期：yyyy-MM-dd   
function formatDate(date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth()+1;
    var myweekday = date.getDate();

    if(mymonth < 10){
        mymonth = "0" + mymonth;
    }
    if(myweekday < 10){
        myweekday = "0" + myweekday;
    }
    return (myyear+"-"+mymonth + "-" + myweekday);
}

//获得某月的天数   
function getMonthDays(myMonth){
    var monthStartDate = new Date(nowYear, myMonth, 1);
    var monthEndDate = new Date(nowYear, myMonth + 1, 1);
    var   days   =   (monthEndDate   -   monthStartDate)/(1000   *   60   *   60   *   24);
    return   days;
}

//获得本季度的开始月份   
function getQuarterStartMonth(){
    var quarterStartMonth = 0;
    if(nowMonth<3){
        quarterStartMonth = 0;
    }
    if(2<nowMonth && nowMonth<6){
        quarterStartMonth = 3;
    }
    if(5<nowMonth && nowMonth<9){
        quarterStartMonth = 6;
    }
    if(nowMonth>8){
        quarterStartMonth = 9;
    }
    return quarterStartMonth;
}

//获得本周的开始日期   
function getWeekStartDate() {
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
    return formatDate(weekStartDate);
}

//获得本周的结束日期   
function getWeekEndDate() {
    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
    return formatDate(weekEndDate);
}

//获得本月的开始日期   
function getMonthStartDate(){
    var monthStartDate = new Date(nowYear, nowMonth, 1);
    return formatDate(monthStartDate);
}

//获得本月的结束日期   
function getMonthEndDate(){
    var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
    return formatDate(monthEndDate);
}

//获得上月开始时间
function getLastMonthStartDate(){
    var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
    return formatDate(lastMonthStartDate);
}

//获得上月结束时间
function getLastMonthEndDate(){
    var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
    return formatDate(lastMonthEndDate);
}

//获得本季度的开始日期   
function getQuarterStartDate(){

    var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
    return formatDate(quarterStartDate);
}

//或的本季度的结束日期   
function getQuarterEndDate(){
    var quarterEndMonth = getQuarterStartMonth() + 2;
    var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
    return formatDate(quarterStartDate);
}

function ifNull(data){
    if(data==null){
        return '0';
    }else if(data ==''){
        return '0';
    }else{
        return data;
    }

}


//数组操作
Array.prototype.contains = function(element) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == element) {
            return true;
        }
    }
    return false;
};
//数组移除
Array.prototype.remove = function(dx) {
    if (isNaN(dx) || dx > this.length) {
        return false;
    }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
            this[n++] = this[i];
        }
    }
    this.length -= 1;
};
Array.prototype.push = function() {
    var len = arguments.length;
    if (len > 0)
        for (var i = 0; i < len; i++)
            this[this.length] = arguments[i];
    return this.length;
};
Array.prototype.clear = function() {
    this.length = 0;
}  ;


function fomatFloat(src,pos){
    return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);
}
/**
 * Created by wyy on 2015-06-01.
 */

var taskTabStatus = 0;
function toggleTaskTabs(elm) {
    $(".tabTaskN").addClass('tabTaskY');
    $(".tabTaskN").removeClass('tabTaskN');

    $(elm).removeClass('tabTaskY');
    $(elm).addClass('tabTaskN');
    $("#taskList").empty();
    taskTabStatus = $(elm).attr('status');
    taskPanelLoad(taskTabStatus);
//    if(scrollFlag == 0){
//        taskScroll.scrollTo(0,0,1000);
//    }
    //scrollFlag =1;
    //taskPullUpEl['class'] = taskPullDownEl.attr('class');
    //taskPullUpEl.attr('class','').hide();
    //taskPullDownEl.attr('class','').hide();
   // taskScroll.refresh();
    //taskLoadingStep = 0;
}

function taskPanelLoad(taskStatus) {

    var user = JSON.parse(localStorage.getItem(USER_SESSION))
    var phone = user.obj.phone;//'13613085473';
    var tdStatus = "";
    taskStatus == undefined ? tdStatus = '0' : tdStatus = taskStatus;

    $.ui.blockUI(.3);
    $.ui.showMask("获取我的任务..");
    $("ul#taskList").empty();
    setCacheData("taskFilter",
        {'start': '0', 'length':'10', 'queryDate': '', 'status': tdStatus,'phone':phone}, true);
    getAjax(taskqueryUrl, JSON.parse(localStorage.getItem("taskFilter")),
        "updateTaskPanel(data,true)", "errorPopup('网络请求超时,请检查网络后再尝试..')");

}


function getTodoPullToRefresh(that){
    setCacheData("taskFilter",mergeJson(JSON.parse(localStorage.getItem("taskFilter")),
        {'start':0},true),true);
//    setCacheData("taskFilter",mergeJson(JSON.parse(localStorage.getItem("taskFilter")),
//        {'queryType':'1'},true),true);
    $("ul#taskList").empty();
    jQuery.ajax({
        url: taskqueryUrl,
        timeout: 20000, //超时X秒
        dataType: 'jsonp',
        data:JSON.parse(localStorage.getItem("taskFilter"))
    }).done(
        function (data) {
            if(data!=null)
            {
                if (data.isSucc === false && data.msg !=null && data.msg.indexOf('E0000') != -1 ) {
                    errorSessionPopup();
                }
                else if(data.isSucc === false && data.msg !=null){
                    var msgText=data.msg.split("-")
                    errorPopup(msgText[1])
                }else if(data.isSucc === true){
                    try{
                        if(data.obj.data.length==0){
                            $("#selfOrder_pulldown").html("<h2 style='color: #F6842B'>暂无新任务</h2>")
                        }else{
                            $("#selfOrder_pulldown").html("<h2 style='color: #F6842B'>新增"+data.obj.data.length+"个任务</h2>")
                            updateTaskPanel(data,true);
                        }
                    }catch(e){
                    };
                }
            }
        }).fail(function () {
            try{
                //eval(failFunction);
            }catch(e){
                //sendErrorInfo(errorInfo,true);
            };
        }).always(function () {
            setTimeout(function () {
                setCacheData("taskFilter",mergeJson(JSON.parse(localStorage.getItem("taskFilter")),
                    {'queryType':'2'},true),true);
                that.hideRefresh();
            }, 1000);
        });
}


function getRequestFromTaskInfinite(self) {
    var taskFilter =  JSON.parse(localStorage.getItem("taskFilter"));
    var start = parseInt(taskFilter.start) + 10;
    setCacheData("taskFilter",mergeJson(JSON.parse(localStorage.getItem("taskFilter")),
        {'start':start},true),true);
    jQuery.ajax({
        url: taskqueryUrl,
        timeout: 20000, //超时X秒
        dataType: 'jsonp',
        data:JSON.parse(localStorage.getItem("taskFilter"))
    }).done(
        function (data) {
            if(data!=null)
            {
                if (data.isSucc === false && data.msg !=null && data.msg.indexOf('E0000') != -1 ) {
                    errorSessionPopup();
                }
                else if(data.isSucc === false && data.msg !=null){
                    var msgText=data.msg.split("-")
                    errorPopup(msgText[1])
                }else if(data.isSucc === true){
                    try{
                        $(self.el).find("#infinite").remove();
                        self.clearInfinite();
                        updateTaskPanel(data);
                    }catch(e){
                        errorPopup('下拉刷新异常');
                    };
                }
            }
        }).fail(function () {
        }).always(function () {
            ajaxFlag=true;
        });

}

function updateTaskPanel(data, flag) {

    var oldMyFilter = JSON.parse(localStorage.getItem("taskFilter"));
    if(data.isSucc) {
        var result = '';
        //如果flag为true表示
        if(flag){
            $("#tasklist_ul").empty();
        }

        if (data.obj.recordsTotal >= 1 ){
                var result = template('taskListTemp',data);
                $("#tasklist_ul").append(result);
        }else{
            //$("#tasklist_ul").append("查询无任务");
                errorPopup('查无任务');
        }
    }else{
        errorPopup(data.msg);
    }
    initTaskScroll();
    if(scrollFlag == 0){
        taskScroll.scrollTo(0,0,1000);
    }
    scrollFlag =1;
    taskPullUpEl['class'] = taskPullDownEl.attr('class');
    taskPullUpEl.attr('class','').hide();
    taskPullDownEl.attr('class','').hide();
    taskScroll.refresh();
    taskLoadingStep = 0;
    $.ui.unblockUI();
    $.ui.hideMask();

       /* var html = template('taskListTemp', data);
       $('#tasklist_ul').html(html) ;
        initTaskScroll();

        if(scrollFlag == 0){
           taskScroll.scrollTo(0,0,1000);
        }
        scrollFlag =1;

        taskPullUpEl['class'] = taskPullDownEl.attr('class');
        taskPullUpEl.attr('class','').hide();
        taskPullDownEl.attr('class','').hide();
        taskScroll.refresh();
        taskLoadingStep = 0;*/
}

//任务
function taskInfo(elm)
{
    TDID = $(elm).attr('id');
    var data = eval('(' +$(elm).attr('data-task-detail')+ ')');
    $.ui.loadContent("#operateguide", false, false, "slide");
    $('#startplace').text(data.fromAdr);
    $('#endplace').text(data.endAdr);
    $('#o_sendNo').text(data.sendNo);
    $('#o_licensePlate').text(data.licensePlate);
    localStorage.setItem("currenttask",$(elm).attr('data-task-detail'));
    $('#chocieordersTelButton').attr('href','tel:'+data.custphone);
    $('#operateguideTelButton').attr('href','tel:'+data.custphone);
    $('#deliverordersTelButton').attr('href','tel:'+data.custphone);
    $('#followorderTelButton').attr('href','tel:'+data.custphone);
    $('#handoverordersTelButton').attr('href','tel:'+data.custphone);
}

function taskInfo(fromAdr,endAdr,sendNo,licensePlate,custphone,licensePlate,enterpriseno,deliveryNo)
{
//    $("#ImageFileRow").remove();
//    $("#followImageFileRow").remove();
//    $("#handoverImageFileRow").remove();
    $.ui.loadContent("#operateguide", false, false, "slide");
    $('#startplace').text(fromAdr);
    $('#endplace').text(endAdr);
    $('#o_sendNo').text(sendNo);
    $('#o_licensePlate').text(licensePlate);
    $('#chocieordersTelButton').attr('href','tel:'+custphone);
    $('#operateguideTelButton').attr('href','tel:'+custphone);
    $('#deliverordersTelButton').attr('href','tel:'+custphone);
    $('#followorderTelButton').attr('href','tel:'+custphone);
    $('#handoverordersTelButton').attr('href','tel:'+custphone);
    getAjax(taskDeatilqueryUrl,{'enterpriseNo':enterpriseno,'deliveryNo':deliveryNo}
        , "setTaskCache(data)", "errorPopup('网络请求超时,请检查网络后再尝试..')");
}

function setTaskCache(data){
    if(data.isSucc){
        localStorage.setItem("currenttask",JSON.stringify(data.obj));
    }
}


//任务
function trace_panel(elm)
{
//    $("#ImageFileRow").remove();
//    $("#followImageFileRow").remove();
//    $("#handoverImageFileRow").remove();

    TDID = $(elm).attr('id');
    var data = eval('(' +$(elm).attr('data-task-detail')+ ')');
    $.ui.loadContent("#operateguide", false, false, "slide");
    $('#startplace').text(data.fromAdr);
    $('#endplace').text(data.endAdr);
    $('#o_sendNo').text(data.sendNo);
    $('#o_licensePlate').text(data.licensePlate);

    localStorage.setItem("currenttask",$(elm).attr('data-task-detail'));

    $('#chocieordersTelButton').attr('href','tel:'+data.driverTel);
    $('#operateguideTelButton').attr('href','tel:'+data.driverTel);
    $('#deliverordersTelButton').attr('href','tel:'+data.driverTel);
    $('#followorderTelButton').attr('href','tel:'+data.driverTel);
    $('#handoverordersTelButton').attr('href','tel:'+data.driverTel);


}




function getTaskListPullToRefresh(){
    setCacheData("taskFilter",mergeJson(JSON.parse(localStorage.getItem("taskFilter")),
        {'queryType':'1','enterpriseNo':getEnterpriseNo(),'start':1},true),true);
    jQuery.ajax({
        url: queryTaskUrl,
        timeout: 20000, //超时X秒
        dataType: 'jsonp',
        data:JSON.parse(localStorage.getItem("taskFilter"))
    }).done(
        function (data) {
            if(data!=null)
            {
                if (data.isSucc === false && data.msg !=null && data.msg.indexOf('E0000') != -1 ) {
                    errorSessionPopup();
                }
                else if(data.isSucc === false && data.msg !=null){
                    var msgText=data.msg.split("-")
                    errorPopup(msgText[1])
                }else if(data.isSucc === true){
                    try{
                        if(data.obj.data.length==0){
                            $("#taskPullDown").html("<h2 style='color: #F6842B'>暂无新任务</h2>")
                        }else{
                            $("#taskPullDown").html("<h2 style='color: #F6842B'>总共"+data.obj.data.length+"个任务</h2>")
                            updateTaskPanel(data,true);
                        }
                    }catch(e){
                    };
                }
            }
        }).fail(function () {
            try{
                //eval(failFunction);
            }catch(e){
                //sendErrorInfo(errorInfo,true);
            };
        }).always(function () {
            setTimeout(function () {
                setCacheData("taskFilter",mergeJson(JSON.parse(localStorage.getItem("taskFilter")),
                    {'queryType':'2'},true),true);
                //that.hideRefresh();
                taskPullDownEl.attr('class','').hide();
                taskScroll.refresh();
                taskLoadingStep = 0;
            }, 1000);
        });
}


function getRequestFromTaskListInit() {
    var searchFilter =  JSON.parse(localStorage.getItem("taskFilter"));
    var start = '';
//    if(searchFilter.start == '1'){
//        start = parseInt(searchFilter.start) + 10;
//    } else {
//        start = parseInt(searchFilter.start) + 10;
//    }
    start = parseInt(searchFilter.start) + 10;
    setCacheData("taskFilter",mergeJson(JSON.parse(localStorage.getItem("taskFilter")),
        {'queryType':'1','enterpriseNo':getEnterpriseNo(),'start':start},true),true);
    jQuery.ajax({
        url: queryTaskUrl,
        timeout: 20000, //超时X秒
        dataType: 'jsonp',
        data:JSON.parse(localStorage.getItem("taskFilter"))
    }).done(
        function (data) {
            if(data!=null)
            {
                if (data.isSucc === false && data.msg !=null && data.msg.indexOf('E0000') != -1 ) {
                    errorSessionPopup();
                }
                else if(data.isSucc === false && data.msg !=null){
                    var msgText=data.msg.split("-")
                    errorPopup(msgText[1])
                }else if(data.isSucc === true){
                    try{
                        taskPullUpEl.removeClass('loading');
                        updateTaskPanel(data,false);
                    }catch(e){
                    };
                }
            }
        }).fail(function () {
        }).always(function () {
            //ajaxFlag=true;
            taskLoadingStep = 0;
            ajaxFlag = true;
        });

}




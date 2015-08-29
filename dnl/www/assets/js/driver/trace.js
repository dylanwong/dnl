/**
 * Created by 翔 on 2015/4/29.
 */

var traceOrderArray = new Array();
var traceSelNo;
var nullTrace = "<div align='center' style='margin: 10px;'>暂无物流跟踪信息...</div>";
function traceLoad(elm) {
        var data =  JSON.parse(localStorage.getItem("currenttask"));
        $("#tracStartplace").html(data.fromAdr);
        $("#tracendplace").html(data.endAdr);
        $("#traceTraceOrderNo").html(data.sendNo);
        $("#traceTime").html(data.deliveryDateDesc);
        queryTraceOrders(data.enterpriseNo,data.deliveryNo);

}

function queryTraceDesc(enterpriseno, systemNo, dispatchNo, sendNo, deliveryNo) {

    $.ui.blockUI(.3);
    $.ui.showMask("正在查询..");

    var user = JSON.parse(localStorage.getItem('user'));
    var options =
    {
        enterpriseno:enterpriseno,
        systemNo: systemNo,
        dispatchNo: dispatchNo,
        sendNo:sendNo,
        deliveryNo: deliveryNo
    };
    getAjax(queryTraceDescList, options, 'queryTraceDescSucc(data)', 'queryTraceDescError(data)');
}

function queryTraceDescSucc(datas) {
    var dispatchNo =  '';
    $("#trace-timeline-delivery").empty();
    var color, alert, title, time, desc;
    var html = "", height = "";
    if (datas.obj.length > 0) {
        var obj = datas.obj;
        for(var index=0;index<obj.length;index++){
            var data =obj[index];
            var status = data.status;
             dispatchNo = data.dispatchNo;
            time = data.changeTimeDesc;
            desc = data.statusDesc;
            if (desc == "") {
                height = ";height:100px;";
            }
            if (status <= 40) {
                color = "#30BC7F";
                title = "提货";
            } else if (status > 40 && status <= 70) {
                color = "#3EA2FC";
                title = "在途";
            } else if (status > 70 && status <= 99) {
                color = "#F53274";
                title = "交接";
            }

            if (index == 0) {
                alert = '<div style="height:20px;width:30px;' +
                    'background-color:#1EA389;border-radius:5px;color:#ffffff;font-size:12px;' +
                    'text-align:center;line-height:20px;">最新</div>';
            } else {
                alert = "";
            }

            var imgContent = '';
            for(var l = 0 ; l <data.files.length ; l++){

               imgContent += '<div style="float:left;width:30%;"><a target="_blank" ' +
                    'href="'+data.files[l].filePath+'" class="swipebox img'+data.dispatchNo+'" >'+
                    '<img name="realImg" style="margin:5px 0px;width:80px;height:70px;"  '+
                    ' src="'+data.files[l].filePath+'" '+
                    ' ></a> '+
                    '</div>';
            }

            html += '<div style="overflow:hidden;"><div class="fl" style="width:25%;margin:25px auto;">' +
                '<div style="width:60px;height:60px;background:' + color + ';border: 4px solid #fffff;border-radius:60px;' +
                'font-size:24px;color:#FFFFFF;font-weight:bold;text-align:center;line-height:60px;margin:0px auto;">' + title + '' +
                '</div></div><div class="fl" style="width:75%;"><div style="' + height + '" class="send"><div class="arrow"></div>' +
                '<div style="position:relative;right:5px;top:0px;float:right;">' + alert + '</div>' +
                '<div style="margin-left:10px;padding-top:10px;font-size:14px;font-weight:bold;">' + time + '</div>' +
                '<div style="font-size:12px;margin-left:10px;margin-bottom:20px;">' + desc + '</div>' +
                '<div style="overflow:hidden;">'+imgContent+'</div></div></div></div>';
        };
    } else {
        html = nullTrace;
    }
    $("#trace-timeline-delivery").append(html);
    $('.img'+dispatchNo).swipebox();
    $.ui.unblockUI();
    $.ui.hideMask();
}
function queryTraceDescError(data) {

}


function queryTraceOrders(enterpriseNo, deliveryNo) {
    var options =
    {
        enterpriseno: enterpriseNo,
        deliveryNo: deliveryNo
    };
    getAjax(queryTraceOrderList, options, 'queryTraceOrdersSucc(data)', 'queryTraceOrdersError(data)');
}
function queryTraceOrdersSucc(data) {

    $("#trace-timeline-delivery").empty();
    traceOrderArray.splice(0, traceOrderArray.length);
    if (data.obj.length > 0) {
        for (var i = 0; len = data.obj.length, i < len; i++) {
            var  orderNo=data.obj[i].orderNo;
            var  subOrderNo=data.obj[i].subOrderNo;
            var  dispatchNo = data.obj[i].dispatchNo;
            var   enterpriseNo= data.obj[i].enterpriseNo;
            var   systemNo= data.obj[i].systemNo;
            var order = {
                orderNo:orderNo,
                subOrderNo:subOrderNo,
                dispatchNo: dispatchNo,
                enterpriseNo : enterpriseNo,
                systemNo : systemNo
            };
            traceOrderArray.push(order);

            if (i == 0) {
                var currentTask =  JSON.parse(localStorage.getItem("currenttask"));
               queryTraceDesc(enterpriseNo, systemNo, dispatchNo, currentTask.sendNo, currentTask.deliveryNo);
                $("#traceOrderSelNoDelivery").html(subOrderNo);
            }
        }
    } else {
        $("#traceOrderSelNoDelivery").html("");

        $("#trace-timeline-delivery").append(nullTrace);
    }

}
function queryTraceOrdersError() {

}

function changeTraceOrder() {
    if (traceOrderArray.length == 0) {
        errorPopup('该运输单无订单数据!');
    } else {
        var desc = "";
        $(traceOrderArray).each(function (i, data) {
            desc += "<a dataId=" + data.orderNo + " " +
                "subOrderNo="+data.subOrderNo+" " +
                "enterpriseNo="+data.enterpriseNo+" " +
                "dispatchNo="+data.dispatchNo+" " +
                "systemNo="+data.systemNo+" " +
                "style='color:#767A80;display:block;' " +
                "href='javascript:;' onclick='selTraceOrder(this)'>" +
                "<div  " +
                " style='border-bottom: 1px solid #ccc;margin: 10px'>" + data.subOrderNo + "</div></a>";
        });
        $.ui.popup({
            title: "切换订单",
            message: "<div style='height: 200px; overflow-y:scroll;'>" + desc + "</div>",
            cancelCallback: function () {
            },
            cancelText: '取消',
            cancelOnly: true,
            cancelClass: "popup-btn"
        });
    }

}

function selTraceOrder(elm) {
    var orderNo = $(elm).attr('dataId');
    var subOrderNo = $(elm).attr('subOrderNo');
    var  dispatchNo = $(elm).attr('dispatchNo');
    var   enterpriseNo= $(elm).attr('enterpriseNo');
    var   systemNo= $(elm).attr('systemNo');
    $("#traceOrderSelNoDelivery").html(subOrderNo);
    var currentTask =  JSON.parse(localStorage.getItem("currenttask"));
    queryTraceDesc(enterpriseNo, systemNo, dispatchNo, currentTask.sendNo, currentTask.deliveryNo);
}
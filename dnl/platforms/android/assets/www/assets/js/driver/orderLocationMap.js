/**
 * Created by wangyay on 2015-08-25.
 */


function toLocationMapPanel(fromAdr,endAdr,sendNo,licensePlate,custphone,licensePlate,enterpriseno,deliveryNo){

    $.ui.loadContent("#locationMap", false, false, "slide");
    getAjax(taskDeatilqueryUrl,{'enterpriseNo':enterpriseno,'deliveryNo':deliveryNo}
        , "setTaskCache(data)", "errorPopup('网络请求超时,请检查网络后再尝试..')");

    var queryCoordinateUrl = baseUrl+"base/queryCoordinate.action";
    var data = JSON.parse(localStorage.getItem("currenttask"));
    var option = {
        enterpriseNo:enterpriseno,
        deliveryNo:deliveryNo
    };
    getAjax(queryCoordinateUrl,option,'queryAllOrders_result_succ(data)');
  //  getAjax(queryCoordinateUrl,{});
}
var driver_map = new BMap.Map("location_map_content");
function queryAllOrders_result_succ(data){
    localStorage.setItem('currenttaskorder',data);
    var points = [];
//    for (var k= 0,len = data.obj.length; k<len; k++) {
//        points[k] = new BMap.Point(data.obj[k].ownerlatitude,data.obj[k].ownerlongtitude);
//        //    alert(longitudes[i]+'   '+latitudes[i]);
//    }
    $("#location_map_content").height(2*($("#locationMap").height()
        -$('#header').height())/3);
    //$("#location_map_content").width($("#locationMap").width());

//    var curve = new BMapLib.CurveLine(points,
//        {strokeColor:"red", strokeWeight:3, strokeOpacity:0.5,strokeStyle:'solid'}); //创建弧线对象
//    map.addOverlay(curve); //添加到地图中
//    curve.enableEditing(); //开启编辑功能
    var data_info = [] ;
    for (var k= 0,len = data.obj.length; k<len; k++) {
        points[k] = new BMap.Point(data.obj[k].ownerlatitude,data.obj[k].ownerlongtitude);
        //    alert(longitudes[i]+'   '+latitudes[i]);

        data_info.push([data.obj[k].ownerlatitude,data.obj[k].ownerlongtitude,
                ""+data.obj[k].orderNo+"<br/>发货地址"]);
        data_info.push([data.obj[k].custlatitude,data.obj[k].custlongtitude,
                ""+data.obj[k].orderNo+"<br/>收货地址"]);
    }

//    var data_info = [[114.001452,22.600759,"陈司机：1588888999 <br/> 轻面 32吨"],
//        [114.002674,22.598356,"王司机：1588888999<br/>金杯 12吨"],
//        [114.001605,22.598582,"黎司机：1588888999<br/>重卡 105吨"],
//        [114.001578,22.599649,"黎司机：1588888999<br/>重卡 105吨"],
//        [113.999305,22.598498,"黎司机：1588888999<br/>重卡 105吨"]
//    ];
    var opts = {
        width : 100,     // 信息窗口宽度
        height: 50,     // 信息窗口高度
        title : "仓库信息" , // 信息窗口标题
        enableMessage:true//设置允许信息窗发送短息
    };
    map.setViewport(points);
    for(var i=0;i<data_info.length;i++){
        var myIcon = new BMap.Icon("assets/img/star.png",
            new BMap.Size(16,16));
        var marker = new BMap.Marker(new BMap.Point(data_info[i][0],data_info[i][1])
            ,{icon:myIcon});  // 创建标注
        var content = data_info[i][2];
        map.addOverlay(marker);               // 将标注添加到地图中
        addClickHandler(content,marker);
    }
    function addClickHandler(content,marker){
        marker.addEventListener("click",function(e){
                openInfo(content,e)}
        );
    }
    function openInfo(content,e){
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
        map.openInfoWindow(infoWindow,point); //开启信息窗口
    }
}

function queryCoordinateUrlSucc(datas){

}
// 百度地图API功能
function init_map(longitudes,latitudes) {
    try{
        var points = [];
        var len = longitudes.length;
        // alert(len);
        for ( var i = 0; i < longitudes.length; i++) {
            points[i] = new BMap.Point(longitudes[i],latitudes[i]);
            //    alert(longitudes[i]+'   '+latitudes[i]);
        }
      /*  $("#tracecontainerMap").height($("#traceMap").height()
            -$('#header').height());
        $("#tracecontainerMap").width($("#traceMap").width());*/
        var map = new BMap.Map("location_map_frame");
        map.centerAndZoom(new BMap.Point(118.454, 32.955), 11);
        map.enableScrollWheelZoom();
        var beijingPosition=new BMap.Point(116.432045,39.910683),
            hangzhouPosition=new BMap.Point(120.129721,30.314429),
            xianPosition=new BMap.Point(114.3162,30.581084),
            taiwanPosition=new BMap.Point(113.950723,22.558888);
        //  var points = [beijingPosition,hangzhouPosition,xianPosition,taiwanPosition];

        var curve = new BMapLib.CurveLine(points,
            {strokeColor:"red", strokeWeight:3, strokeOpacity:0.5,strokeStyle:'solid'}); //创建弧线对象
        map.addOverlay(curve); //添加到地图中
        curve.enableEditing(); //开启编辑功能

        map.setViewport(points);//自动适应缩放级别

        var myIcon = new BMap.Icon("assets/img/car.png",
            new BMap.Size(56,34));
        var marker = new BMap.Marker(new BMap.Point(longitudes[len-1],latitudes[len-1]),{icon:myIcon});  // 创建标注
        map.addOverlay(marker);               // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    }catch(e){
        errorPopup(e.message);
        errorPopup(e.description);
    }
}

function toOperatePanel(fromAdr,endAdr,sendNo,licensePlate,custphone,licensePlate,enterpriseno,deliveryNo){
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
}

/**
 * Created by wangyay on 2015-08-25.
 */


function toLocationMapPanel(fromAdr,endAdr,sendNo,licensePlate,custphone,licensePlate,enterpriseno,deliveryNo){

    $.ui.blockUI(.3);
    $.ui.showMask("正在加载地图..");
    $("#Map_CustAddr").hide();
    $("#Map_OwnerAddr").show();
    $('#startplace').text(fromAdr);
    $('#endplace').text(endAdr);
    $('#o_sendNo').text(sendNo);
    $('#o_licensePlate').text(licensePlate);
    localStorage.removeItem('currenttaskorder');
    $("#location_map_content").height(2*($("#locationMapPanel").height()-$('#header').height())/3);//2*($("#locationMapPanel").height()
   // -$('#header').height())/3
    $("#location_map_content").width($("#locationMapPanel").width());
    $("#mapwrapper").css('top',2*($("#locationMapPanel").height()-$('#header').height())/3);
    initlocationMapHeader();

    getAjax(taskDeatilqueryUrl,{'enterpriseNo':enterpriseno,'deliveryNo':deliveryNo}
        , "setTaskCache(data)", "errorPopup('网络请求超时,请检查网络后再尝试..')");
    var queryCoordinateUrl = baseUrl+"base/queryCoordinate.action";
    var data = JSON.parse(localStorage.getItem("currenttask"));
    var option = {
        enterpriseNo:enterpriseno,
        deliveryNo:deliveryNo
    };
    getAjax(queryCoordinateUrl,option,'queryAllOrders_result_succ(data)');
}


var driver_map;
var mapdata_length;
function queryAllOrders_result_succ(data){
    try{
    showAllOrderLocationList(data);
    if(data.isSucc && (data.obj !=null && data.obj !='')){
        $.ui.loadContent("#locationMapPanel", false, false, "slide");
        driver_map = new BMap.Map("location_map_content");
        localStorage.setItem('currenttaskorder',JSON.stringify(data) );
        var points = [];
        var data_info = [] ;
        mapdata_length =data.obj.length;
        for (var k= 0 ; k<mapdata_length; k++) {
            points[k] = new BMap.Point(data.obj[k].ownerlatitude,data.obj[k].ownerlongtitude);
        //    alert(longitudes[i]+'   '+latitudes[i]);

            data_info.push([data.obj[k].ownerlatitude,data.obj[k].ownerlongtitude,
                "联系人 ："+data.obj[k].ownerContacts
            +"<a  href='tel:'"+data.obj[k].ownerPhone+"''>"
            +"<i class='icon-local-phone fs24'></i></a>"
            +"<br/>发货地址:"+data.obj[k].ownerAddr]);

        }
        for (var k= 0,len = data.obj.length; k<len; k++) {
            data_info.push([data.obj[k].custlatitude,data.obj[k].custlongtitude,
                    "联系人 ："+data.obj[k].custContacts
                    +"<a  href='tel:'"+data.obj[k].custPhone+"''>"
                    +"<i class='icon-local-phone fs24'></i></a>"+"<br/>收货地址"+data.obj[k].custAddr]);
        }

        var opts = {
            width : 100,     // 信息窗口宽度
            height: 70,     // 信息窗口高度
            title : "" , // 信息窗口标题
            enableMessage:true//设置允许信息窗发送短息
        };
//"assets/img/star.png
        driver_map.setViewport(points);
        for(var i=0;i<data_info.length;i++){
            var singlepoint = new BMap.Point(data_info[i][0],data_info[i][1]);
            var content = data_info[i][2];
              // 将标注添加到地图中
            if ( data_info[i] ){
                addMarker(singlepoint,i,content);
              //  addClickHandler(content,marker);
            }

        }
        function addMarker(singlepoint, index,content){
               // 创建图标对象
            var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
            offset: new BMap.Size(10, 25),                  // 指定定位位置
            imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移
            });
         //   console.info(index+' '+content)
            var marker = new BMap.Marker(singlepoint, {icon: myIcon,zIndex:index});
            driver_map.addOverlay(marker);
            //marker.setZIndex(zIndex:index);
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
            driver_map.openInfoWindow(infoWindow,point); //开启信息窗口
        }
    }else{
        $.ui.loadContent("#operateguide", false, false, "slide");
    }

    $.ui.unblockUI();
    $.ui.hideMask();
    initlocationScroll();
    }catch(e){
        errorPopup(e.description);
    }
}


function openInfo(Contacts,Phone,Addr,lng,lat,type,markerNum){
    var opts = {
        width : 100,     // 信息窗口宽度
        height: 70,     // 信息窗口高度
        title : "" , // 信息窗口标题
        enableMessage:true//设置允许信息窗发送短息
    };
    var marker_index = 0;
    var titleContent='';
    if (type==0){
        titleContent='发货地址';
        marker_index = parseInt( markerNum );
    }else{
        titleContent='收货地址';
        marker_index =  parseInt(markerNum) + parseInt(mapdata_length);
    }
    var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
        offset: new BMap.Size(10, 25),                  // 指定定位位置
        imageOffset: new BMap.Size(0, 0 - marker_index * 25)   // 设置图片偏移
    });
    var point = new BMap.Point(lng,lat);
    var marker = new BMap.Marker(point, {icon: myIcon,zIndex:marker_index});
    driver_map.addOverlay(marker);
    //marker.setZIndex(zIndex:index);

    var content = "联系人 ："+Contacts
        +"<a  href='tel:'"+Phone+"''>"
        +"<i class='icon-local-phone fs24'></i></a>"
        +"<br/>"+titleContent+":"+Addr;

   // addClickHandler(content,marker);
    var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
    driver_map.openInfoWindow(infoWindow,point); //开启信息窗口
}
//function queryCoordinateUrlSucc( datas ) {
//    toOperatePanel(fromAdr,endAdr,sendNo,licensePlate,custphone,licensePlate,enterpriseno,deliveryNo)
//}

function showAllOrderLocationList(data){
//    var data = JSON.parse( localStorage.getItem('currenttaskorder',data) );
    if(data.isSucc){
        var result = template('OwnerAddrListTemp',data);
        $('#Map_OwnerAddr').html(result);
        var custresult = template('CustAddrListTemp',data);
        $('#Map_CustAddr').html(custresult);
        $('span[id="orderNum"]').each(function(){
            // alert($(this).text());
            $(this).text( String.fromCharCode(parseInt($(this).text())+64)  +'.');
        });
        $('span[id="orderNum2"]').each(function(){
         //   console.info(parseInt($(this).text())+64+data.obj.length);
            $(this).text( String.fromCharCode(parseInt($(this).text())+64+data.obj.length) +'.');
        });
    }

}
var mapTabStatus = 0;
function toggleMapTabs(elm) {

    $.ui.blockUI(.9);
    $.ui.showMask("正在加载地图..");
    $(".tabMapN").addClass('tabMapY');
    $(".tabMapN").removeClass('tabMapN');
    $(elm).removeClass('tabMapY');
    $(elm).addClass('tabMapN');
    if( $(elm).attr('status') == 0 ) {
        $("#Map_CustAddr").hide();
        $("#Map_OwnerAddr").show();
        mapTabStatus = 1;
    }else if( $(elm).attr('status') == 1 ) {
        $("#Map_CustAddr").show();
        $("#Map_OwnerAddr").hide();
        mapTabStatus = 0;
    }

    $.ui.unblockUI(.9);
    $.ui.hideMask();
}


function toOperatePanel(){
    $.ui.loadContent("#operateguide", false, false, "slide");

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


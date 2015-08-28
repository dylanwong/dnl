/**
 * Created by wangyy on 2015/8/27.
 */


function navigationDo(navigationFestAddressValue,latitude,longitude)
{

    if($.trim(navigationFestAddressValue) == ''){
        toastrTip('','目的地为空..','error');
    }else
    {
        if( latitude!='' && longitude!='' )
        {
            if($.os.android){
                Navigation.do(
                    {
                        lat:latitude,
                        lon:longitude,
                        name:navigationFestAddressValue
                    },function(message) {
                    }, function(message) {
                        toastrTip('',message,'error');
                    });
            }else
            {
                Navigation.do(navigationFestAddressValue,function(message) {
                }, function(message) {
                    toastrTip('',message,'error');
                });
            }

        }else
        {
            toastrTip('','无法获取您的位置,请您在系统设置中打开定位功能!','error');
        }
    }
}


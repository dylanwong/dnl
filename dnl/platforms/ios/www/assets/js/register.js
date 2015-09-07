/**
 * Created by 翔 on 2015/3/1.
 */
var register_flag;
var selPhoneElementId;//选中的手机号元素
var selGetCodeElementId;//选中的获取验证码元素

function register() {
  //  register_enterpriseName
   // register_linkName
  //  register_phone
    var epName = $("#register_enterpriseName").val();
    var linkName = $("#register_linkName").val();
    var phone = $("#register_phone").val();
    var messageCode = $("#messageCode").val();
    //var password = $("#password").val();
    //var invitePopularizeCode = $("#popularizeCode").val();

    if(phone.trim()=='' || messageCode.trim()=='' )
    {
        errorPopup('请填写完全输入项!');
    } else
    {
        if(checkMobile('register_phone'))
        {
            var data = "?phone="+phone+"&epName="+epName+"&checkNum="+messageCode+
                "&linkName="+linkName;

            $.jsonP({
                url: baseUrl+"account/register.action"+data,
                success: function (data) {
                    if(data.isSucc)
                    {
                        errorPopup("您好，欢迎加入到哪啊，我们会尽快与您联系!");
                        login_panel();
                    }else
                    {
                        errorPopup(data.msg.substring(data.msg.indexOf('-')+1,data.msg.length));
                    }
                },
                error: function () {
                }
            });
        }
    }
}

function register_forword(flag,workerNo,pwd)
{
    var deviceNo = getDeviceNo();
    var os = getOs();
    register_flag = flag;
    getAjax(baseUrl+"account/login.action",{workerNo:workerNo,pwd:pwd,loginType:os,deviceNo:deviceNo},
        'login_succ_forregister(data)','login_fari_forregister()');
}



/**
 * 验证手机号是否存在
 */
function verify_phone(elementId,callback,flag) {
    var phone = $("#"+elementId).val();
    if (phone.length == 0) {
        return false;
    } else {
        if (checkMobile(elementId)) {

            $.jsonP({
                url: baseUrl+"account/verify_phone.action?phone=" + phone,
                success: function (data) {
                    if(flag == 1)
                    {
                        if(!data.isSucc)
                        {
                            errorPopup(data.msg.substring(data.msg.indexOf('-')+1,data.msg.length));
                            return false;
                        }else
                        {
                            if(callback!=undefined)
                            {
                                eval(callback);
                            }
                            return true;
                        }
                    }else if(flag == 2)
                    {
                        if(data.isSucc)
                        {
                            errorPopup('该手机号不存在!');
                            return false;
                        }else
                        {
                            if(callback!=undefined)
                            {
                                eval(callback);
                            }
                            return true;
                        }
                    }



                },
                error: function () {
                }
            });
        }else
        {
            return false;
        }
    }
}


/**
 * 验证手机是否存在回调函数
 * @param data
 */
function verify_phone_callback(data) {
    console.log(data);
}

/**
 * 发送短信
 * elementId
 * elementId2
 * flag 1：注册2：忘记密码
 */
function send_msg(elementId,elementId2,flag) {
    //debugger
    selPhoneElementId = elementId;
    selGetCodeElementId = elementId2;

    if (checkMobile(selPhoneElementId))
    {verify_phone
       (selPhoneElementId, "send(selPhoneElementId,selGetCodeElementId)",flag);
    }
}

function send()
{
    var phone = $("#"+selPhoneElementId).val();
    settime(selGetCodeElementId);
    $.jsonP({
        url: baseUrl+"msg/send_msg.action?phone="+phone,
        success: function (data) {
            console.log(data);
        },
        error: function () {
        }
    });
}

var countdown = 60;
function timeFunc(elementId)
{
    setTimeout(function () {
        settime(elementId)
    }, 1000);
}
function settime(elementId) {

    if (countdown == 0) {
        $("#" + elementId).html("获取验证码");
        $("#" + elementId).attr('disabled',false);
        countdown = 60;
    } else {
        $("#" + elementId).attr('disabled','disabled');
        $("#" + elementId).html("重新发送(" + countdown + ")");
        countdown--;
        timeFunc(elementId);
    }

}

function check_input()
{
    if($("#phone").val().trim()!="" &&
        $("#messageCode").val().trim()!="" && $("#password").val().trim()!="" &&
        ($("#password").val().length>6 && $("#password").val().length<15))
    {
        $("#submitRegister").attr('disabled',false)
    }else
    {
        $("#submitRegister").attr('disabled','disabled')
    }
}

function clear_register_form()
{
    $("#phone").val("");
    $("#messageCode").val("");
    $("#password").val("");
}
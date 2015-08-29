cordova.define("com.lovedudu.cordova.Navigation", function(require, exports, module) { var exec = require('cordova/exec');

//定义导航对象 与 方法
var Navigation = {
	do:function(key, successCallback, errorCallback) {
    	exec(successCallback, errorCallback, 'Navigation', 'do', [key])
	},
    route:function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'Navigation', 'route', [])
    }

};

module.exports= Navigation;


});

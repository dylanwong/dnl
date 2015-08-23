package com.sealinkin.dnl;

import android.app.Application;

import com.avos.avoscloud.AVAnalytics;
import com.avos.avoscloud.AVOSCloud;

public class Push extends Application {

	  @Override
	  public void onCreate() {
	    super.onCreate();
	    // 初始化应用信息
	    
        AVOSCloud.initialize(this, "yoE26vl5jJIc1WK9ETtCxMSA", "9k2q14mAEMeoQbWp94GHKpxu");
//	    // 启用崩溃错误统计
	    AVAnalytics.enableCrashReport(this.getApplicationContext(), true);
	    AVOSCloud.setDebugLogEnabled(true);
	  }
	}


package com.tongchengkeji;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import com.reactnative.ivpusic.imagepicker.MyFileProvider;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.util.Log;

import java.io.File;

public class RNApkInstallerNModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNApkInstallerNModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNApkInstallerN";
  }


  @ReactMethod
  public void install(String filePath) {
    // Intent intent = new Intent();
    // intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    // intent.setAction(Intent.ACTION_VIEW);
    // File apkFile = new File(filePath);
    // Log.d("ReactNative",filePath);
    // Uri apkUri;
    // try {
    //   if (Build.VERSION.SDK_INT >= 24) {
    //     intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    //     String authority = "com.testapp.fileprovider";//reactContext.getPackageName() + ".fileprovider"
    //     apkUri = MyFileProvider.getUriForFile(reactContext, authority, apkFile);
    //     Log.d("ReactNative","aaa");
    //   } else {
    //     apkUri = Uri.fromFile(apkFile);
    //   }
    //   intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
    //   reactContext.startActivity(intent);
    // } catch (Exception e) {
    //   promise.reject(e);
    // }
    String cmd = "chmod 777 " + filePath;
    try {
      Runtime.getRuntime().exec(cmd);
    } catch (Exception e) {
      e.printStackTrace();
    }
    try {
      if(Build.VERSION.SDK_INT >= 24){
        File apkFile = new File(filePath);
        String authority = "com.tongchengkeji.fileprovider";
        Uri apkUri = MyFileProvider.getUriForFile(reactContext, authority, apkFile);
        Intent install = new Intent(Intent.ACTION_VIEW);
        install.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        install.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        install.setDataAndType(apkUri,"application/vnd.android.package-archive");
        reactContext.startActivity(install);
      }else{
        Intent install = new Intent(Intent.ACTION_VIEW);
        install.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        install.setDataAndType(Uri.parse("file://" + filePath), "application/vnd.android.package-archive");
        reactContext.startActivity(install);
      }
    } catch (Exception e) {
      final String msg = e.toString();
      Log.d("ReactNativeJS",msg);
    }
  }
}
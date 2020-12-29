package com.tongchengkeji;

import com.alipay.sdk.app.PayTask;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import java.util.Map;
import android.util.Log;

public class AlipayModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public AlipayModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "Alipay";
  }


  @ReactMethod
  public void pay(final String orderInfo,final Promise promise) {
      Runnable payRunnable = new Runnable(){
          @Override
          public void run(){
              WritableMap map = Arguments.createMap();
              PayTask alipay = new PayTask(getCurrentActivity());
              Map<String,String> result = alipay.payV2(orderInfo,true);
              for(Map.Entry<String,String> entry:result.entrySet()){
                  map.putString(entry.getKey(),entry.getValue());
              }
              promise.resolve(map);
          }
      };
      Thread payThread = new Thread(payRunnable);
      payThread.start();
  }
}
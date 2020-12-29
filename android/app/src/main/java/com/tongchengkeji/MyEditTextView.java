package com.tongchengkeji;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReadableMap;
import android.app.ActionBar;
import android.graphics.Color;
import android.util.AttributeSet;
import android.widget.EditText;
import android.widget.RelativeLayout;

import androidx.core.view.ViewCompat;

public class MyEditTextView extends RelativeLayout {
    public EditText editText;
    public MyEditTextView(final ThemedReactContext context) {
        super(context);
        this.setBackgroundColor(Color.BLACK);
        this.editText = new EditText(context);
        this.editText.setMaxLines(1);
        this.editText.setHorizontallyScrolling(true);
        this.addView(this.editText);
        this.requestLayout();
        ViewCompat.setTranslationZ(this, 9999);
    }
}
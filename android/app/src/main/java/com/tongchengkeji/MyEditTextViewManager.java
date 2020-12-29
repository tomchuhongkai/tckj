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
import androidx.annotation.Nullable;
import android.app.ActionBar;
import android.content.Context;
import android.graphics.drawable.Drawable;
import android.widget.EditText;
import android.text.TextWatcher;
import android.text.Editable;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.InputType;
import android.text.style.ImageSpan;
import android.text.TextUtils;
import android.text.method.ScrollingMovementMethod;
import android.util.Log;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.PixelFormat;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.view.inputmethod.InputMethodManager;
import android.view.inputmethod.EditorInfo;
import android.view.View;
import android.view.Gravity;
import android.view.KeyEvent;
import android.widget.TextView;


import java.util.Map;
import com.tongchengkeji.MyEditTextLayout;

public class MyEditTextViewManager extends SimpleViewManager<MyEditTextLayout>{
    protected static final String REACT_CLASS="RCTEditText";
    ThemedReactContext mContext;
    private static final int COMMAND_INSERT_EMOJI=1;
    private static final int COMMAND_LOSE_FOCUS=2;
    private static final int COMMAND_DISMISS_KEYBOARD=3;
    private static final int COMMAND_CLEAR_EDITTEXT=4;
    private static final int COMMAND_DELETE_ITEM=5;
    @Override
    public String getName(){
        return REACT_CLASS;
    }

    @Override
    public MyEditTextLayout createViewInstance(ThemedReactContext context){
        this.mContext = context;
        MyEditTextLayout editTextLayout = new MyEditTextLayout(context, context.getCurrentActivity());        
        // editText.setSingleLine(true);
        // editText.setMaxLines(1);
        // // editText.setIncludeFontPadding(false);
        // editText.setPadding(0,0,0,0);
        // editText.setHorizontallyScrolling(true);
        // editText.setImeOptions(EditorInfo.IME_ACTION_DONE);//设置done按钮
        // editText.setEllipsize(TextUtils.TruncateAt.END);
        // editText.setInputType(InputType.TYPE_TEXT_VARIATION_PERSON_NAME);        
        
        return editTextLayout;
    }

    
    // @ReactProp(name="width")
    // public void setWidth(MyEditTextLayout layout, int width){
    //     layout.editText.setWidth(width==0?ActionBar.LayoutParams.WRAP_CONTENT:width);
    // }

    
    // @ReactProp(name="height")
    // public void setHeight(EditText editText, int height){
    //     editText.setHeight(height==0?ActionBar.LayoutParams.WRAP_CONTENT:height);
    // }
    @ReactProp(name="textSize")
    public void setTextSize(MyEditTextLayout layout, float textSize){
        layout.setTextSize(textSize);
    }

    @ReactProp(name="textColor")
    public void setTextColor(MyEditTextLayout layout, String textColor){
        layout.setTextColor(textColor);
    }

    @ReactProp(name="text")
    public void setText(MyEditTextLayout layout, String text){
        layout.setText(text);
    }

    // @ReactProp(name="style")
    // public void setStyle(EditText editText,@Nullable ReadableArray style){
        // int size = style != null ? style.size() : 0;
        // int paddingLeft=0;
        // int paddingTop=0;
        // int paddingRight=0;
        // int paddingBottom=0;
        // for(int i=0;i<size;i++){
        //     ReadableMap frame = style.getMap(i);
        //     Log.d("ReactNative",frame.toString());
        //     if(frame.hasKey("paddingLeft")){
        //         paddingLeft = frame.getInt("paddingLeft");
        //     }
        //     if(frame.hasKey("paddingTop")){
        //         paddingTop = frame.getInt("paddingTop");
        //     }
        //     if(frame.hasKey("paddingRight")){
        //         paddingRight = frame.getInt("paddingRight");
        //     }
        //     if(frame.hasKey("paddingBottom")){
        //         paddingBottom = frame.getInt("paddingBottom");
        //     }
        //     if(frame.hasKey("backgroundColor")){
        //         String backgroundColor = frame.getString("backgroundColor");
        //         editText.setBackgroundColor(Color.parseColor(backgroundColor));                
        //     }
        //     if(frame.hasKey("fontColor")){
        //         String fontColor = frame.getString("fontColor");
        //         editText.setTextColor(Color.parseColor(fontColor));
        //     }
        // }
    // }

    @Override
    public Map<String,Integer> getCommandsMap(){
        return MapBuilder.of("addEmoji",COMMAND_INSERT_EMOJI,"dismissKeyboard",COMMAND_DISMISS_KEYBOARD,"clearText",COMMAND_CLEAR_EDITTEXT,"deleteItem",COMMAND_DELETE_ITEM);
    }

    @Override
    public void receiveCommand(MyEditTextLayout layout,int commandType,@Nullable ReadableArray args){
        switch(commandType){
            case COMMAND_INSERT_EMOJI:
                if(args.size()>0){
                    String emojiText=args.getMap(0).getString("emoji");
                    int imageWidth=args.getMap(1).getInt("imageWidth");
                    layout.addToEditText(emojiText,imageWidth);
                }
                break;
            case COMMAND_DISMISS_KEYBOARD:
                Context context = this.mContext.getCurrentActivity().getBaseContext();
                InputMethodManager imm = (InputMethodManager)this.mContext.getCurrentActivity().getSystemService(context.INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(layout.getWindowToken(), 0);
                break;
            case COMMAND_CLEAR_EDITTEXT:
                layout.setText("");
                layout.setSelectionStart();
                break;
            case COMMAND_DELETE_ITEM:
                 Log.d("ReactNative","call delete item");
                layout.callDeleteCommand();
                break;
            default:
                break;

        }
    }
    
}
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
import android.app.Activity;
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
import android.view.MotionEvent;
import android.widget.TextView;
import android.widget.LinearLayout;
import android.os.IBinder;
import android.util.Log;
import java.util.HashMap;
import android.content.Context;
import android.view.ViewTreeObserver;

import androidx.core.view.ViewCompat;

public class MyEditTextLayout extends LinearLayout{
    private ReactContext reactContext;
    private EditText editText;
    int mPreviousLength;
    boolean mBackSpace;
    public MyEditTextLayout(Context context){
        super(context);
        reactContext = (ReactContext)context;
    }

    public MyEditTextLayout(Context context,Activity activity){
        super(context);
        reactContext = (ReactContext)context;
        LinearLayout layout = (LinearLayout)activity.getLayoutInflater().inflate(R.layout.activity_texteditor,null);
        this.addView(layout);

        editText = layout.findViewById(R.id.myEditText);
        editText.setImeOptions(EditorInfo.IME_ACTION_DONE);//设置done按钮
        //editText.setVerticalScrollBarEnabled(false);
        //editText.setIncludeFontPadding(false);
        editText.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                if (actionId == EditorInfo.IME_ACTION_DONE) {
                    WritableMap map = Arguments.createMap();
                    map.putString("text",editText.getText().toString());
                    sendMessageToEvent("onSubmit",map);
                    return true;
                }
                return false;
            }
        });
        View.OnClickListener listener = new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // showMyDialog();
                int _height = 0;
                if(editText.getLayout()!=null){
                    _height=editText.getLayout().getHeight()+editText.getCompoundPaddingTop()+editText.getCompoundPaddingBottom();
                }
                WritableMap map = Arguments.createMap();
                map.putString("text","true");
                map.putString("height",String.valueOf(_height));
                map.putString("lines","1");
                sendMessageToEvent("onFocus",map);
            }
        };
        editText.setOnClickListener(listener);
        editText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s,int start,int before,int count){
                if(mPreviousLength==-1){
                    mPreviousLength=0;
                }else {
                    mPreviousLength = s.length();
                }
            }
            @Override
            public void onTextChanged(CharSequence s,int start,int before,int count){

            }
            @Override
            public void afterTextChanged(Editable s){
                int lines = editText.getLineCount();
                int iteral=0;
                mBackSpace = mPreviousLength > s.length();
                if (mBackSpace) {
                    mPreviousLength=-1;
                    int start = editText.getSelectionStart();
                    if (start>0) {
                        String body = editText.getText().toString();
                        // 包括起始位置，不包括结束位置
                        String substring = body.substring(0, start);
                        // 预提取光标前最后一个表情的位置
                        int i = substring.lastIndexOf("[");
                        // 提取到了
                        if (i != -1) {
                            // 从预提取位置到光标直接的字符
                            CharSequence cs = substring.subSequence(i, start);
                            if(cs.toString().lastIndexOf("]")==-1){
                                // 是不是表情占位符
                                if (cs.toString().contains("[emoji_")) {
                                    // 是，就删除完整占位符
                                    s.delete(i, start);                                    
                                }
                            }
                        }
                    }
                }else{
                    if(lines>editText.getMaxLines()){
                        iteral=1;
                        String str = s.toString();
                        int cursorStart = editText.getSelectionStart();
                        String _last = str.substring(s.length()-1,s.length());
                        Log.d("ReactNative","last"+_last);
                        if(_last=="]"){
                            int i = str.lastIndexOf("[");
                            if(i!=-1){
                                CharSequence cs = str.subSequence(i, cursorStart);
                                // 是不是表情占位符
                                if (cs.toString().contains("[emoji_")) {
                                    // 是，就删除完整占位符
                                    s.delete(i, cursorStart);                                    
                                }
                            }
                        }else{
                           int _prev = str.length()-1;
                           s.delete(_prev, cursorStart);    
                           if(lines>editText.getMaxLines()){
                               this.afterTextChanged(s);
                           }  
                        }
                    }
                }
                if(iteral==0){
                    //避免重复更新
                    int _height = 0;
                    if(editText.getLayout()!=null){
                        _height=editText.getLayout().getHeight()+editText.getCompoundPaddingTop()+editText.getCompoundPaddingBottom();
                    }
                    WritableMap map = Arguments.createMap();
                    map.putString("text",s.toString());
                    map.putString("height",String.valueOf(_height));
                    map.putString("lines",String.valueOf(lines));
                    map.putString("type","textChange");
                    sendMessageToEvent("onChange",map);
                    editText.setSelection(editText.getText().length(),editText.getText().length());
                }
            }
        });
        ViewTreeObserver vto2 = editText.getViewTreeObserver();
        vto2.addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @SuppressWarnings("deprecation")
            @Override
            public void onGlobalLayout() {
                editText.getViewTreeObserver().removeGlobalOnLayoutListener(this);
                int mHeight = editText.getHeight();
                WritableMap map = Arguments.createMap();
                map.putString("height",String.valueOf(mHeight));
                map.putString("lines",String.valueOf(1));
                sendMessageToEvent("onChange",map);
            }
        });
    }
    protected void sendMessageToEvent(String event,WritableMap msg){
        this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(event,msg);
    }
    public void setTextColor(String textColor){
        this.editText.setTextColor(Color.parseColor(textColor));
    }

    public void setText(String text){
        this.editText.setText(text);        
    }

    public void setTextSize(float size){
        this.editText.setTextSize(size);
    }

    public void setSelectionStart(){
        this.editText.setSelection(0);
    }

    public IBinder getWindowToken(){
        return this.editText.getWindowToken();
    }

    public void callDeleteCommand(){
        int  keyCode = KeyEvent.KEYCODE_DEL;
        KeyEvent keyEventDown = new KeyEvent(KeyEvent.ACTION_DOWN, keyCode);
        KeyEvent keyEventUp = new KeyEvent(KeyEvent.ACTION_UP, keyCode);
        this.editText.onKeyDown(keyCode, keyEventDown);
        this.editText.onKeyUp(keyCode, keyEventUp);
        // String finalText = this.editText.getText().toString();
        // if(finalText.length()>1){
        //     String newStr = finalText.substring(0,finalText.length()-1);
        //     Log.d("ReactNative",newStr);
        //     this.editText.setText(newStr);
        //     this.editText.setSelection(newStr.length());
        // }
    }

    public void addToEditText(String emoji,int width){
        String emojiName="["+emoji+"]";
        SpannableString ss = new SpannableString(emojiName);
        Context context = this.reactContext.getCurrentActivity().getBaseContext();
        int id = context.getResources().getIdentifier(emoji, "drawable", context.getPackageName());
        
        Drawable drawable = this.reactContext.getCurrentActivity().getResources().getDrawable(id);
        Drawable newDrawable = zoomDrawable(drawable,width,width);
        newDrawable.setBounds(0,0,width,width);

        ImageSpan is = new ImageSpan(newDrawable){
            @Override
            public int getSize(Paint paint, CharSequence text, int start, int end,
                                Paint.FontMetricsInt fm) {
                Drawable d = getDrawable();
                Rect rect = d.getBounds();
                if (fm != null) {
                    Paint.FontMetrics fontMetrics = paint.getFontMetrics();
                    int fontHeight = (int) (fontMetrics.bottom - fontMetrics.top);
                    int drHeight = rect.bottom - rect.top;
                    int top = drHeight / 2 - fontHeight / 4;
                    int bottom = drHeight / 2 + fontHeight / 4;
                    fm.ascent = -bottom;
                    fm.descent = top;
                    fm.top = -bottom;
                    fm.bottom = top;
                }
                return rect.right;
            }
        };
        ss.setSpan(is,0,emojiName.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        int selectionEnd = editText.getSelectionEnd();
        Editable finalText = editText.getText();
        if (selectionEnd < finalText.length()){
            finalText.insert(selectionEnd,ss);
        }else{
            finalText.append(ss);
        }
        editText.setText(finalText);
        editText.computeScroll();
        //重新设置焦点位置
        Editable b = editText.getText();
        editText.setSelection(b.length());
        editText.requestFocus();

        //editText.setSelection(selectionEnd+ss.length());
    }
    private int dip2px(float dpValue) {
        Context context = this.reactContext.getCurrentActivity().getBaseContext();
        final float scale = context.getResources().getDisplayMetrics().density;
        return (int) (dpValue * scale + 0.5f);
    }
    private Drawable zoomDrawable(Drawable drawable, int w, int h) {
        int width = drawable.getIntrinsicWidth();
        int height = drawable.getIntrinsicHeight();
        Bitmap oldbmp = drawableToBitmap(drawable);
        Matrix matrix = new Matrix();
        float scaleWidth = ((float) w / width);
        float scaleHeight = ((float) h / height);
        matrix.postScale(scaleWidth, scaleHeight);
        Bitmap newbmp = Bitmap.createBitmap(oldbmp, 0, 0, width, height,
                matrix, true);
        return new BitmapDrawable(null, newbmp);
    }

    private Bitmap drawableToBitmap(Drawable drawable) {
        int width = drawable.getIntrinsicWidth();
        int height = drawable.getIntrinsicHeight();
        Bitmap.Config config = drawable.getOpacity() != PixelFormat.OPAQUE ? Bitmap.Config.ARGB_8888
                : Bitmap.Config.RGB_565;
        Bitmap bitmap = Bitmap.createBitmap(width, height, config);
        Canvas canvas = new Canvas(bitmap);
        drawable.setBounds(0, 0, width, height);
        drawable.draw(canvas);
        return bitmap;
    }
 
    @Override
    public void requestLayout() {
        super.requestLayout();
        post(measureAndLayout);
    }
    private final Runnable measureAndLayout = new Runnable() {
        @Override
        public void run() {
        measure(
            MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
        layout(getLeft(), getTop(), getRight(), getBottom());
        }
    };
}

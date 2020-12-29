import axios from 'axios'
// import DeviceStorage from '../tools/devicestorage'
import { PanResponder, DeviceEventEmitter } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import * as locals from '../tools/localdata'
import {WToast} from 'react-native-smart-tip'

var CancelToken = axios.CancelToken;
var cancel;
var siteStore = {};
export function getLoinUser() {
    return siteStore.config.userInfo;
}
export function CreateUUID() {
    var s = []
    var hexDigits = '0123456789ABCDEF'
    for (var i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    const uuid = s.join('')
    return uuid
}
export function ResizeImage(width, orginalWidth, orginalHeight) {
    var height = parseInt((orginalHeight / orginalWidth) * width);
    return { width: width, height: height };
}
export function GetFormatDate(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1).toString();
    var day = date.getDate().toString();
    var hour = date.getHours().toString();
    var minute = date.getMinutes().toString();
    var second = date.getSeconds();
    return year + '年' + month + '月' + day + '日' + ' ' + hour + ':' + minute + ":" + second;
}
export function GetFormatDateFromString(strTime) {
    strTime = strTime.replace(/-/g, '/');
    var date = new Date(strTime);
    return GetFormatDateNew(date)
}
export function GetFormatDateFromStringView(strTime) {
    strTime = strTime.replace(/-/g, '/');
    var date = new Date(strTime);
    return GetFormatDateNewWeek(date)
}
///时间格式为分秒一天两天年月日
export function GetFormatDateNewWeek(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1).toString();
    var day = date.getDate().toString();
    var hour = date.getHours().toString();
    var minute = date.getMinutes().toString();
    var second = date.getSeconds();

    var today = new Date();
    if ((today.getDay() - 7 > parseInt(day, 10)) || ((today.getMonth() + 1).toString() !== month) || (today.getFullYear().toString() !== year)) {
        return "一周前";
    }

    if (today.getDay() - 1 === parseInt(day, 10)) {
        //昨天的
        return "昨天";
    }
    if (hour < 12) {
        //上午
        return `上午 ${oneLetterToTwo(hour)}:${oneLetterToTwo(minute)}`;
    }
    if (hour === 12) {
        //上午
        return `中午 ${oneLetterToTwo(hour)}:${oneLetterToTwo(minute)}`;
    }
    if (hour > 12) {
        let _hour = hour - 12;
        //下午
        return `下午 ${oneLetterToTwo(_hour)}:${oneLetterToTwo(minute)}`;
    }

    return year + '年' + oneLetterToTwo(month) + '月' + oneLetterToTwo(day) + '日' + ' ' + oneLetterToTwo(hour) + ':' + oneLetterToTwo(minute);

}

///时间格式为分秒一天两天年月日
export function GetFormatDateNew(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1).toString();
    var day = date.getDate().toString();
    var hour = date.getHours().toString();
    var minute = date.getMinutes().toString();
    var second = date.getSeconds();

    var today = new Date();
    if (today.getFullYear().toString() !== year) {
        //不是几年的显示完整时间
        return year + '年' + oneLetterToTwo(month) + '月' + oneLetterToTwo(day) + '日';
    }
    if ((today.getMonth() + 1).toString() !== month) {
        //之前月份的
        return oneLetterToTwo(month) + '月' + oneLetterToTwo(day) + '日';
    }
    if (today.getDay() - 1 === parseInt(day, 10)) {
        //昨天的
        return "昨天";
    }
    if (hour < 12) {
        //上午
        return `上午 ${oneLetterToTwo(hour)}:${oneLetterToTwo(minute)}`;
    }
    if (hour === 12) {
        //上午
        return `中午 ${oneLetterToTwo(hour)}:${oneLetterToTwo(minute)}`;
    }
    if (hour > 12) {
        let _hour = hour - 12;
        //下午
        return `下午 ${oneLetterToTwo(_hour)}:${oneLetterToTwo(minute)}`;
    }

    return year + '年' + oneLetterToTwo(month) + '月' + oneLetterToTwo(day) + '日' + ' ' + oneLetterToTwo(hour) + ':' + oneLetterToTwo(minute);

}
function oneLetterToTwo(letter) {
    let _new = letter.toString();
    if (_new.length === 1) {
        _new = `0${_new}`;
    }
    return _new;
}

///时间格式为分秒一天两天年月日
export function GetFormatDateFormTimstamp(timestamp) {
    var date = new Date(timestamp);
    return GetFormatDateNew(date);
}

const AUTH_TOKEN = 'AUTHTOKEN';
console.log(axios.defaults.headers.common['Authorization'])
export function SetSiteToken(userInfo) {
    AsyncStorage.setItem(AUTH_TOKEN, JSON.stringify(userInfo));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userInfo.token}`;
}
export function SetAuthorization(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function SetToLocal(key, value) {
    AsyncStorage.setItem(key, JSON.stringify(value));
}
export function GetFromLocal(key) {
    return AsyncStorage.getItem(key);
}

export function RemoveFromLocal(key) {
    AsyncStorage.removeItem(key);
}

export function LogOut() {
    axios.defaults.headers.common['Authorization'] = '';
    AsyncStorage.removeItem(AUTH_TOKEN);
    siteStore.config.initUserInfo();
}

export function InitStore(_store) {
    siteStore = _store;
}

export function GetStore() {
    return siteStore;
}

export function showError(info) {
    siteStore.config.setMessage(info);
}

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // siteStore.config.changeLoading(true);
    return config;
}, function (error) {
    // 对请求错误做些什么
    // siteStore.config.changeLoading(false);
    // siteStore.config.setMessage(JSON.stringify(error));
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, (error) => {
    // 对响应错误做点什么
    if (error.response !== undefined) {
        switch (error.response.status) {
            case 401:
                LogOut();
                locals.ClearStorageInfo();
                if (global.CurrentNavigation !== undefined && global.CurrentNavigation !== null) {
                    global.CurrentNavigation.Navigation.replace('SignIn', { back: global.CurrentNavigation.GoBack, params: global.CurrentNavigation.Params === undefined ? null : global.CurrentNavigation.Params });
                } else {
                    DeviceEventEmitter.emit('SignIn')
                }
                break;
            case 403:
                siteStore.config.setMessage(error.response.data.error_description, 'error')
                break;
            case 400:
                if (error.response.data.error_description !== undefined)
                    siteStore.config.setMessage(error.response.data.error_description, 'error')
                if (error.response.data.message !== undefined) {
                    siteStore.config.setMessage(error.response.data.message, 'error');
                    Toast.info(error.response.data.message)
                }
                break;
            default:
                siteStore.config.setMessage(JSON.stringify(error.response), 'error')
                break;
        }
    }
    return Promise.reject(error);
});


export function GetRootUrl() {

    return 'http://tckj.irenou.com/';//'http://10.0.0.14:54405/'//
}

axios.defaults.baseURL = GetRootUrl();
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
let offset = -(new Date().getTimezoneOffset() / 60);
axios.defaults.headers.common['timezone'] = offset;
export function Get(url) {
    return axios.get(url, {
        cancelToken: new CancelToken(function executor(c) {
            // executor 函数接收一个 cancel 函数作为参数
            cancel = c;
        })
    })
        .catch(function (thrown) {
            if (axios.isCancel(thrown)) {
                return Promise.reject(thrown);
            } else {
                return Promise.reject(thrown);
            }
        });
}

export function Post(url, data) {
    return axios.post(url, data, {
        cancelToken: new CancelToken(function executor(c) {
            // executor 函数接收一个 cancel 函数作为参数
            cancel = c;
        })
    }).catch(function (thrown) {
        if (axios.isCancel(thrown)) {
            return Promise.reject(thrown);
        } else {

            return Promise.reject(thrown);
        }
    });
}

export function doRedirect(navigation) {
    if (siteStore.config.redirectPage !== null) {
        navigation.push(siteStore.config.redirectPage.routeName, siteStore.config.redirectPage.params);
        siteStore.config.setRedirect(null);
    }
}

export function CancelAxios() {
    if (cancel)
        cancel();
}

export function Sub_PanHandler() {
    return PanResponder.create({
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
            return true;
        },
        onPanResponderRelease: (evt, gestureState) => {
            if (global.DetailPage !== undefined && global.DetailPage !== null) {
                global.DetailPage.scrollDown(gestureState)
            }
        }
    })
}

export function GetLength(inputStr) {
    var str1 = inputStr;
    ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0, len = str1.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str1.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
            realLength += 1;
        } else {
            realLength += 2;
        }
    }
    return realLength;
};

export function Trim(str) {
    if (str && typeof str === "string") {
        return str.replace(/(^\s*)|(\s*)$/g, ""); //去除前后空白符
    }
}

export function LeftTrim(str) {
    if (str && typeof str === "string") {
        return str.replace(/(^\s*)$/g, ""); //去除前后空白符
    }
}

export function RejectHandler(err) {
    console.log(err);
}

export function SetSearchFilter(filter, callback, trueCallBack) {
    if (filter === undefined || filter === null) {
        filter = {};
    }
    let isValid = false;
    if (global.SearchInfo !== undefined && global.SearchInfo !== null && global.SearchInfo.type === filter.type
        && global.SearchInfo.name !== '' && global.SearchInfo.name !== filter.name) {
        filter.name = global.SearchInfo.name
        isValid = true;
    }
    if (trueCallBack) {
        if (isValid) {
            callback(filter);
        }
    } else {
        callback(filter);
    }
}


export const SystemInfo = {
    Version: '1.0.1'
}
 
export const Toast = {
    success: function (text, options) {
        let _option = Object.assign({}, {
            data: text,
            textColor: '#ffffff',
            backgroundColor: '#444444',
            duration: WToast.duration.SHORT, //1.SHORT 2.LONG
            position: WToast.position.CENTER, // 1.TOP 2.CENTER 3.BOTTOM
            // icon: <Image source={require('../data/img/success.png')} style={{width: 32,height: 32,resizeMode: 'contain'}}/>
        }, options)
         WToast.show(_option)
    },
    info:function (text, options) {
        let _option = Object.assign({}, {
            data: text,
            textColor: '#ffffff',
            backgroundColor: '#444444',
            duration: WToast.duration.SHORT, //1.SHORT 2.LONG
            position: WToast.position.CENTER, // 1.TOP 2.CENTER 3.BOTTOM
            // icon: <Image source={require('../data/img/success.png')} style={{width: 32,height: 32,resizeMode: 'contain'}}/>
        }, options)
         WToast.show(_option)
    },
      
    fail: function (text, options) {
        let _option = Object.assign({}, {
            data: text,
            textColor: '#ffffff',
            backgroundColor: '#444444',
            duration: WToast.duration.SHORT, //1.SHORT 2.LONG
            position: WToast.position.CENTER, // 1.TOP 2.CENTER 3.BOTTOM
            // icon: <Image source={require('../data/img/success.png')} style={{width: 32,height: 32,resizeMode: 'contain'}}/>
        }, options)
         WToast.show(_option)
    },
}
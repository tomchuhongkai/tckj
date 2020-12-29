/**
 * Created by zhuoy on 2017/6/27.
 * 屏幕工具类
 * ui设计基准,iphone 6
 * width:750
 * height:1334
 */

/*
 设备的像素密度，例如：
 PixelRatio.get() === 1          mdpi Android 设备 (160 dpi)
 PixelRatio.get() === 1.5        hdpi Android 设备 (240 dpi)
 PixelRatio.get() === 2          iPhone 4, 4S,iPhone 5, 5c, 5s,iPhone 6,xhdpi Android 设备 (320 dpi)
 PixelRatio.get() === 3          iPhone 6 plus , xxhdpi Android 设备 (480 dpi)
 PixelRatio.get() === 3.5        Nexus 6       */
import {
    Dimensions,
    PixelRatio,
} from 'react-native';
import { getLoinUser } from '../tools/tool';

// //UI设计图的宽度
// const designWidth = 750
// //UI设计图的高度
// const designHeight = 1334
// export const deviceWidth = Dimensions.get('window').width;      //设备的宽度
// export const deviceHeight = Dimensions.get('window').height;    //设备的高度
// let fontScale = PixelRatio.getFontScale();                      //返回字体大小缩放比例

// let pixelRatio = PixelRatio.get();      //当前设备的像素密度
// const defaultPixel = 2;                           //iphone6的像素密度
// //px转换成dp
// const w2 = 750 / defaultPixel;
// const h2 = 1334 / defaultPixel;
// const scale = Math.min(deviceHeight / h2, deviceWidth / w2);   //获取缩放比例

// const unitWidth = deviceWidth / designWidth
// //计算手机屏幕高度对应设计图高度的单位高度
// const unitHeight = deviceHeight / designHeight
// /**
//  * 设置text为sp
//  * @param size sp
//  * return number dp
//  */
// export function setSpText(size: number) {
//     size = Math.round((size * scale + 0.5) * pixelRatio / fontScale);
//     return size / defaultPixel;
// }

// export function scaleSize(size: number) {
//     size = Math.round(size * scale + 0.5);
//     return size / defaultPixel;
// }

// export function scaleWidth(width: number) {
//     return width * unitWidth;
// }

// export function scaleHeight(height: number) {
//     return height * unitHeight;
// }
/**
 * Created by qianxin on 17/6/1.
 * 屏幕工具类
 * ui设计基准,iphone 6
 * width:750
 * height:1334
 */
// 获取屏幕的dp
let screenW = Dimensions.get('window').width;
let screenH = Dimensions.get('window').height;
let fontScale = PixelRatio.getFontScale();
let pixelRatio = PixelRatio.get();
// 高保真的宽度和告诉
const designWidth = 750.0;
const designHeight = 1334.0;

// 根据dp获取屏幕的px
let screenPxW = PixelRatio.getPixelSizeForLayoutSize(screenW);
let screenPxH = PixelRatio.getPixelSizeForLayoutSize(screenH);

/**
 * 设置text
 * @param size  px
 * @returns {Number} dp
 */
export function setSpText(size) {
    var scaleWidth = screenW / designWidth;
    var scaleHeight = screenH / designHeight;
    var scale = Math.min(scaleWidth, scaleHeight);
    size = Math.round(size * scale / fontScale + 0.5);
    return size;
}

export function scaleSize(size) {
    var scaleWidth = size * screenPxW / designWidth;
    size = Math.round((scaleWidth / pixelRatio + 0.5));
    return size;
}

/**
 * 设置高度
 * @param size  px
 * @returns {Number} dp
 */
export function scaleSizeH(size) {
    var scaleHeight = size * screenPxH / designHeight;
    size = Math.round((scaleHeight / pixelRatio + 0.5));
    return size;
}

/**
 * 设置宽度
 * @param size  px
 * @returns {Number} dp
 */
export function scaleSizeW(size) {
    var scaleWidth = size * screenPxW / designWidth;
    size = Math.round((scaleWidth / pixelRatio + 0.5));
    return size;
}
export const clearBoxPng = require("../../images/clearbox.png")
export const defaultAvatar = require("../../images/avatar.png")
export const config = {
    headerHeight: scaleSizeW(90)
}

export function IsInItemSelector(array, value) {
    if (array.findIndex(x => x === value) !== -1) {
        return true;
    }
    return false;
}
export function AddToItemSelector(array, value) {
    let newArray = array.slice();
    let _index = array.findIndex(x => x === value);
    if (_index === -1) {
        newArray.push(value);
    }
    else {
        newArray.splice(_index, 1);
    }
    return newArray;
}
export function GetSelectorValues(array, value) {
    let newArray = array.slice();
    let _v = [];
    if (value !== undefined && value.length > 0) {
        array.forEach(element => {
            if (value.findIndex(x => x === element.key) !== -1) {
                _v.push(element.value)
            }
        });
    }
    return _v.join('，')
}

export function GetListValue(list, key) {
    let newArray = list.slice();
    let items = newArray.filter(x => x.key === key);
    if (items.length > 0) {
        return items[0].value;
    }
    return "";
}

export const RequirementFields = {
    gender: null,
    age: null,
    height: null,
    maritalStatus: null,
    hasKids: null,
    figure: null,
    likePet: null,
    homeTownId: null,
    cityId: null,
    occupation: null,
    monthSalary: null,
    constellations: null,
    likeSmoke: null,
    drink: null,
    education: null,

    consumptionView: null,
    canLongDistanceLove: null,
    activeInFeeling: null,
    wantChild: null,
    familyCareerTendency: null,
    liveWithParents: null,
    waysOfTogether: null,

    diet: null,
    workAndRest: null,
    lifeStyle: null,
    houseWork: null,
    workStyle: null,
    workSystem: null,
}

export const FriendsCirclePages = {
    Focused: 'focused',
    Recommend: 'recommend',
    Funny: 'funny',
    Video: 'video',
    City: 'city'
}

export const Enums = {
    Requirements: {
        kidsData: [{ key: "1", value: '无' }, { key: "2", value: '有' }, { key: "3", value: '无所谓' }],
        smokeData: [{ key: "1", value: '是' }, { key: "2", value: '否' }, { key: "3", value: '无所谓' }],
        drinkData: [{ key: "1", value: '滴酒不沾' }, { key: "2", value: '社交饮酒' }, { key: "3", value: '当代酒仙' }, { key: "4", value: '无所谓' }],
        educationData: [
            { key: "1", value: '小学及以下' },
            { key: "2", value: '初中及以上' },
            { key: "3", value: '高中/中专/技校及以上' },
            { key: "4", value: '大学专科及以上' },
            { key: "5", value: '大学本科及以上' },
            { key: "6", value: '研究生及以上' }
        ],
        monthSalaryData: [
            { key: "1", value: '学生，尚未工作' },
            { key: "2", value: '3000以内' },
            { key: "3", value: '3000-7000' },
            { key: "4", value: '7000-15000' },
            { key: "5", value: '15000-30000' },
            { key: "6", value: '30000-50000' },
            { key: "7", value: '50000以上' },
            { key: "8", value: '保密' },
            { key: "9", value: '无所谓' },
        ],
        manMaritalStatusData: [{ key: "1", value: '单身' }, { key: "2", value: '离婚' }, { key: "3", value: '绿衣（丧偶）' }, { key: "4", value: '无所谓' }],
        womanMaritalStatusData: [{ key: "1", value: '单身' }, { key: "2", value: '离婚' }, { key: "3", value: '葛生（丧偶）' }, { key: "4", value: '无所谓' }],
        wenShenStateData: [{ key: "1", value: '有' }, { key: "2", value: '无' }, { key: "3", value: '无所谓' }],
    },
    kidsData: [{ key: "1", value: '无' }, { key: "2", value: '有' }],
    smokeData: [{ key: "1", value: '是' }, { key: "2", value: '否' }],
    manMaritalStatusData: [{ key: "1", value: '单身' }, { key: "2", value: '离婚' }, { key: "3", value: '绿衣（丧偶）' }],
    WomanMaritalStatusData: [{ key: "1", value: '单身' }, { key: "2", value: '离婚' }, { key: "3", value: '葛生（丧偶）' }],
    genderData: [{ key: "1", value: '男' }, { key: "2", value: '女' }],
    drinkData: [{ key: "1", value: '滴酒不沾' }, { key: "2", value: '社交饮酒' }, { key: "3", value: '当代酒仙' }],
    figureManData: [{ key: "1", value: '消瘦苗条' }, { key: "2", value: '自然线条' }, { key: "3", value: '紧致结实' }, { key: "4", value: '肌肉健美' }, { key: "5", value: '胖壮多肉' }],
    figureWomanData: [{ key: "11", value: '标准身材' }, { key: "12", value: '丰满微胖型' }, { key: "13", value: '纤细苗条型' }, { key: "14", value: '运动健身型' }, { key: "15", value: '偏胖多福型' }],
    likePetData: [{ key: "1", value: '喜欢' }, { key: "2", value: '不喜欢' }, { key: "3", value: '无所谓' }],
    educationData: [
        { key: "1", value: '小学及以下' },
        { key: "2", value: '初中' },
        { key: "3", value: '高中/中专/技校' },
        { key: "4", value: '大学专科' },
        { key: "5", value: '大学本科' },
        { key: "6", value: '研究生及以上' }
    ],
    occupationData: [
        { key: "1", value: '制造业' },
        { key: "2", value: '教育/培训' },
        { key: "3", value: '互联网' },
        { key: "4", value: '计算机软件' },
        { key: "5", value: '金融/银行/保险/证券' },
        { key: "6", value: '专业服务' },
        { key: "7", value: '政府/公共事业' },
        { key: "8", value: '零售业' },
        { key: "9", value: '交通/运输/物流' },
        { key: "10", value: '计算机硬件及网络设备' },
        { key: "11", value: '仪器仪表及工业自动化' },
        { key: "12", value: '学术/研究' },
        { key: "13", value: '医疗卫生' },
        { key: "14", value: '设计' },
        { key: "15", value: '其它' },
    ],
    monthSalaryData: [
        { key: "1", value: '学生，尚未工作' },
        { key: "2", value: '3000元以内' },
        { key: "3", value: '3000元-7000元' },
        { key: "4", value: '7000元-15000元' },
        { key: "5", value: '15000元-30000元' },
        { key: "6", value: '30000元-50000元' },
        { key: "7", value: '50000元以上' }
    ],
    bloodData: [
        { key: "1", value: 'A型' },
        { key: "2", value: 'B型' },
        { key: "3", value: 'AB型' },
        { key: "4", value: 'O型' },
    ],
    wenShenStateData: [{ key: "1", value: '有' }, { key: "2", value: '无' }],
    constellationsData: [
        { key: "1", value: "白羊座" }, { key: "2", value: "金牛座" }, { key: "3", value: "双子座" }, { key: "4", value: "巨蟹座" },
        { key: "5", value: "狮子座" }, { key: "6", value: "处女座" }, { key: "7", value: "天秤座" }, { key: "8", value: "天蝎座" },
        { key: "9", value: "射手座" }, { key: "10", value: "摩羯座" }, { key: "11", value: "水瓶座" }, { key: "12", value: "双鱼座" },
    ],
    dietData: [{ key: "1", value: '微波炉大师' }, { key: "2", value: '外卖达人' }, { key: "3", value: '简单家料理' }, { key: "4", value: '叫我厨神' }],
    workAndRestData: [{ key: "1", value: '早鸟族' }, { key: "2", value: '夜猫子' }, { key: "3", value: '正常作息' }],
    lifeStyleData: [{ key: "1", value: '亲近自然' }, { key: "2", value: '亲友聚会' }, { key: "3", value: '御宅族' }, { key: '4', value: '挥汗如雨' }],
    houseWorkData: [{ key: "1", value: '洁癖' }, { key: "2", value: '经常做' }, { key: "3", value: '很少' }],
    workStyleData: [{ key: "1", value: '固定' }, { key: "2", value: '需要调动' }, { key: "3", value: '空中飞人' }],
    workSystemData: [{ key: "1", value: '朝九晚五' }, { key: "2", value: '加班奋斗' }, { key: "3", value: '夜班一族' }, { key: "4", value: '创业者' }],
    longDistanceLoveData: [{ key: "1", value: '接受' }, { key: "2", value: '不接受' }, { key: "3", value: '无所谓' }],
    consumptionViewData: [{ key: "1", value: '享受生活，娱乐开销为主' }, { key: "2", value: '积极存钱，成长开销为主' }, { key: "3", value: '节约生活，刚性开销为主' }],
    activeInFeelingData: [{ key: "1", value: '主动' }, { key: "2", value: '被动' }, { key: "3", value: '不确定' }],
    wantChildData: [{ key: "1", value: '要' }, { key: "2", value: '不要' }, { key: "3", value: '暂时不要' }],
    familyCareerTendencyData: [{ key: "1", value: '家庭更重要' }, { key: "2", value: '事业更重要' }, { key: "3", value: '家庭事业平衡' }],
    liveWithParentsData: [{ key: "1", value: '同住' }, { key: "2", value: '偶尔一起住' }, { key: "3", value: '不住在一起' }],
    waysOfTogetherData: [{ key: "1", value: '需要各自空间' }, { key: "2", value: '缺乏安全感需要陪伴' }, { key: "3", value: '正常相处' }],
    machinetype: [
        { key: "1", value: '单机头' },
        { key: "2", value: '双机头' },
        { key: "3", value: '单双复合' },
    ],
}


export const Icons = {
    Vip_Unselected: require('../../images/vip-unselected.png'),
    Vip_Selected: require('../../images/vip-selected.png'),
    TrueName_Unselected: require('../../images/truename.png'),
    TrueName_Selected: require('../../images/truename-selected.png'),
    RightPoint: require('../../images/right-point.png'),
    Important: require('../../images/important.png'),
    ChatKeyboardDelete: require('../../images/icon-delete.png'),
    DeleteIcon: require('../../images/cha.png'),
    LocationIcon:require('../../images/circle-active.png'),
    ShiMingIcon:require('../../images/shiminged.png'),
    YearCardIcon:require('../../images/year-icon.png')
}

export const EnumsFunc = {
    GetHearFateBasic: GetHearFateBasic,
    GetHearFateHabit: GetHearFateHabit,
    GetHearFateSensework: GetHearFateSensework
}

function GetHearFateBasic(name, BasicModel, ) {
    var userInfo = getLoinUser();
    let values = BasicModel[name] === undefined ? [] : BasicModel[name].value;
    switch (name) {
        case "age":
            if (BasicModel.age.value.indexOf('_') !== -1 && BasicModel.age.value !== "0_0") {
                let _ages = BasicModel.age.value.split('_');
                return `${_ages[0]}岁-${_ages[1]}岁`;
            }
            return "";
        case "height":
            if (BasicModel.height.value.indexOf('_') !== -1 && BasicModel.height.value !== "0_0") {
                let _heights = BasicModel.height.value.split('_');
                return `${_heights[0]}cm-${_heights[1]}cm`;
            }
            return "";
        case 'maritalStatus':
            let maritalStatuses = [];
            if (userInfo.gender === 1) {
                //自己是男
                maritalStatuses = Enums.Requirements.womanMaritalStatusData;
            } else {
                //自己是女
                maritalStatuses = Enums.Requirements.manMaritalStatusData;
            }
            let _maritalStatuses = maritalStatuses.filter(x => x.key === BasicModel[name].value);
            return _maritalStatuses.length > 0 ? _maritalStatuses[0].value : '';
        case 'hasKids':
            let kidsData = Enums.Requirements.kidsData.filter(x => x.key === BasicModel[name].value);
            return kidsData.length > 0 ? kidsData[0].value : '';
        case 'figure':
            let figureData = [];
            if (userInfo.gender === 1) {
                //自己是男
                figureData = Enums.figureWomanData;
            } else {
                //自己是女
                figureData = Enums.figureManData;
            }
            let _Figures = [];
            if (typeof (values) !== 'string') {
                values.forEach(figure => {
                    let figureNewData = figureData.filter(x => x.key === figure);
                    if (figureNewData.length > 0){
                        _Figures.push(figureNewData[0].value);
                    }
                });
            }
            return _Figures.join(',');
        case 'likePet':
            let likePetData = Enums.likePetData.filter(x => x.key === BasicModel[name].value);
            return likePetData.length > 0 ? likePetData[0].value : '';
        // case 'homeTownId':
        // case 'cityId':
        //     let dataNames = [];
        //     if (typeof (values) !== 'string') {
        //         dataNames = values.map(element => {
        //             return element.name;
        //         });
        //     }
        //     return dataNames.join(',');
        case 'occupation':
            let _occupationData = [];
            if (typeof (values) !== 'string') {
                _occupationData = values.map(element => {
                    let _data = Enums.occupationData.filter(x => x.key === element);
                    return _data.length > 0 ? _data[0].value : '';
                });
            }
            return _occupationData.join(',');
        case 'monthSalary':
            let _monthSalaryData = [];
            if (typeof (values) !== 'string' && typeof (values) !== 'number') {
                _monthSalaryData = values.map(element => {
                    let _data = Enums.monthSalaryData.filter(x => x.key === element);
                    return _data.length > 0 ? _data[0].value : '';
                });
            }
            return _monthSalaryData.join(',');
        case 'constellations':
            let _constellationsData = [];
            if (typeof (values) !== 'string') {
                _constellationsData = values.map(element => {
                    let _data = Enums.constellationsData.filter(x => x.key === element);
                    return _data.length > 0 ? _data[0].value : '';
                });
            }
            return _constellationsData.join(',');
        case 'likeSmoke':
            let smokeData = Enums.Requirements.smokeData.filter(x => x.key === BasicModel[name].value);
            return smokeData.length > 0 ? smokeData[0].value : '';
        case 'drink':
            let drinkData = Enums.Requirements.drinkData.filter(x => x.key === BasicModel[name].value);
            return drinkData.length > 0 ? drinkData[0].value : '';
        case 'education':
            let _educationData = [];
            if (typeof (values) !== 'string' && typeof (values) !== 'number') {
                _educationData = values.map(element => {
                    let _data = Enums.educationData.filter(x => x.key === element);
                    return _data.length > 0 ? _data[0].value : '';
                });
            }
            return _educationData.join(',');
        case 'blood':
            if (BasicModel[name] !== undefined) {
                let bloodData = Enums.bloodData.filter(x => x.key === BasicModel[name].value);
                return bloodData.length > 0 ? bloodData[0].value : '';
            } else {
                return "";
            }
        case 'wenShenState':
            if (BasicModel[name] !== undefined) {
                let wenShenStateData = Enums.Requirements.wenShenStateData.filter(x => x.key === BasicModel[name].value);
                return wenShenStateData.length > 0 ? wenShenStateData[0].value : '';
            } else {
                return "";
            }
        default:
            return BasicModel[name] !== undefined ? BasicModel[name].value : '';
    }
}

function GetHearFateHabit(name, HabitModel) {
    let values = HabitModel[name].value;
    let resultData = [];
    let source = name === 'diet' ? Enums.dietData :
        name === 'workAndRest' ? Enums.workAndRestData :
            name === 'lifeStyle' ? Enums.lifeStyleData :
                name === 'houseWork' ? Enums.houseWorkData :
                    name === 'workStyle' ? Enums.workStyleData :
                        name === 'workSystem' ? Enums.workSystemData :
                            [];
    if (typeof (values) !== 'string' && values !== undefined && values.length > 0) {
        resultData = values.map(element => {
            let _data = source.filter(x => x.key === element);
            return _data.length > 0 ? _data[0].value : '';
        });
    }
    return resultData.join(',');
}

function GetHearFateSensework(name, SenseWorthModel) {
    let values = SenseWorthModel[name].value;
    let resultData = [];
    let source = name === 'consumptionView' ? Enums.consumptionViewData :
        name === 'activeInFeeling' ? Enums.activeInFeelingData :
            name === 'waysOfTogether' ? Enums.waysOfTogetherData :
                name === 'canLongDistanceLove' ? Enums.longDistanceLoveData :
                    name === 'wantChild' ? Enums.wantChildData :
                        name === 'familyCareerTendency' ? Enums.familyCareerTendencyData :
                            name === 'liveWithParents' ? Enums.liveWithParentsData :
                                [];
    switch (name) {
        case "consumptionView":
        case "activeInFeeling":
        case 'waysOfTogether':
            if (typeof (values) !== 'string' && values !== undefined && values.length > 0) {
                resultData = values.map(element => {
                    let _data = source.filter(x => x.key === element);
                    return _data.length > 0 ? _data[0].value : '';
                });
            }
            return resultData.join(',');
        case "canLongDistanceLove":
        case 'wantChild':
        case 'familyCareerTendency':
        case 'liveWithParents':
            resultData = source.filter(x => x.key === SenseWorthModel[name].value);
            return resultData.length > 0 ? resultData[0].value : '';
        default:
            return SenseWorthModel[name] !== undefined ? SenseWorthModel[name].value : '';
    }
}

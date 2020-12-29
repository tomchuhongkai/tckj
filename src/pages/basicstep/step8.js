import React, { Component } from "react";
import { observer, inject } from 'mobx-react'
import { Text, View, TouchableOpacity, Image, DatePickerAndroid } from "react-native";
import commonStyle from '../../tools/commonstyles'
import { scaleSizeW,setSpText, Icons } from "../../tools/util";
import DatePicker from 'react-native-datepicker'
import CustomizeHeader from '../components/customizeheader'


@inject('store')
@observer
class step8 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Disabled: props.store.userprofile.profile.strBirth === "" ? true : false
        };
        this.onChange = value => {
            let _date = new Date(value);
            let _t = '';
            let year = _date.getFullYear();
            let month = _date.getMonth() + 1;
            let day = _date.getDate();
            _t = this.Calculator.shengxiao(_date) + " " + this.Calculator.astro(month, day);
            this.setState({
                Disabled: false,
            })
            this.props.store.userprofile.changeProfile({
                birthYear: year,
                birthMonth: month,
                birthDay: day,
                strBirth: value,
                strShengXiao: _t
            })

        };

    }

    Calculator = function () {
        function getShengXiao(birth) {
            birth += '';
            var len = birth.length;
            if (len < 4 && len != 2) {
                return false;
            }
            if (len == 2) {
                birth - 0 > 30 ? birth = '19' + birth : birth = '20' + birth;
            }
            var year = (new Date(birth)).getFullYear();
            var arr = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊'];
            return /^\d{4}$/.test(year) ? arr[year % 12] : false;
        }

        function getAstro() {
            var params = {};
            var c = function (d) {
                return parseInt(d, 10);
            }
            switch (arguments.length) {
                case 1:
                    var s = arguments[0] + '', b = s.length;
                    if (b < 3 || b > 8) {
                        return false;
                    }
                    if (b == 3) {
                        params['mouth'] = c(s.slice(0, 1));
                    } else if (b == 4) {
                        params['mouth'] = c(s.slice(0, 2));
                    } else if (b == 6) {
                        params['mouth'] = c(s.slice(2, 4));
                    } else if (b == 8) {
                        params['mouth'] = c(s.slice(4, 6));
                    }
                    params['day'] = c(s.slice(-2));
                    break;
                case 2:
                    params['month'] = c(arguments[0]);
                    params['day'] = c(arguments[1]);
                    break;
                default:
                    return false;
                    break;
            }
            return "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯".substr(params['month'] * 2 - (params['day'] < [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22][params['month'] - 1] ? 2 : 0), 2);
        }

        return {
            shengxiao: getShengXiao,
            astro: getAstro
        }
    }()

    nextStep = () => {
        const { next, saveState } = this.props;

        // Save state for use in other steps
        saveState({ name: "samad" });
        // Go to next step
        next();
    };

    goBack() {
        const { back } = this.props;
        // Go to previous step
        back();
    }

    render() {
        const { profile } = this.props.store.userprofile;
        return (
            <View style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff' }]}>
                <View style={{ width: '100%', height: '100%' }} contentContainerStyle={commonStyle.scrollViewContainer}>
                    <View style={{ paddingHorizontal: scaleSizeW(40),paddingVertical:scaleSizeW(40)}}>
                        <View><Text style={{ color: "#333", fontSize: setSpText(48), marginBottom: scaleSizeW(30) }}>接着你破壳日</Text></View>
                        <View><Text style={{ color: "#9499a9", fontSize: setSpText(28), marginBottom: scaleSizeW(70) }}>告诉我们您是什么时候出生的</Text></View>
                        <View style={{ borderBottomColor: "#eee", borderBottomWidth: scaleSizeW(1), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <DatePicker
                                style={{ width: '50%', borderBottomWidth: 0 }}
                                date={profile.strBirth}
                                mode="date"
                                placeholder="请选择"
                                format="YYYY-MM-DD"
                                // minDate={`${(new Date().year - 18)}-01-01`}
                                // maxDate={`${(new Date().year - 60)}-01-01`}
                                confirmBtnText="确定"
                                cancelBtnText="取消"
                                androidMode={'default'}
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 0
                                    },
                                    dateInput: {
                                        marginLeft: 36,
                                        borderWidth: 0,
                                    }
                                    // ... You can check the source to find the other keys.
                                }}
                                onDateChange={(date) => { this.onChange(date) }}
                            />
                            <Text>{profile.strShengXiao}</Text>
                        </View>
                        <View style={[commonStyle.describe, commonStyle.describe_center, { marginTop: scaleSizeW(40) }]}>
                            <Image source={Icons.Important} style={commonStyle.describe_image} />
                            <Text style={commonStyle.describe_text}>出生日期一旦确定将不能被修改</Text>
                        </View>
                        <View style={{ marginTop: scaleSizeW(60) }}>
                            <TouchableOpacity onPress={this.nextStep} disabled={this.state.Disabled ? true : false} style={[commonStyle.fullWidthButton, this.state.Disabled ? commonStyle.fullWidthButton_Disabled : null]}>
                                <Text style={commonStyle.fullWidthButton_text}>下一步</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <CustomizeHeader goBack={() => { this.goBack() }} />
            </View>
        );
    }
}

export default step8;
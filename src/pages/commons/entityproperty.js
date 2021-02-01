import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native'
import Textarea from 'react-native-textarea'
import CustomPicker from '../components/custompicker'
import MultiplePicker from '../components/multiplepicker'
import RadioButton from '../components/radioButton'
import Checkbox from '../components/checkbox'
import { scaleSize, scaleSizeW, setSpText } from "../../tools/util";
import commonStyle from '../../tools/commonstyles'
import DatePicker from 'react-native-datepicker'
import { Toast } from '../../tools/tool'

class EntityProperty extends Component {
    constructor(props) {
        super(props);
    }
    setShowHideAndList = (item) => {
        var parentValue = "";
        let itemsdisplay = [];
        let isShow = item.value.isShow;
        let _items = item.value.items;
        if (item.value.relatedEntityPropertyId != 0) {
            var parentPropertyEntities = this.props.data.filter(c => c.value.id == item.value.relatedEntityPropertyId);
            if (parentPropertyEntities.length > 0) {
                var items = this.props.list.filter(x => x.Key === parentPropertyEntities[0].key);
                if (items.length > 0) {
                    parentValue = items[0].Value;
                }
            }
            if (item.value.propertyType == 25 ||
                item.value.propertyType == 35 ||
                item.value.propertyType == 40) {
                //dropdown

                if (item.value.relatedEntityPropertyValue !== null && item.value.relatedEntityPropertyValue !== '') {
                    if (parentValue !== item.value.relatedEntityPropertyValue) {
                        isShow = false;
                    } else {
                        isShow = true;
                    }
                } else {
                    isShow = true;
                    _items = item.value.items
                    if (parentValue !== null && parentValue !== '') {
                        _items = _items.filter(x => x.indexOf(parentValue) !== -1);
                    }
                }

            }
            else if (item.value.propertyType == 45)//trueFalse
            {
                if (parentValue === "是") {
                    isShow = true;
                } else {
                    isShow = false;
                }
            } else {
                if (item.value.relatedEntityPropertyValue !== null && item.value.relatedEntityPropertyValue !== '') {
                    if (parentValue === item.value.relatedEntityPropertyValue) {
                        isShow = true;
                    } else {
                        isShow = false;
                    }
                }
            }
        }
        if (_items.length > 0) {
            _items.map((subitem, subindex) => {
                if (subitem.indexOf(parentValue + "-") !== -1) {
                    subitem = subitem.split('-')[1];
                }
                itemsdisplay.push({ key: subitem, value: subitem })
            })
        }
        return { isShow, itemsdisplay };
    }
    clearRelatedSubInfo = (item) => {
        let that = this;
        if (item.value.isRelatedTop) {
            var subs = this.props.data.filter(x => x.value.relatedEntityPropertyId === item.value.id);
            if (subs.length > 0) {
                subs.map((subItem, subIndex) => {
                    if (subItem.value.propertyType == 25 ||
                        subItem.value.propertyType == 35 ||
                        subItem.value.propertyType == 40) {
                        that.props.onChange(subItem.key, '请选择');
                    } else {
                        that.props.onChange(subItem.key, '');
                    }
                })
            }
        }
    }
    hasrequired = (require) => {
        if (require) {
            return (<Text style={styles.required}>*</Text>);
        }
        else {
            return null;
        }
    }
    renderDropDownList = (item, index, itemval) => {
        const { itemsdisplay, isShow } = this.setShowHideAndList(item);
        if (!isShow) {
            return <View key={index}></View>;
        }
        var itemkey = item.key;
        let _containerStyle = [styles.pinggucontainer];
        if (this.props.style !== undefined) {
            _containerStyle.push(this.props.style);
        }

        return (
            <View key={index} style={_containerStyle}>
                <View style={styles.selectline}>
                    <Text style={styles.selname}>{item.value.displayName} {item.value.isRequired ? (<Text style={styles.required}>*</Text>) : null}</Text>
                    <View style={{ flex: 1 }}>
                        <CustomPicker Items={itemsdisplay}
                            style={{ height: scaleSizeW(100) }}
                            textStyle={{ alignSelf: 'flex-start', fontSize: scaleSizeW(28), color: "#333" }}
                            onChange={(itemValue, obj) => {
                                this.props.onChange(itemkey, itemValue);
                                this.clearRelatedSubInfo(item)
                            }}
                            SelectedValue={"0"}
                            value={itemval}
                            keyName={'value'} valueName={'value'}
                            renderButton={(func, text, value, containStyle, txtStyle) => {
                                return (<TouchableOpacity
                                    onPress={() => {
                                        func();
                                    }}>
                                    <View style={[{ borderBottomWidth: 0, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }]}>
                                        <Text style={{ fontSize: scaleSizeW(30), color: '#9b9b9b' }}>{itemval}</Text>
                                        <Image source={require('../../../images/arrow-right.png')} style={styles.selicon} />
                                    </View>
                                </TouchableOpacity>)
                            }} />
                    </View>
                </View>
            </View>
        )
    }
    renderSingleButton = (item, index, itemval) => {
        const { itemsdisplay, isShow } = this.setShowHideAndList(item);
        if (!isShow) {
            return <View key={index}></View>;
        }
        let _containerStyle = [styles.pinggucontainer];
        if (this.props.style !== undefined) {
            _containerStyle.push(this.props.style);
        }
        return (
            <View key={index} style={_containerStyle}>
                <View style={styles.selectlines}>
                    <Text style={styles.selname}>{item.value.displayName} {item.value.isRequired ? (<Text style={styles.required}>*</Text>) : null}</Text>
                    <View style={styles.radiocontainer}>
                        <RadioButton
                            value={itemval}
                            valueName={'value'}
                            onClick={(obj) => {
                                this.props.onChange(item.key, obj.value);
                                this.clearRelatedSubInfo(item)
                            }} source={itemsdisplay}
                            renderItem={(item) => {
                                return <View key={item.value} style={styles.item_row}>
                                    <View style={styles.item_row_right}>
                                        <View><Text style={styles.item_row_right_top_text}>{item.value}</Text></View>
                                    </View>
                                </View>
                            }} />
                    </View>
                </View>
            </View>

        );
    }
    renderMultipleButton = (item, index, itemval) => {
        const { itemsdisplay, isShow } = this.setShowHideAndList(item);
        if (!isShow) {
            return <View key={index}></View>;
        }
        let _containerStyle = [styles.pinggucontainer];
        if (this.props.style !== undefined) {
            _containerStyle.push(this.props.style);
        }
        if (item.value.value != "") {
            selectitems = item.value.value.split(",")
        }
        return (
            <View key={index} style={_containerStyle}>
                <View style={styles.selectlines}>
                    <View style={commonStyle.commonflexbetween}>
                        <Text style={styles.selname}>{item.value.displayName} {item.value.isRequired ? (<Text style={styles.required}>*</Text>) : null}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <MultiplePicker Items={itemsdisplay}
                            style={{ height: scaleSizeW(100) }}
                            textStyle={{ alignSelf: 'flex-start', fontSize: scaleSizeW(28), color: "#333" }}
                            onMultipleChange={(itemValue, obj) => {
                                this.props.onChange(item.key, itemValue);
                                this.clearRelatedSubInfo(item)
                            }}
                            SelectedValue={"0"}
                            value={itemval}
                            keyName={'value'} valueName={'value'}
                            title={item.value.displayName}
                            renderButton={(func, text, value, containStyle, txtStyle) => {
                                return (<TouchableOpacity
                                    onPress={() => {
                                        func();
                                    }}>
                                    <View style={[{ borderBottomWidth: 0, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }]}>
                                        <Text style={{ fontSize: scaleSizeW(30), color: '#9b9b9b' }}>{itemval}</Text>
                                        <Image source={require('../../../images/arrow-right.png')} style={styles.selicon} />
                                    </View>
                                </TouchableOpacity>)
                            }} />
                    </View>

                </View>
            </View>

        );
    }
    renderNumber = (item, index, itemval) => {
        const { isShow } = this.setShowHideAndList(item);
        if (!isShow) {
            return (<View key={index}></View>);
        }
        var itemkey = item.key;
        let _containerStyle = [styles.pinggucontainer];
        if (this.props.style !== undefined) {
            _containerStyle.push(this.props.style);
        }
        return (
            <View key={index} style={_containerStyle}>
                <View style={styles.selectline}>
                    <View style={commonStyle.commonflexbetween}>
                        <Text style={styles.selname}>{item.value.displayName} {item.value.isRequired ? (<Text style={styles.required}>*</Text>) : null}</Text>
                    </View>
                    <TextInput style={styles.inputxt} value={itemval === '请选择' ? '' : itemval} onChangeText={(v) => { this.props.onChange(itemkey, v) }} returnKeyType='done' placeholderTextColor="#9b9b9b" placeholder="请输入"></TextInput>
                </View>
            </View>
        );
    }
    renderTrueOrFalse = (item, index, itemval) => {
        const { isShow } = this.setShowHideAndList(item);
        if (!isShow) {
            return (<View key={index}></View>);
        }
        var itemkey = item.key;
        let _containerStyle = [styles.pinggucontainer];
        if (this.props.style !== undefined) {
            _containerStyle.push(this.props.style);
        }
        return (
            <View key={index} style={_containerStyle}>
                <View style={styles.selectline}>
                    <View style={commonStyle.commonflexbetween}>
                        <Text style={styles.selname}>{item.value.displayName} {item.value.isRequired ? (<Text style={styles.required}>*</Text>) : null}</Text>
                    </View>
                    <Checkbox mode="one" onChange={(v) => {
                        this.props.onChange(itemkey, v)
                        this.clearRelatedSubInfo(item)
                    }} isChecked={itemval} label={item.value.displayName} />
                </View>
            </View>
        );
    }
    renderInput = (item, index, itemval) => {
        const { isShow } = this.setShowHideAndList(item);
        if (!isShow) {
            return (<View key={index}></View>);
        }
        var itemkey = item.key;
        let _containerStyle = [styles.pinggucontainer];
        if (this.props.style !== undefined) {
            _containerStyle.push(this.props.style);
        }
        if (item.value.displayName == "收费标准") {
            return (<View key={index} style={styles.greybg}>
                <View style={[styles.pinggucontainer, styles.servicefee]}>
                    <View style={styles.selectline}>
                        <View style={commonStyle.commonflexbetween}>
                            <Text style={styles.selname}>收费标准 {item.value.isRequired ? (<Text style={styles.required}>*</Text>) : null}</Text>
                        </View>
                        <TextInput style={styles.inputxt} value={itemval === '请选择' ? '' : itemval} onChangeText={(v) => { this.props.onChange(itemkey, v) }} placeholderTextColor="#9b9b9b" placeholder="请输入" returnKeyType='done'></TextInput>
                    </View>
                </View>
            </View>)
        }
        else {
            return (
                <View key={index} style={_containerStyle}>
                    <View style={styles.selectline}>
                        <View style={commonStyle.commonflexbetween}>
                            <Text style={styles.selname}>{item.value.displayName} {item.value.isRequired ? (<Text style={styles.required}>*</Text>) : null}</Text>
                        </View>
                        <TextInput style={styles.inputxt} value={itemval === '请选择' ? '' : itemval} onChangeText={(v) => { this.props.onChange(itemkey, v) }} placeholderTextColor="#9b9b9b" placeholder="请输入" returnKeyType='done'></TextInput>
                    </View>
                </View>
            );
        }
    }
    renderDateTime = (item, index, itemval) => {
        const { isShow } = this.setShowHideAndList(item);
        if (!isShow) {
            return (<View key={index}></View>);
        }
        var itemkey = item.key;
        let _containerStyle = [styles.pinggucontainer];
        if (this.props.style !== undefined) {
            _containerStyle.push(this.props.style);
        }
        return (
            <View key={index} style={_containerStyle}>
                <View style={styles.selectline}>
                    <View style={commonStyle.commonflexbetween}>
                        <Text style={styles.selname}>{item.value.displayName} {item.value.isRequired ? (<Text style={styles.required}>*</Text>) : null}</Text>
                    </View>
                    <DatePicker
                        style={{ flex: 1, borderBottomWidth: 0 }}
                        date={itemval === '请选择' ? '' : itemval}
                        mode="date"
                        placeholder={item.value.displayName}
                        format="YYYY-MM"
                        // minDate={`${(new Date().year - 18)}-01-01`}
                        // maxDate={`${(new Date().year - 60)}-01-01`}
                        confirmBtnText="确定"
                        cancelBtnText="取消"
                        androidMode={'default'}
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                right: -10,
                            },
                            dateInput: {
                                position: 'absolute',
                                right: scaleSizeW(50),
                                borderWidth: 0
                            }
                            // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(date) => { this.props.onChange(itemkey, date) }}
                    />
                </View>
            </View>
        );
    }
    renderTextarea = (item, index, itemval) => {
        const { isShow } = this.setShowHideAndList(item);
        if (!isShow) {
            return (<View key={index}></View>);
        }
        let _containerStyle = [styles.comment];
        if (this.props.style !== undefined) {
            _containerStyle.push(this.props.style);
        }
        return (<View key={index} style={styles.greybg}>
            <View style={_containerStyle}>
                <View style={commonStyle.commonflexbetween}>
                    <Text style={styles.selname}>{item.value.displayName} {item.value.isRequired ? (<Text style={styles.required}>*</Text>) : null}</Text>
                </View>
                <Textarea
                    containerStyle={styles.textareaContainer}
                    style={styles.textarea}
                    onChangeText={(v) => { this.props.onChange(item.key, v) }}
                    defaultValue={''}
                    maxLength={120}
                    placeholder={'请填写你的服务介绍，以便我们能更好的帮助你找到合适的人员'}
                    placeholderTextColor={'#c7c7c7'}
                    underlineColorAndroid={'transparent'}
                />
            </View>
        </View>
        )
    }
    getPosition = async (v) => {
        if (Platform.OS == 'ios') {
            this.doGetPosition();
        } else {
            const permissions = [
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]
            const granteds = await PermissionsAndroid.requestMultiple(permissions);
            if (granteds["android.permission.ACCESS_FINE_LOCATION"] === "granted") {
                this.doGetPosition(v);
            } else {
                Toast.info("定位权限被禁止")
            }
        }
    }
    doGetPosition = (itemkey) => {
        let that = this
        Geolocation.getCurrentPosition(
            (position) => {
                let coords = position.coords;
                global.Coordinate = {
                    Latitude: coords.latitude,
                    Longitude: coords.longitude,
                    Simple: '',
                    Detail: null
                }
                api.GetCurrentLocation(global.Coordinate.Latitude, global.Coordinate.Longitude).then((res) => {
                    if (res.data.formattedAddress !== '[]') {
                        that.onChange(itemkey, res.data.formattedAddress)
                    } else {
                        Toast.info('未定位到任何地址信息')
                    }
                })
            },
            (error) => () => {
                global.Coordinate = {
                    Latitude: 0,
                    Longitude: 0,
                    Simple: '',
                    Detail: null
                }
            },
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
        );
    }
    renderMap = (item, index, itemval) => {
        const { isShow } = this.setShowHideAndList(item);
        if (!isShow) {
            return <View key={index}></View>;
        }
        let _containerStyle = [styles.pinggucontainer];
        if (this.props.style !== undefined) {
            _containerStyle.push(this.props.style);
        }
        return (
            <View key={index} style={_containerStyle}>
                <View style={styles.selectline}>
                    <Text style={styles.selname}>{item.value.displayName} {item.value.isRequired ? (<Text style={styles.required}>*</Text>) : null}</Text>
                    <TextInput style={styles.inputxt} value={itemval === '请输入' ? '' : itemval} onChangeText={(v) => { this.onChange(itemkey, v) }} placeholderTextColor="#9b9b9b" placeholder={'请输入'} returnKeyType='done'></TextInput>
                    <TouchableOpacity onPress={() => this.getPosition(itemkey)}>
                        <Image source={require('../../../images/location.png')} style={styles.map} />
                    </TouchableOpacity>
                </View></View>
        )
    }
    render() {
        const { data, list } = this.props;
        var viewInfo = data.map((item, index) => {
            var itemkey = item.key;
            if (itemkey === 'City' || itemkey === 'ContactPhone' || itemkey === 'Address') {
                return (<View key={index}></View>);
            }
            var itemval = '请选择';
            var items = list.filter(x => x.Key === itemkey);
            if (items.length > 0) {
                itemval = items[0].Value;
            }
            let info = (<View key={index}></View>);
            switch (item.value.propertyType) {
                default:
                case 5:
                    //金额
                    break;
                case 0:
                    //数字
                    info = this.renderNumber(item, index, itemval);
                    break;
                case 10:
                    //输入框
                    info = this.renderInput(item, index, itemval);
                    break;
                case 15:
                    //多行输入框
                    info = this.renderTextarea(item, index, itemval);
                    break;
                case 20:
                    //编辑器
                    break;
                case 25:
                    //下拉菜单
                    info = this.renderDropDownList(item, index, itemval);
                    break;
                case 30:
                    //是否选择
                    info = this.renderTrueOrFalse(item, index, itemval);
                    break;
                case 35:
                    //单选
                    info = this.renderSingleButton(item, index, itemval);
                    break;
                case 40:
                    //多选
                    info = this.renderMultipleButton(item, index, itemval);
                    break;
                case 45:
                    //对或错
                    break;
                case 50:
                    //图片
                    break;
                case 55:
                    //时间
                    info = this.renderDateTime(item, index, itemval);
                    break;
            }
            return info;
        })
        return (<View>{viewInfo}</View>);
    }
}

export default EntityProperty

const styles = StyleSheet.create({
    orangebg: {
        backgroundColor: '#ec5947',
        height: scaleSize(130)
    },
    required: {
        color: 'red',
        fontSize: scaleSize(24),
    },
    pinggucontainer: {
        borderRadius: scaleSize(20),
        marginLeft: scaleSize(30),
        marginRight: scaleSize(30),
        backgroundColor: '#fff'
    },
    selectline: {
        borderBottomWidth: scaleSizeW(1),
        borderBottomColor: '#eee',
        justifyContent: "flex-start",
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: scaleSize(1),
        paddingBottom: scaleSize(30),
        paddingTop: scaleSize(30)
    },
    selectlines: {
        borderBottomWidth: scaleSizeW(1),
        borderBottomColor: '#eeeeee',
        justifyContent: "space-between",
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: scaleSize(30),
        paddingTop: scaleSize(30)
    },
    selname: {
        color: '#252121',
        fontSize: scaleSize(30),
        width: scaleSizeW(205)
    },
    inputxt: {
        textAlign: 'right',
        flex: 1,
        fontSize: scaleSize(30),
        color: '#9b9b9b',
        paddingRight: scaleSize(50),
        paddingVertical: 0,
    },
    selicon: { width: scaleSizeW(14), height: scaleSizeW(24), marginLeft: scaleSizeW(10), marginLeft: scaleSize(40) },
    greybg: {
        backgroundColor: '#f7f6f9'
    },
    comment: {
        paddingTop: scaleSize(30),
        paddingBottom: scaleSize(30),
        paddingLeft: scaleSize(30),
        paddingRight: scaleSize(30),
        backgroundColor: '#fff',
        marginTop: scaleSize(30),
    },
    dialog_title: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scaleSize(30),
        marginBottom: scaleSizeW(50)
    },
    dialog_closeBtn: {
        width: '90%',
        backgroundColor: '#4576f7',
        borderWidth: scaleSizeW(1),
        borderColor: '#4576f7',
        borderRadius: scaleSizeW(30),
        height: scaleSizeW(80),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textareaContainer: {
        height: scaleSizeW(240),
        padding: 5,
        marginTop: scaleSize(20),
        backgroundColor: '#F5FCFF',
    },
    addresstxt: {
        height: scaleSizeW(120),
        width: scaleSizeW(480)
    },
    textarea: {
        textAlignVertical: 'top',  // hack android
        height: scaleSizeW(170),
        fontSize: 14,
        color: '#333',
    },
    addtextarea: {
        textAlignVertical: 'top',  // hack android
        height: scaleSizeW(110),
        fontSize: scaleSizeW(30), fontWeight: 'bold', color: '#26292a'
    },
    servicefee: {
        marginTop: scaleSizeW(30), fontSize: scaleSizeW(30), fontWeight: 'bold', color: '#26292a'

    },
    imageinfo: {
        width: scaleSize(200),
        height: scaleSize(200),
    },
    radiocontainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    imagelist: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    imagelist_item: {
        marginRight: scaleSizeW(30),
        marginTop: scaleSizeW(30),
    },
    imageinfo: {
        width: scaleSizeW(233), height: scaleSizeW(235),
        borderRadius: scaleSize(10)
    },
    map: { width: scaleSizeW(32), height: scaleSizeW(32), marginLeft: scaleSize(10) },
})

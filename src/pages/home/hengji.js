import React, { Component } from 'react'
import { PermissionsAndroid, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import { scaleSize, scaleSizeH, Enums, scaleSizeW } from "../../tools/util";
import Swiper from 'react-native-swiper';
import CustomizeHeader from "../components/customizeheader";
import CustomPicker from '../components/custompicker'
import Waiting from '../commons/waiting'
import commonStyle from '../../tools/commonstyles'
import { TextInput } from 'react-native-gesture-handler';
import * as api from '../../mocks/api'
import * as locals from '../../tools/localdata'
import Textarea from 'react-native-textarea';
import { inject, observer } from 'mobx-react';
import { Toast } from '../../tools/tool'
import Geolocation from '@react-native-community/geolocation';
import LocationBar from '../components/locationbar';

@inject('store')
@observer
class HengJi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initdata: {},
            data: [],
            show: false,
            title: '',
            address:'',
            location: ''
        }
    }
    static navigationOptions = {
        header: null
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: null,
            headerLeft: null,
            headerRight: null,
            headerStyle: {
                height: StatusBar.currentHeight,
                shadowOpacity: 0,
                backgroundColor: '#4576f7',
                borderBottomWidth: 0, elevation: 0,
                borderBottomColor: 'none'
            }
        }
    }
    componentDidMount = () => {
        global.CurrentNavigation = {
            Navigation: this.props.navigation,
            GoBack: 'Hengji',
            Params: this.props.navigation.state.params
        };
        this.loadInfo();
    }
    componentWillUnmount = () => {
        global.CurrentNavigation = null;
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
                    console.log(res.data.formattedAddress==='[]')
                    if (res.data.formattedAddress!=='[]') {
                        that.onChange(itemkey, res.data.formattedAddress)
                    }else{
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





    loadInfo = () => {
        var that = this;
        locals.PrepareFormType("MechineService")
            .then(data => {
                let _dataList = [];
                for (var key in data) {
                    if (data[key].value !== '') {
                        _dataList.push({ Key: key, Value: data[key].value })
                    }
                }
                that.setState({ initdata: data, data: _dataList, show: true });
            })
    }
    onChange = (key, value) => {
        var newdata = this.state.data.slice();
        var items = newdata.filter(x => x.Key === key);
        if (items.length > 0) {
            items[0].Value = value;
        } else {
            newdata.push({ Key: key, Value: value });
        }

        this.setState({ data: newdata })
    }
    Save = () => {
        let that = this;
        if (this.state.title === '') {
            Toast.info('请输入标题', 0.5);
            return;
        }
        var newdata = this.state.data.slice();
        newdata.push({ "Key": "Id", "Value": 0 });
        newdata.push({ "Key": "ActionType", "Value": "MechineService" });
        newdata.push({ "Key": "Title", "Value": this.state.title });
        const { userInfo } = this.props.store.config;
        newdata.push({ "Key": "City", "Value": userInfo.location });
        newdata.push({ "Key": "Address", "Value": this.state.address });
        var postData = {};
        newdata.forEach(item => {
            postData[item.Key] = item.Value;
        })
        api.PostPingGu(postData)
            .then(res => {
                if (res.data.result === 1) {
                    this.setState({ data: [] })
                    Toast.info('提交成功', 0.5, () => {
                        that.props.navigation.goBack();
                    });

                } else {
                    Toast.fail(res.data.message);
                }
            })
    }
    renderInfo = () => {
        var postinfo = Object.assign({}, this.state.initdata)
        var infolist = [];
        var savedata = [];
        var returnview = null;

        for (var key in postinfo) {
            infolist.push({ key: key, value: postinfo[key] });
        }

        returnview = infolist.map((item, index) => {
            var itemkey = item.key;
            if (itemkey === 'City'|| itemkey === 'ContactPhone' || itemkey === 'Address') {
                return null;
            }
            var itemval = "请输入";
            var newdata = this.state.data.slice();
            var items = newdata.filter(x => x.Key === itemkey);
            if (items.length > 0) {
                itemval = items[0].Value;
            }
            if (item.value.propertyType == 25) {
                var itemsdisplay = [];
                item.value.items.map((subitem, subindex) => {
                    itemsdisplay.push({ key: subitem, value: subitem })
                })

                return (
                    <View key={index} style={styles.pinggucontainer}>
                        <View style={[styles.selectline, styles.linemore]}>
                            <Text style={styles.selname}>{item.value.displayName} {item.value.isRequired ? (<Text style={styles.required}>*</Text>) : null}</Text>
                            <View>
                                <CustomPicker Items={itemsdisplay}
                                    style={{ height: scaleSizeW(100) }}
                                    textStyle={{ alignSelf: 'flex-start', fontSize: scaleSizeW(28), color: "#333" }}
                                    onChange={(itemValue, item) => {
                                        this.onChange(itemkey, itemValue)
                                    }}
                                    SelectedValue={"0"}
                                    value={itemval}
                                    keyName={'value'} valueName={'value'}
                                    renderButton={(func, text, value, containStyle, txtStyle) => {
                                        return (<TouchableOpacity
                                            onPress={() => {
                                                func();
                                            }}>
                                            <View style={[{ borderBottomWidth: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                                                <Text style={{ fontSize: scaleSizeW(30), color: '#9b9b9b' }}>{itemval === '请输入' ? '请选择' : itemval}</Text>
                                                <Image source={require('../../../images/arrow-right.png')} style={styles.selicon} />
                                            </View>
                                        </TouchableOpacity>)
                                    }} />
                            </View>
                        </View>
                    </View>);
            }
            if (item.value.propertyType == 60) {
                return (
                    <View key={index} style={styles.pinggucontainer}>

                        <View style={styles.selectline}>
                            <Text style={styles.selname}>{item.value.displayName} {item.value.isRequired ? (<Text style={styles.required}>*</Text>) : null}</Text>
                            <TextInput style={styles.inputxt} value={itemval === '请输入' ? '' : itemval} onChangeText={(v) => { this.onChange(itemkey, v) }} placeholderTextColor="#9b9b9b" placeholder={'请输入'}></TextInput>
                            <TouchableOpacity onPress={() => this.getPosition(itemkey)}>
                                <Image source={require('../../../images/location.png')} style={styles.map} />
                            </TouchableOpacity>
                        </View></View>
                )
            }
            if (item.value.propertyType == 10) {
                if (item.value.displayName == "收费标准") {
                    return (<View key={index} style={styles.greybg}>
                        <View style={[styles.pinggucontainer, styles.servicefee]}>
                            <View style={styles.selectline}>
                                <Text style={styles.selname}>收费标准 {item.value.isRequired ? (<Text style={styles.required}>*</Text>) : null}</Text>
                                <TextInput style={styles.inputxt} value={itemval === '请选择' ? '' : itemval} onChangeText={(v) => { this.onChange(itemkey, v) }} placeholderTextColor="#9b9b9b" placeholder='例如100元/小时'></TextInput>
                            </View>
                        </View>
                    </View>)
                }
                else {
                    if (item.key != 'ContactPhone') {
                        return (
                            <View key={index} style={styles.pinggucontainer}>
                                <View style={styles.selectline}>
                                    <Text style={styles.selname}>{item.value.displayName} {item.value.isRequired ? (<Text style={styles.required}>*</Text>) : null}</Text>
                                    <TextInput style={styles.inputxt} value={itemval === '请输入' ? '' : itemval} onChangeText={(v) => { this.onChange(itemkey, v) }} placeholderTextColor="#9b9b9b" placeholder={'请输入'}></TextInput>
                                    <View style={styles.map}></View>
                                </View></View>
                        );
                    }
                    else {
                        return null;
                    }
                }

            }
            if (item.value.propertyType == 15) {
                if (item.value.displayName == "服务介绍") {
                    return (<View key={index} style={styles.greybg}>
                        <View style={styles.comment}>
                            <View style={commonStyle.commonflexbetween}>
                                <Text style={styles.selname}>服务介绍 {item.value.isRequired ? (<Text style={styles.required}>*</Text>) : null}</Text>
                            </View>
                            <Textarea
                                containerStyle={styles.textareaContainer}
                                style={styles.textarea}
                                onChangeText={(v) => { this.onChange(itemkey, v) }}
                                defaultValue={this.state.text}
                                maxLength={120}
                                placeholder={'请填写你的服务介绍，以便我们能更好的帮助你找到合适的人员'}
                                placeholderTextColor={'#c7c7c7'}
                                underlineColorAndroid={'transparent'}
                            />
                        </View></View>
                    )
                }
                else {
                    return (<View key={index} style={styles.pinggucontainer}>

                        <View style={styles.selectline}>
                            <Text style={styles.selname}>{item.value.displayName} {item.value.isRequired ? (<Text style={styles.required}>*</Text>) : null}</Text>
                            <Textarea
                                containerStyle={styles.addresstxt}
                                style={styles.addtextarea}
                                onChangeText={(v) => { this.onChange(itemkey, v) }}
                                defaultValue={this.state.text}
                                maxLength={200}
                                placeholder={'请填写你的详细地址，以便我们能更好的帮助你找到合适的人员'}
                                placeholderTextColor={'#c7c7c7'}
                                value=""
                                underlineColorAndroid={'transparent'}
                            />


                        </View>
                    </View>

                    )
                }

            }
            else { return null; }
        });
        return returnview;
    }
    render() {

        if (!this.state.show) {
            return (<Waiting />);
        }
        return (<View style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff' }]}>
            <CustomizeHeader Title="横机服务" theme="blue" goBack={() => { this.props.navigation.goBack() }}>

            </CustomizeHeader>
            <ScrollView style={{ width: '100%', height: '100%' }} keyboardShouldPersistTaps={'always'} contentContainerStyle={commonStyle.scrollViewContainer}>
                <View style={styles.greybg}>
                    <View style={[styles.pinggucontainer, styles.servicefee]}>
                        <View style={styles.selectline}>
                            <Text style={styles.selname}>标题 <Text style={styles.required}>*</Text></Text>
                            <TextInput style={styles.inputxt} value={this.state.title} onChangeText={(v) => { this.setState({ title: v }) }} placeholderTextColor="#9b9b9b" placeholder={'请输入服务标题'}></TextInput>
                        </View>
                    </View>
                </View>
                {this.renderInfo()}

                <LocationBar {...this.props}  textChange={(v)=>{this.setState({ address: v })}}/>
                <View style={styles.greybg}>
                    <View style={styles.dialog_title}>
                        <TouchableOpacity onPress={() => this.Save()} style={styles.dialog_closeBtn} >
                            <Text style={{ color: '#fff', fontSize: scaleSize(30), alignSelf: 'center' }}>提交信息</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </ScrollView>
        </View>)
    }
}
const styles = StyleSheet.create({
    required: {
        color: 'red',
        fontSize: scaleSize(24),
    },
    orangebg: {
        backgroundColor: '#ec5947',
        height: scaleSize(130)
    },
    pinggucontainer: {
        borderRadius: scaleSize(20),
        marginLeft: scaleSize(30),
        marginRight: scaleSize(30),
        backgroundColor: '#fff'
    },
    selectline: {
        borderBottomWidth: scaleSize(1),
        borderBottomColor: '#eeeeee',
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: scaleSize(20),
        paddingTop: scaleSize(20)
    },
    linemore: {
        paddingBottom: scaleSize(30),
        paddingTop: scaleSize(30),
    },
    selname: {
        color: '#252121',
        fontSize: scaleSize(30),
        width: scaleSizeW(205)
    },
    inputxt: {
        textAlign: 'right',
        flex: 1,
        fontSize: scaleSizeW(30), color: '#26292a', paddingVertical: scaleSize(0), margin: scaleSize(0)
    },
    selicon: { width: scaleSizeW(14), height: scaleSizeW(24), marginLeft: scaleSize(40) },
    map: { width: scaleSizeW(32), height: scaleSizeW(32), marginLeft: scaleSize(10) },
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
        height: scaleSizeW(180),
        padding: 5,
        backgroundColor: '#F5FCFF',
    },
    addresstxt: {
        height: scaleSizeW(120),
        width: scaleSizeW(480)
    },
    textarea: {
        textAlignVertical: 'top',  // hack android
        height: scaleSizeW(170),
        fontSize: scaleSizeW(30),
        color: '#333',
    },
    addtextarea: {
        textAlignVertical: 'top',  // hack android
        height: scaleSizeW(110),
        fontSize: scaleSizeW(30), fontWeight: 'bold', color: '#26292a'
    },
    servicefee: {
        marginTop: scaleSizeW(30),
        fontSize: scaleSizeW(30), fontWeight: 'bold', color: '#26292a',
        marginLeft: 0,
        marginRight: 0,
        paddingLeft: scaleSizeW(30),
        paddingRight: scaleSizeW(30),
    }

})

export default HengJi
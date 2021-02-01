import React, { Component } from 'react'
import { View, Button, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ImageBackground,StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { observer, inject } from 'mobx-react'
import * as api from './mocks/api'
import * as tools from './tools/tool'
import { scaleSizeW,setSpText, config, clearBoxPng } from './tools/util'
import commonStyle from './tools/commonstyles'
import CheckBox from './pages/components/checkbox' 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import CustomizeHeader from './pages/components/customizeheader'
@inject('store')
@observer
class Register extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: null,
            headerLeft: null,
            headerRight: null,
            headerStyle: {
                height: StatusBar.currentHeight,
                shadowOpacity: 0,
                backgroundColor: '#4576f7',
                borderBottomWidth: 0,
                borderBottomColor: 'none'
            }
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            Phone: '',
            NewPassword: '',
            NickName: '',
            isAgree: true,
            Disabled: false,
            ValidationCode: '',
            Interval: null,
            ValidationStatus: '获取验证码'
        }
    }
    getCode() {
        let that = this;
        if (this.state.Phone === '') {
            tools.Toast.fail('请输入您的手机号');
            return;
        }
        if (!(/^1[3456789]\d{9}$/.test(this.state.Phone))) {
            tools.Toast.fail('手机号码有误，请重填');
            return false;
        }
        api.GetValidationCode({ phoneNumber: `${this.state.Phone}` }).then((res) => {
            tools.Toast.success(res.data.message);
            that.setState({ ValidationCode: res.data.code });
        })

        that.setState({
            ValidationStatus: '剩余60秒',
        });
        let count = 59;
        this.interval = setInterval(() => {
            that.setState({
                ValidationStatus: '剩余' + count + '秒',
            })
            count--;
            if (count <= 0) {
                that.setState({
                    ValidationStatus: '获取验证码',
                });
                clearInterval(that.interval);
                that.interval = null;
            }
        }, 1000);
    }
    clearForm = (fieldName) => {
        switch (fieldName) {
            case 'phone':
                this.setState({
                    Phone: ''
                })
                break;
            case 'password':
                this.setState({
                    NewPassword: ''
                })
                break;
            default:
                break;
        }
    }
    Save = () => {
        let that = this;
        if (this.state.Phone === '') {
            tools.Toast.fail('请输入您的手机号');
            this.clearCInterval();
            return;
        }
        if (!(/^1[3456789]\d{9}$/.test(this.state.Phone))) {
            tools.Toast.fail('手机号码有误，请重填');
            this.clearCInterval();
            return false;
        }
        if (this.state.NewPassword === '') {
            tools.Toast.fail('请输入您的新密码');
            this.clearCInterval();
            return;
        }
   
        this.setState({
            Disabled: true
        })
        api.Register({
            phoneNumber: this.state.Phone,
            password: this.state.NewPassword,
            code: this.state.ValidationCode
        }).then(res => {
            this.setState({
                Disabled: false
            })
            if (res.data.result === 1) {
            tools.Toast.info('恭喜您，注册成功', 0.5, () => {

                    var data = {
                        phoneNumber: this.state.Phone,
                        password: this.state.NewPassword,
                    };
                    api.UserToken(data).then(res => {
                        //1.第一次完善信息；token的保存
                        if (res.data.result == 1) {
                            that.props.store.config.setLoginInfo({
                                token: res.data.token,
                                avatar: res.data.avatar,
                                nickName: res.data.nickName,
                                userId: res.data.id,
                                location: res.data.location
                            });
                            if (that.props.navigation.state.params !== undefined && that.props.navigation.state.params.back !== undefined) {
                                if (that.props.navigation.state.params.params !== undefined) {
                                    //带参数跳转
                                    that.props.navigation.replace(that.props.navigation.state.params.back, that.props.navigation.state.params.params);
                                } else {
                                    that.props.navigation.replace(that.props.navigation.state.params.back);
                                }
                            } else {
                                that.props.navigation.push('HomePage');
                            }
                        } else {
                            tools.Toast.fail(res.data.message);
                        }
                    }, (err) => {
                        tools.Toast.fail(err.toString());
                    })


                    //setTimeout(() => {
                    //    that.props.navigation.goBack()
                    //}, 300);
                });
            } else {
                that.clearCInterval();
                tools.Toast.fail(res.data.message);
                that.setState({
                    Disabled: false,
                    ValidationStatus: '获取验证码'
                })
            }
        }, (err) => {
            that.clearCInterval();
            tools.Toast.fail(err.toString());
            that.setState({
                Disabled: false,
                ValidationStatus: '获取验证码'
            })
        })
    }
    clearCInterval = () => {
        if (this.interval !== null) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    componentWillUnmount = () => {
        this.clearCInterval();
    }
    render() {
        const {countryPhoneCodes}=this.props.store.config;
        let _disabled = this.state.Phone.length > 0&& this.state.ValidationCode.length > 0  && this.state.NewPassword.length > 0 ? false : true;

        return (
            <SafeAreaView style={commonStyle.safeView}>
                <KeyboardAwareScrollView>
                <ScrollView style={{ width: '100%', height: '100%' }} keyboardShouldPersistTaps={'always'} contentContainerStyle={commonStyle.scrollViewContainerLogin}>
                    <View style={commonStyle.fields_line}>
                        <Text style={commonStyle.bigtitle}>欢迎注册</Text>
                        <View style={commonStyle.wrapinput}>
                            <TextInput placeholder='手机号' keyboardType='numeric' returnKeyType="next" onChangeText={(v) => { this.setState({ Phone: v }) }} value={this.state.Phone} style={commonStyle.fields_textroundbox} />
                            <TouchableOpacity onPress={() => this.clearForm('phone')}>
                                <Image source={require('../images/cha.png')} style={this.state.Phone.length > 0 ? [styles.chaimg] : [styles.chaimg, styles.hide]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                  
                    <View style={commonStyle.fields_line}>
                        <View style={commonStyle.wrapinput}>
                            <TextInput placeholder='请输入验证码' returnKeyType="next" onChangeText={(v) => { this.setState({ ValidationCode: v }) }} value={this.state.ValidationCode} style={commonStyle.fields_textroundbox} />
                            <TouchableOpacity style={commonStyle.capturebtn} onPress={() => this.getCode()} disabled={this.state.ValidationStatus === '获取验证码' ? false : true}>
                                <Text style={commonStyle.btnblue_text}>{this.state.ValidationStatus}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={commonStyle.fields_line}>
                        <View style={commonStyle.wrapinput}>
                            <TextInput placeholder='密 码' secureTextEntry={true} returnKeyType="next" onChangeText={(v) => { this.setState({ NewPassword: v }) }} value={this.state.NewPassword} style={commonStyle.fields_textroundbox} />
                            <TouchableOpacity onPress={() => this.clearForm('password')}>
                                <Image source={require('../images/cha.png')} style={this.state.NewPassword.length > 0 ? [styles.chaimg] : [styles.chaimg, styles.hide]} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[commonStyle.fields_line]}>
                        <TouchableOpacity onPress={() => this.Save()} disabled={_disabled ? true : false} style={[commonStyle.fullWidthButton, _disabled ? commonStyle.fullWidthButton_Disabled : null]}>
                            <Text style={commonStyle.fullWidthButton_text}>注册</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[commonStyle.fields_line, { marginTop: scaleSizeW(10), alignItems:'center' }]}>
                        <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                            <Text style={{ color: '#222222' }}>已有账号，快速登录{">"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={commonStyle.agreement}>
                        {/* <CheckBox mode="multiple" isChecked={this.state.isAgree ? true : false} label={""} onChange={() => this.setState({ isAgree: !this.state.isAgree })} /> */}
                        <Text style={commonStyle.agreementtext}>点击立即注册，即同意</Text>
                        <TouchableOpacity onPress={() => { this.props.navigation.push('Agreement') }}><Text  style={[commonStyle.underline,{color:"#4576f7"}]}>用户协议</Text></TouchableOpacity> 
                    </View>
                </ScrollView>
                <CustomizeHeader goBack={() => { this.props.navigation.goBack() }} Title="" />
                </KeyboardAwareScrollView>
            </SafeAreaView>);
    }
}
const styles = StyleSheet.create({
    modal: {
        width: scaleSizeW(120)
    },
    modaltext: {
        fontSize: setSpText(28)
    },
    downimg: { width: scaleSizeW(15), height: scaleSizeW(9), position: 'absolute', left: scaleSizeW(80), zIndex: -1 },
    dropdown_dropdown: {
        width: scaleSizeW(150),
        height: scaleSizeW(150),
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 3,
    },
    chaimg: {
        width: scaleSizeW(20),
        height: scaleSizeW(20),
    },
    hide: {
        display: "none"
    }
})
export default Register;
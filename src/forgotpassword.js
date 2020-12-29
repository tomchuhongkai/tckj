import React, { Component } from 'react'
import { View, Button, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView,StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { observer, inject } from 'mobx-react'
import * as api from './mocks/api'
import * as tools  from './tools/tool'
import commonStyle from './tools/commonstyles'
import { config, setSpText, scaleSizeW, clearBoxPng } from './tools/util'
import ErrorInfo from './pages/components/error'
import CustomizeHeader from "./pages/components/customizeheader";
 
@inject('store')
@observer
class ForgotPassword extends Component {
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
            visible: true,
            Phone: '',
            Disabled: false,
            Disabled2: false,
            ValidationCode: '',
            Interval: null,
            ValidationStatus: '获取验证码',
            NewPassword: '',
            ConfirmPassword: '',
            token:''
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
            case 'Email':
                this.setState({
                    Email: ''
                })
                break;
            default:
                break;
        }
    }
    Next = () => {
        if (this.state.Phone === '') {
            Alert.alert('提示', "请输入您的手机号");
            return;
        }
        if (this.state.ValidationCode === '') {
            Alert.alert('提示', "请输入您的验证码");
            return;
        }
        let data = { phoneNumber: this.state.Phone, code: this.state.ValidationCode }
        api.FindPassword(data)
            .then(res => {
                this.setState({
                    Disabled: false
                })
                if (res.data.result === 1) {
                    this.setState({
                        visible: false,
                        token:res.data.token
                    })
                } else {
                    Alert.alert('提示', res.data.message);
                }
            }, (err) => {
                this.setState({
                    Disabled: false
                })
            })

    }

    Save = () => {
        let that=this;
        if (this.state.NewPassword === '') {
            Alert.alert('提示', "请输入您的新密码");
            return;
        }
        if (this.state.ConfirmPassword === '') {
            Alert.alert('提示', "请输入确认密码");
            return;
        }

        if (this.state.ConfirmPassword !== this.state.NewPassword) {
            Alert.alert('提示', "对不起，两次输入的密码不一致");
            return;
        }

        this.setState({
            Disabled2: true
        })
        let data={
            password:this.state.NewPassword,
            phoneNumber:this.state.Phone,
            token:this.state.token
        }
        api.ResetPassword(data)
            .then(res => {
                this.setState({
                    Disabled2: false
                })
                if (res.data.result === 1) {
                    Alert.alert('提示', res.data.message, [{
                        text: "确定", onPress: () => {
                            that.props.navigation.push('Signin');
                        }
                    }]);
                } else {
                    Alert.alert('提示', res.data.message);
                }
            }, (err) => {
                this.setState({
                    Disabled: false
                })
            })
    }
    render() {
        let _disabled = this.state.Phone.length > 0 && this.state.ValidationCode.length > 0 ? false : true;
        let _disabled2 = this.state.ConfirmPassword.length > 0 && this.state.NewPassword.length > 0 ? false : true;
        return (<SafeAreaView style={commonStyle.safeViewWithCusHead}>
            <CustomizeHeader showBack={true} Title="找回密码" goBack={() => { this.props.navigation.goBack() }} />
            <ScrollView style={{ width: '100%', height: '100%' }} keyboardShouldPersistTaps={'always'} contentContainerStyle={commonStyle.scrollViewContainerLogin}>
                {/* <View style={commonStyle.fields_line}>
                    <View style={commonStyle.wrapinput}>
                        <TextInput placeholder='请输入您的电子邮箱' keyboardType='email-address' returnKeyType="next" onChangeText={(v) => { this.setState({ Email: v }) }} value={this.state.Email} style={commonStyle.fields_textroundbox} />
                        <TouchableOpacity onPress={() => this.clearForm('phone')}>
                            <Image source={require('../images/cha.png')} style={this.state.Email.length > 0 ? [styles.chaimg] : [styles.chaimg, styles.hide]} />
                        </TouchableOpacity>
                    </View>
                </View> */}
               

                {this.state.visible ? (
                    <View>
                        <View style={commonStyle.fields_line} >
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
                        <View style={[commonStyle.fields_line, { marginTop: scaleSizeW(20) }]}>
                            <TouchableOpacity onPress={() => this.Next()} disabled={_disabled ? true : false} style={[commonStyle.fullWidthButton, _disabled ? commonStyle.fullWidthButton_Disabled : null]}>
                                <Text style={commonStyle.fullWidthButton_text}>找回密码</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                ) :  
                <View>
                <View style={commonStyle.fields_line}>
                    <View style={commonStyle.wrapinput}>
                        <TextInput placeholder='请输入您的新密码' secureTextEntry={true} returnKeyType="next" onChangeText={(v) => { this.setState({ NewPassword: v }) }} value={this.state.NewPassword} style={commonStyle.fields_textroundbox} />
                        <TouchableOpacity onPress={() => this.clearForm('password')}>
                            <Image source={require('../images/cha.png')} style={this.state.NewPassword.length > 0 ? [styles.chaimg] : [styles.chaimg, styles.hide]} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={commonStyle.fields_line}>
                    <View style={commonStyle.wrapinput}>
                        <TextInput placeholder='请确认您的密码'  secureTextEntry={true} returnKeyType="next" onChangeText={(v) => { this.setState({ ConfirmPassword: v }) }} value={this.state.ConfirmPassword} style={commonStyle.fields_textroundbox} />
                        <TouchableOpacity onPress={() => this.clearForm('password')}>
                            <Image source={require('../images/cha.png')} style={this.state.ConfirmPassword.length > 0 ? [styles.chaimg] : [styles.chaimg, styles.hide]} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[commonStyle.fields_line, { marginTop: scaleSizeW(20) }]}>
                    <TouchableOpacity onPress={() => this.Save()} disabled={_disabled2 ? true : false} style={[commonStyle.fullWidthButton, _disabled ? commonStyle.fullWidthButton_Disabled : null]}>
                        <Text style={commonStyle.fullWidthButton_text}>设置新密码</Text>
                    </TouchableOpacity>
                </View>
            </View>
            }

            </ScrollView>
            <ErrorInfo />
        </SafeAreaView>);
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        fontSize: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    register: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    register_item: {
        position: 'absolute',
        bottom: scaleSizeW(50),
    },
    register_text: {
        color: '#ff9500',
        fontSize: setSpText(24)
    },
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
    },


})
export default ForgotPassword;

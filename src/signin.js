import React, { Component } from 'react'
import { View, Text, Button, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ImageBackground, StatusBar } from 'react-native'
import { observer, inject } from 'mobx-react'
import { SafeAreaView } from 'react-navigation'
import CustomizeHeader from '../src/pages/components/customizeheader'
import * as api from '../src/mocks/api'
import * as tools from '../src/tools/tool'
import { scaleSizeW, setSpText } from './tools/util'
import commonStyle from './tools/commonstyles'
import { Toast } from './tools/tool'

@inject('store')
@observer
class SignIn extends Component {
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
    componentDidMount = () => {
    }
    constructor(props) {
        super(props);
        this.state = {
            Phone: '',
            Password: '',
            Disabled: true,
            // isAgree: true
        }
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
                    Password: ''
                })
                break;
            default:
                break;
        }
    }


    Submit = () => {
        let that = this;
        if (this.state.Phone === '') {
            Toast.fail('请输入您的手机号');
            return;
        }
        if (!(/^1[3456789]\d{9}$/.test(this.state.Phone))) {
            Toast.fail('手机号码有误，请重填');
            return false;
        }
        // if (this.state.isAgree === false) {
        //     Toast.fail('您必须同意用户协议');
        //     return;
        // }
        if (this.state.Password === '') {
            Toast.fail('请输入您的密码');
            return;
        }
        var data = {
            phoneNumber: this.state.Phone,
            password: this.state.Password,
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
                    that.props.navigation.goBack();
                }
            } else {
                Toast.fail(res.data.message);
            }
        }, (err) => {
            Toast.fail(err.toString());
        })
    }
    render() {
        let _disabled = this.state.Phone.length > 0 && this.state.Password.length > 0 ? false : true;
        return (
            <SafeAreaView style={commonStyle.safeViewWithCusHead}>
                <View style={[commonStyle.scrollViewContainerLogin, { width: '100%', height: '100%' }]}>
                    <View style={commonStyle.fields_line}>
                        <Text style={commonStyle.bigtitle}>登录</Text>
                        <View style={commonStyle.wrapinput}>
                            <TextInput placeholder='手机号' keyboardType='numeric' returnKeyType="next" onChangeText={(v) => { this.setState({ Phone: v }) }} value={this.state.Phone} style={commonStyle.fields_textroundbox} />
                            <TouchableOpacity onPress={() => this.clearForm('phone')}>
                                <Image source={require('../images/cha.png')} style={this.state.Phone.length > 0 ? [styles.chaimg] : [styles.chaimg, styles.hide]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={commonStyle.fields_line}>
                        <View style={commonStyle.wrapinput}>
                            <TextInput placeholder='请输入密码' secureTextEntry={true} returnKeyType="next" onChangeText={(v) => { this.setState({ Password: v }) }} value={this.state.Password} style={commonStyle.fields_textroundbox} />
                            {/* <TouchableOpacity onPress={() => this.clearForm('password')}>
                                <Image source={require('../images/cha.png')} style={this.state.Password.length > 0 ? [styles.chaimg] : [styles.chaimg, styles.hide]} />
                            </TouchableOpacity> */}
                            <TouchableOpacity onPress={() => { this.props.navigation.push('ForgotPassword') }}>
                                <Text style={commonStyle.btnblue_text}>忘记密码</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[commonStyle.fields_line, { marginTop: scaleSizeW(20) }]}>
                        <TouchableOpacity onPress={() => this.Submit()} disabled={_disabled ? true : false} style={[commonStyle.fullWidthButton, _disabled ? commonStyle.fullWidthButton_Disabled : null]}>
                            <Text style={commonStyle.fullWidthButton_text}>登录</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[commonStyle.fields_line, { marginTop: scaleSizeW(10), alignItems: 'center' }]}>
                        <TouchableOpacity onPress={() => { this.props.navigation.push('Register') }}>
                            <Text style={{ color: '#222222' }}>没有账号，快速注册{">"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={commonStyle.agreement}>
                        {/* <CheckBox mode="multiple" isChecked={this.state.isAgree ? true : false} label={""} onChange={() => this.setState({ isAgree: !this.state.isAgree })} /> */}
                        <Text style={commonStyle.agreementtext}>点击登录，即同意</Text>
                        <TouchableOpacity onPress={() => { this.props.navigation.push('Agreement') }}><Text  style={[commonStyle.underline,{color:"#4576f7"}]}>用户协议</Text></TouchableOpacity> 
                    </View>
                </View>
                <CustomizeHeader Title="" goBack={() => {
                    this.props.navigation.goBack()
                }} />
            </SafeAreaView>
        );
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

export default SignIn;


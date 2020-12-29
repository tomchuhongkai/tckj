import React, { Component } from 'react'
import { View, Button, Text, Image, StyleSheet, TouchableOpacity,ScrollView, TextInput, Alert } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { observer, inject } from 'mobx-react'
import * as api from './mocks/api'
import * as tools from './tools/tool'
import commonStyle from './tools/commonstyles'
import { config, setSpText,scaleSizeW, clearBoxPng } from './tools/util'
import Loading from "./pages/components/loading"
import ErrorInfo from './pages/components/error'
import BackButton from './pages/components/backButton'
import HeaderTitle from './pages/components/headerTitle'
import RightButton from './pages/components/rightButton'


@inject('store')
@observer
class AuthResetPassword extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <HeaderTitle Title="修改密码" />,
            headerLeft: <BackButton goBack={navigation.goBack} />,
            headerRight: <RightButton />,
            headerStyle: {
                height: config.headerHeight,
                shadowOpacity: 0
            }
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            Email: this.props.navigation.getParam('email'),
            Code: '',
            NewPassword: '',
            ConfirmPassword: ''
        }
    }
    clearForm = (fieldName) => {
        switch (fieldName) {
            case 'Code':
                this.setState({
                    Code: ''
                })
                break;
            case 'NewPassword':
                this.setState({
                    NewPassword: ''
                })
                break;
            case 'ConfirmPassword':
                this.setState({
                    ConfirmPassword: ''
                })
                break;
            default:
                break;
        }
    }
    Save = () => {
        if (this.state.Code === '') {
            Alert.alert('提示', "请输入您收到的验证码");
            return;
        }
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
            Disabled: true
        })
        api.CodeResetPassword({
            Email: this.state.Email,
            Code: this.state.Code,
            NewPassword: this.state.NewPassword,
            RePassword: this.state.ConfirmPassword
        })
            .then(res => {
                this.setState({
                    Disabled: false
                })
                if (res.data.result === 1) {
                    Alert.alert('提示', res.data.message);
                    tools.LogOut();
                    this.props.navigation.popToTop();
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
        return (<SafeAreaView style={commonStyle.safeView}>
            <ScrollView style={{ width: '100%', height: '100%' }} contentContainerStyle={commonStyle.scrollViewContainer}>
                <View style={commonStyle.fields_line}>
                    <Text style={commonStyle.fields_label}>验证码</Text>
                    <TextInput placeholder='请输入您收到的验证码' maxLength={50} onChangeText={(v) => { this.setState({ Code: v }) }} value={this.state.Code} style={commonStyle.fields_textbox} />
                    <View style={commonStyle.clearBox}>
                        <TouchableOpacity onPress={() => this.clearForm('Code')}>
                            <Image source={clearBoxPng} style={{ width: scaleSizeW(40), height: scaleSizeW(40) }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={commonStyle.fields_line}>
                    <Text style={commonStyle.fields_label}>您的新密码</Text>
                    <TextInput placeholder='请输入您的新密码' secureTextEntry={true} type="password" onChangeText={(v) => { this.setState({ NewPassword: v }) }} value={this.state.NewPassword} style={commonStyle.fields_textbox} />
                    <View style={commonStyle.clearBox}>
                        <TouchableOpacity onPress={() => this.clearForm('NewPassword')}>
                            <Image source={clearBoxPng} style={{ width: scaleSizeW(40), height: scaleSizeW(40) }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={commonStyle.fields_line}>
                    <Text style={commonStyle.fields_label}>确认新密码</Text>
                    <TextInput placeholder='请确认您的新密码' secureTextEntry={true} type="password" onChangeText={(v) => { this.setState({ ConfirmPassword: v }) }} value={this.state.ConfirmPassword} style={commonStyle.fields_textbox} />
                    <View style={commonStyle.clearBox}>
                        <TouchableOpacity onPress={() => this.clearForm('ConfirmPassword')}>
                            <Image source={clearBoxPng} style={{ width: scaleSizeW(40), height: scaleSizeW(40) }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[commonStyle.fields_line]}>
                    <TouchableOpacity onPress={() => this.Save()} style={[commonStyle.fullWidthButton, this.state.Disabled ? commonStyle.fullWidthButton_Disabled : null]}>
                        <Text style={commonStyle.fullWidthButton_text}>修改密码</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <ErrorInfo />
        </SafeAreaView>);
    }
}

export default AuthResetPassword;
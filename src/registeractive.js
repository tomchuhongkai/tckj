import React, { Component } from 'react'
import { View, Button, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { observer, inject } from 'mobx-react'
import * as api from './mocks/api'
import * as tools from './tools/tool'
import commonStyle from './tools/commonstyles'
import { config,scaleSizeW,setSpText, clearBoxPng } from './tools/util'
import Loading from "./pages/components/loading"
import ErrorInfo from './pages/components/error'
import BackButton from './pages/components/backButton'
import HeaderTitle from './pages/components/headerTitle'
import RightButton from './pages/components/rightButton'


@inject('store')
@observer
class RegisterActive extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <HeaderTitle Title="会员注册" />,
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
            Email: this.props.store.customer.profile.RegisterEmail,
            Code: '',
            Disabled: false
        }
    }
    clearForm = (fieldName) => {
        switch (fieldName) {
            case 'Email':
                this.setState({
                    Email: ''
                })
                break;
            case 'Code':
                this.setState({
                    Code: ''
                })
                break;
            default:
                break;
        }
    }
    Save = () => {
        if (this.state.Email === '') {
            Alert.alert('提示', "请输入您的电子邮箱");
            return;
        }
        if (this.state.Code === '') {
            Alert.alert('提示', "请输入您收到的验证码");
            return;
        }
        this.setState({
            Disabled: true,
            loaded:false
        })
        api.RegisterComplete({
            Email: this.state.Email,
            Code: this.state.Code
        })
            .then(res => {
                this.setState({
                    Disabled: false,
                    loaded:true
                })
                if (res.data.result === 1) {
                    Alert.alert('提示', res.data.message, [{
                        text: "确定", onPress: () => {
                            this.props.navigation.popToTop();
                        }
                    }]);
                } else {
                    Alert.alert('提示', res.data.message);
                }
            }, (err) => {
                this.setState({
                    Disabled: false,
                    loaded:true
                })
            })
    }
    render() {
        return (<SafeAreaView style={commonStyle.safeView}>
            <ScrollView style={{ width: '100%', height: '100%' }} contentContainerStyle={commonStyle.scrollViewContainer}>
                <View style={{ flexDirection: 'row', paddingTop: scaleSizeW(20), paddingBottom: scaleSizeW(40) }}>
                    <Text style={{ fontSize: setSpText(26), fontWeight: 'bold', color: '#000' }}>*请使用您收到的邮件中的验证码完成激活</Text>
                </View>
                <View style={commonStyle.fields_line}>
                    <Text style={commonStyle.fields_label}>电子邮箱</Text>
                    <TextInput placeholder='请输入您的电子邮箱' onChangeText={(v) => { this.setState({ Email: v }) }} value={this.state.Email} style={commonStyle.fields_textbox} />
                    <View style={commonStyle.clearBox}>
                        <TouchableOpacity onPress={() => this.clearForm('Email')}>
                            <Image source={clearBoxPng} style={{ width: scaleSizeW(40), height: scaleSizeW(40) }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={commonStyle.fields_line}>
                    <Text style={commonStyle.fields_label}>验证码</Text>
                    <TextInput placeholder='请输入您收到的验证码' onChangeText={(v) => { this.setState({ Code: v }) }} value={this.state.Code} style={commonStyle.fields_textbox} />
                    <View style={commonStyle.clearBox}>
                        <TouchableOpacity onPress={() => this.clearForm('Code')}>
                            <Image source={clearBoxPng} style={{ width: scaleSizeW(40), height: scaleSizeW(40) }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[commonStyle.fields_line]}>
                    <TouchableOpacity onPress={() => this.Save()} style={[commonStyle.fullWidthButton, this.state.Disabled ? commonStyle.fullWidthButton_Disabled : null]}>
                        <Text style={commonStyle.fullWidthButton_text}>激活账号</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Loading show={!this.state.loaded}/>
            <ErrorInfo />
        </SafeAreaView>);
    }
}

export default RegisterActive;
import React, { Component } from 'react'
import { View, StatusBar, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native'
import { SafeAreaView,StackActions, NavigationActions } from 'react-navigation'
import { observer, inject } from 'mobx-react'
import * as api from '../../mocks/api'
import * as tools from '../../tools/tool'
import commonStyle from '../../tools/commonstyles'
import { scaleSize, clearBoxPng, config } from '../../tools/util';
import CustomizeHeader from '../components/customizeheader'

const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'ManagerMain' })
    ]
})
@inject('store')
@observer
class ResetPassword extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: null,
            headerLeft: null,
            headerRight: null,
            headerStyle: {
                height: StatusBar.currentHeight,
                shadowOpacity: 0,
                backgroundColor: '#4576f7',
                borderBottomWidth: 0,elevation: 0,
                borderBottomColor: 'none'
            }
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            OldPassword: '',
            NewPassword: '',
            ConfirmPassword: ''
        }
    }
    clearForm = (fieldName) => {
        switch (fieldName) {
            case 'OldPassword':
                this.setState({
                    OldPassword: ''
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
        let that = this;
        if (this.state.OldPassword === '') {
            Alert.alert('提示', "请输入您的原始密码", [{
                text: '确认', onPress: () => {

                }
            }]);
            return;
        }
        if (this.state.NewPassword === '') {
            Alert.alert('提示', "请输入您的新密码", [{
                text: '确认', onPress: () => {

                }
            }]);
            return;
        }
        if (this.state.ConfirmPassword === '') {
            Alert.alert('提示', "请输入确认密码", [{
                text: '确认', onPress: () => {

                }
            }]);
            return;
        }

        if (this.state.ConfirmPassword !== this.state.NewPassword) {
            Alert.alert('提示', "对不起，两次输入的密码不一致", [{
                text: '确认', onPress: () => {

                }
            }]);
            return;
        }
        api.ChangePassword({
            oldPassword: this.state.OldPassword,
            newPassword: this.state.NewPassword,
            rePassword: this.state.ConfirmPassword
        })
            .then(res => {
                if (res.data.result === 1) {
                    tools.Toast.info('您的密码已修改，请重新登录', 2, () => {
                        tools.LogOut();
                        that.props.navigation.dispatch(resetAction);
                    })

                } else {
                    tools.Toast.fail(res.data.message);
                }
            })
    }
    render() {
        return (<SafeAreaView style={commonStyle.safeViewWithCustomHead}>
            <ScrollView style={[commonStyle.scrollViewContainerLogin, { width: '100%', height: '100%' }]} contentContainerStyle={commonStyle.scrollViewContainer}>
                {/* <View style={commonStyle.formTitle}>
                    <Text style={commonStyle.formTitle_text}>修改密码</Text>
                </View>
                */}
                <View style={[commonStyle.fields_line, { marginTop: scaleSize(20) }]}>
                    <View style={commonStyle.wrapinput}>
                        <TextInput placeholder='请输入原始密码' secureTextEntry={true} onChangeText={(v) => { this.setState({ OldPassword: v }) }} value={this.state.OldPassword} style={commonStyle.fields_textroundbox} />
                        <View style={commonStyle.clearBox}>
                            <TouchableOpacity onPress={() => this.clearForm('OldPassword')}>
                                <Image source={require('../../../images/cha.png')} style={this.state.OldPassword.length > 0 ? [styles.chaimg] : [styles.chaimg, styles.hide]} />
                                {/* <Image source={clearBoxPng} style={{ width: scaleSize(40), height: scaleSize(40) }} /> */}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={commonStyle.fields_line}>
                    <View style={commonStyle.wrapinput}>
                        <TextInput placeholder='请输入您的新密码' secureTextEntry={true} type="password" onChangeText={(v) => { this.setState({ NewPassword: v }) }} value={this.state.NewPassword} style={commonStyle.fields_textroundbox} />
                        <View style={commonStyle.clearBox}>
                            <TouchableOpacity onPress={() => this.clearForm('NewPassword')}>
                                <Image source={require('../../../images/cha.png')} style={this.state.NewPassword.length > 0 ? [styles.chaimg] : [styles.chaimg, styles.hide]} />
                                {/* <Image source={clearBoxPng} style={{ width: scaleSize(40), height: scaleSize(40) }} /> */}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={commonStyle.fields_line}>
                    <View style={commonStyle.wrapinput}>
                        <TextInput placeholder='请确认您的新密码' secureTextEntry={true} type="password" onChangeText={(v) => { this.setState({ ConfirmPassword: v }) }} value={this.state.ConfirmPassword} style={commonStyle.fields_textroundbox} />
                        <View style={commonStyle.clearBox}>
                            <TouchableOpacity onPress={() => this.clearForm('ConfirmPassword')}>
                                <Image source={require('../../../images/cha.png')} style={this.state.ConfirmPassword.length > 0 ? [styles.chaimg] : [styles.chaimg, styles.hide]} />
                                {/* <Image source={clearBoxPng} style={{ width: scaleSize(40), height: scaleSize(40) }} /> */}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={[commonStyle.fields_line, { marginTop: scaleSize(20) }]}>
                    <TouchableOpacity onPress={() => this.Save()} style={[commonStyle.fullWidthButton, this.state.Disabled ? commonStyle.fullWidthButton_Disabled : null]}>
                        <Text style={commonStyle.fullWidthButton_text}>保存</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <CustomizeHeader Title="修改密码" goBack={() => { this.props.navigation.goBack() }} />
        </SafeAreaView>);
    }
}

export default ResetPassword;

const styles = StyleSheet.create({
    chaimg: {
        width: scaleSize(20),
        height: scaleSize(20),
    },
    hide: {
        display: "none"
    }
})

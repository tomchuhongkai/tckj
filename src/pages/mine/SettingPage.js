import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, NativeModules } from 'react-native'
import { SafeAreaView, NavigationActions, StackActions } from 'react-navigation'
import { inject, observer } from 'mobx-react'
import commonStyle from '../../tools/commonstyles'
import { config, scaleSize, scaleSizeW, defaultAvatar } from '../../tools/util'
import CustomizeHeader from '../components/customizeheader'
import * as api from '../../mocks/api'
import * as tools from '../../tools/tool'
import * as locals from '../../tools/localdata'
import * as CacheManager from 'react-native-http-cache';
var ImagePicker = NativeModules.ImageCropPicker;

const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Loading' }),  //Login 要跳转的路由
    ]
})

@inject('store')
@observer
class SettingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cacheSize: '0M'
        }
    }
    logout = () => {
        const { setLoginInfo } = this.props.store.config;
        let that = this;
        tools.LogOut();
        CacheManager.clearCache();
        that.props.screenProps.navigation.dispatch(resetAction);
    }
    componentDidMount = () => {
        let that = this;
        CacheManager.getCacheSize().then(res => {
            let cacheSize = Math.round((res / 1024 / 1024) * 100) / 100 + 'M';
            that.setState({
                cacheSize
            })
        }, err => {
            that.setState({
                cacheSize: '0M'
            })
        })
    }
    clearCache = () => {
        let that = this;
        Alert.alert(
            '清除缓存',
            '您确定要清除缓存吗?',
            [
                { text: '取消', },
                {
                    text: '确定', onPress: () => {
                        locals.ClearStorageInfo();
                        CacheManager.clearCache();
                        that.setState({
                            cacheSize: '0M'
                        })
                    }
                }
            ],
            { cancelable: true });
    }
    pickSingle(cropit, circular = false) {
        const { userInfo } = this.props.store.config;
        if (userInfo.nickName === '') {
            this.props.screenProps.navigation.push('SignIn');
        } else {
            ImagePicker.openPicker({
                width: scaleSize(132),
                height: scaleSize(132),
                cropping: cropit,
                cropperCircleOverlay: circular,
                compressImageMaxWidth: 1000,
                compressImageMaxHeight: 1000,
                compressImageQuality: 1,
                compressVideoPreset: 'MediumQuality',
                includeExif: true,
            }).then(image => {
                this.uploadAvatar(image)
            }).catch(e => {

            });
        }
    }
    uploadAvatar = (image) => {
        let that = this;
        const { setLoginInfo } = this.props.store.config;
        var formData = new FormData();
        let file = {
            uri: image.path,
            type: image.mime,
            name: `avatar-${that.state.userId}.jpeg`,
            size: image.size,
        }
        formData.append("file", file);
        formData.append("ImageSize", 300);
        formData.append("IsAvatar", true);
        api.UploadAvatar(formData)
            .then(res => {
                if (res.data.result === 1) {
                    setLoginInfo({ avatar: res.data.pictureUrl })
                } else {
                    Alert.alert(res.data.message)
                }
            }, err => {
                console.log(err)
            })
    }
    viewProfile = () => {
        if (this.props.store.config.userInfo.nickName !== '') {
            this.props.screenProps.navigation.push("InfoEdit")
        } else {
            this.props.screenProps.navigation.push("SignIn")
        }
    }
    editCertification = () => {
        if (this.props.store.config.userInfo.nickName !== '') {
            this.props.screenProps.navigation.push("Certification")
        } else {
            this.props.screenProps.navigation.push("SignIn")
        }
    }
    render() {
        const { userInfo } = this.props.store.config;
        return (<SafeAreaView style={[commonStyle.safeView, styles.popbg]}>
            <ScrollView>
                <View style={[styles.formRowItem2, { marginTop: scaleSize(20) }]}>
                    <TouchableOpacity underlayColor="#fff" onPress={() => this.pickSingle(false, true)}>
                        <View style={[commonStyle.commonflex, { alignItems: 'center', justifyContent: 'flex-start' }]}>
                            <Image style={styles.avatar} source={userInfo.avatar === '' ? defaultAvatar : { uri: userInfo.avatar }} />
                            <Text style={styles.phonetxt}>{userInfo.nickName === '' ? '请登录' : userInfo.nickName}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.sectiontitle}><Text style={styles.title}>我的设置</Text></View>
                <View style={[styles.formRowItem2]}>
                    <TouchableOpacity style={commonStyle.formRowItem_row} onPress={() => { this.props.screenProps.navigation.push("") }}>
                        <View style={commonStyle.formRowItem_row_left}>
                            <Image style={styles.icon} source={require('../../../images/icon-my-1.png')} />
                            <Text style={commonStyle.rowItem_left_text}>广告投放</Text>
                        </View>
                        <Image style={styles.rightarrow} source={require('../../../images/right-arrow-black.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={commonStyle.formRowItem_row} onPress={() => { this.viewProfile() }}>
                        <View style={commonStyle.formRowItem_row_left}>
                            <Image style={styles.icon} source={require('../../../images/icon-my-11.png')} />
                            <Text style={commonStyle.rowItem_left_text}>资料修改</Text>
                        </View>
                        <Image style={styles.rightarrow} source={require('../../../images/right-arrow-black.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={commonStyle.formRowItem_row} onPress={() => { this.editCertification() }}>
                        <View style={commonStyle.formRowItem_row_left}>
                            <Image style={styles.icon} source={require('../../../images/icon-my-2.png')} />
                            <Text style={commonStyle.rowItem_left_text}>实名认证</Text>
                        </View>
                        <Image style={styles.rightarrow} source={require('../../../images/right-arrow-black.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.sectiontitle}><Text style={styles.title}>系统设置</Text></View>

                <View style={[styles.formRowItem2, { marginBottom: 10 }]}>
                    <TouchableOpacity style={commonStyle.formRowItem_row} onPress={() => { this.props.screenProps.navigation.push("Privacy") }}>
                        <View style={commonStyle.formRowItem_row_left}>
                            <Image style={styles.icon} source={require('../../../images/icon-my-3.png')} />
                            <Text style={commonStyle.rowItem_left_text}>隐私协议</Text>
                        </View>
                        <Image style={styles.rightarrow} source={require('../../../images/right-arrow-black.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={commonStyle.formRowItem_row} onPress={() => { this.props.screenProps.navigation.push("") }}>
                        <View style={commonStyle.formRowItem_row_left}>
                            <Image style={styles.icon} source={require('../../../images/icon-my-4.png')} />
                            <Text style={commonStyle.rowItem_left_text}>版本号</Text>
                        </View>
                        <Text>v{tools.SystemInfo.Version}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={commonStyle.formRowItem_row} onPress={() => { this.clearCache() }}>
                        <View style={commonStyle.formRowItem_row_left}>
                            <Image style={styles.icon} source={require('../../../images/icon-my-5.png')} />
                            <Text style={commonStyle.rowItem_left_text}>清理缓存</Text>
                        </View>
                        <Text>{this.state.cacheSize}</Text>
                    </TouchableOpacity>
                    {userInfo.nickName === '' ? null : <TouchableOpacity style={commonStyle.formRowItem_row} onPress={() => { this.logout() }}>
                        <View style={commonStyle.formRowItem_row_left}>
                            <Image style={styles.icon} source={require('../../../images/icon-my-6.png')} />
                            <Text style={commonStyle.rowItem_left_text}>退出账号</Text>
                        </View>
                        <Image style={styles.rightarrow} source={require('../../../images/right-arrow-black.png')} />
                    </TouchableOpacity>}

                </View>
            </ScrollView>
        </SafeAreaView>)
    }
}

export default SettingPage


const styles = StyleSheet.create({
    popbg: { backgroundColor: '#f4f4f4' },
    avatar: { width: scaleSize(120), height: scaleSize(120), marginRight: scaleSizeW(30), borderRadius: scaleSizeW(60), marginTop: scaleSizeW(15), marginBottom: scaleSizeW(15) },
    phonetxt: { fontSize: scaleSize(30), color: '#333' },
    title: { fontSize: scaleSize(30), color: '#666666' },
    sectiontitle: { paddingHorizontal: scaleSize(30), paddingVertical: scaleSize(20), lineHeight: 1 },
    formRowItem2: {
        paddingLeft: scaleSize(30),
        paddingRight: scaleSize(30),
        backgroundColor: '#fff',

    },
    icon: { width: scaleSize(37), height: scaleSize(37), marginRight: scaleSize(10) },
    rightarrow: { width: scaleSize(15), height: scaleSize(26) },
    margintop: { marginTop: scaleSize(20) },
    aligncenter: { alignItems: 'center', justifyContent: 'center' }
})
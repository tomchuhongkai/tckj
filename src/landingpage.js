import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, StatusBar, DeviceEventEmitter, Platform, NativeModules, Alert } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'
import { observer, inject } from 'mobx-react'
import { setSpText, scaleSizeW } from './tools/util';
import Swiper from 'react-native-swiper';
import SplashScreen from 'react-native-splash-screen'
const { width, height } = Dimensions.get('window')
import * as tools from '../src/tools/tool'
import * as locals from '../src/tools/localdata'
import * as api from '../src/mocks/api' 
import RNFS from 'react-native-fs'
const RNApkInstallerN = NativeModules.RNApkInstallerN
const filePath = RNFS.CachesDirectoryPath + '/com.tongchengkeji.tckj.apk';

@inject('store')
@observer
class LandingPage extends Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            counter: 3,
            showLanding: null,
            showDownload: false,
            percentage: 0
        }
    }
    componentDidMount = () => {
        let that = this;
        SplashScreen.hide();
        DeviceEventEmitter.addListener('SignIn', () => {
            that.props.navigation.replace('SignIn');
        })
        that.checkLogin();
    }
    checkLogin = () => {
        let that = this;
        //判断是否已登录
        const { setLoginInfo } = this.props.store.config;
        locals.LoadUserInfo()
            .then(res => {
                that.props.store.config.setLoginInfo(res);
                if (res.location === null || res.location === '') {
                    that.loadLocations();
                } else {
                    setLoginInfo({ location: res.location });
                    that.checkUpdate();
                }
            })
    }
    loadLocations = () => {
        let that = this;
        const { setLoginInfo } = this.props.store.config;
        locals.LoadLocations()
            .then(res => {
                if (res.length > 0) {
                    setLoginInfo({ location: res[0].title });
                }
                that.checkUpdate();
            })
    }
    checkUpdate = () => {
        let that = this;
        if (Platform.OS === 'android') {
            api.LoadVersion()
                .then(res => {
                    if (!res.data.isLogin) {
                        that.props.store.config.setLoginInfo({
                            token: '',
                            nickName: '',
                            userId: 0,
                            avatar: ''
                        });
                    }
                    if (res.data.version !== tools.SystemInfo.Version) {
                        Alert.alert('提示', '发现新的版本，是否马上更新？', [{
                            text: '取消',
                            onPress: function () {
                                that.loadData();
                            }
                        }, {
                            text: '更新',
                            onPress: function () {
                                tools.LogOut();
                                that.showDownload();
                            }
                        }])
                    } else {
                        that.loadData();
                    }
                }, () => {
                    that.loadData();
                })

        } else {
            that.loadData();
        }
    }
    showDownload = () => {
        try {
            let that = this;
            const download = RNFS.downloadFile({
                fromUrl: `${tools.GetRootUrl()}home/android`,
                toFile: filePath,
                progress: res => {
                    console.log(res)
                    that.setState({
                        percentage: parseInt((res.bytesWritten / res.contentLength).toFixed(2) * 100, 10)
                    })
                },
                progressDivider: 1
            });
            download.promise.then(result => {
                if (result.statusCode == 200) {
                    RNApkInstallerN.install(filePath);
                }
            });
            that.setState({
                showDownload: true
            })
        } catch (ex) {
            console.log(ex)
            Alert.alert('提示', ex.toString());
        }
    }
    loadData = () => {
        //是否已经登录过了
        let that = this;
        tools.GetFromLocal('IsFirstLogin').then(value => {
            let _isShowLanding = value === undefined || value === null || value === "" ? true : false;
            that.setState({
                showLanding: _isShowLanding
            }, () => {
                tools.SetToLocal('IsFirstLogin', false);
                that.redirectToPage();
            })
        }, () => {
            that.setState({
                showLanding: false
            }, () => {
                tools.SetToLocal('IsFirstLogin', false);
                that.redirectToPage();
            })
        })
    }
    redirectToPage = () => {
        let _root = 'ManagerMain';
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: _root }),  //Login 要跳转的路由
            ]
        })
        this.props.navigation.dispatch(resetAction);
    }
    render() {
        if (this.state.showLanding === null || this.state.showLanding == false) {
            return <View style={styles.container}>
                <Image
                    style={styles.image}
                    source={require('../images/launch_screen.jpg')}
                    resizeMode='cover'
                />
                {/* <View style={styles.waiting}>
                    <TouchableOpacity style={styles.waiting_button} onPress={() => this.showDownload()}>
                        <Text style={{ flex: 1, color: '#1890ff', textAlignVertical: 'center', alignSelf: 'center', fontSize: setSpText(26) }}>进入YuanYuan</Text>
                    </TouchableOpacity>
                </View> */}
                <StatusBar
                    backgroundColor={'transparent'}
                    barStyle={'light-content'}
                    translucent={true}
                />
                {this.state.showDownload ? <View style={styles.popMask}></View> : null}
                {this.state.showDownload ? <View style={styles.popContainer}>
                    <View style={styles.loading}>
                        <Text style={styles.loading_text}>下载中</Text>
                        <Text style={styles.loading_text}>{this.state.percentage}%</Text>
                    </View>
                </View> : null}
            </View>;
        }
        return (
            <View style={{ flex: 1, position: 'relative' }}>
                <Swiper style={styles.wrapper} showsButtons={false} loop={false} autoplay={true} autoplayTimeout={2.5}>
                    <View style={styles.container}>
                        <Image
                            style={styles.image}
                            source={require('../images/launch_screen.jpg')}
                            resizeMode='cover'
                        />
                    </View>
                    <View style={styles.container}>
                        <Image
                            style={styles.image}
                            source={require('../images/slide-2.jpg')}
                            resizeMode='cover'
                        />
                        <View style={styles.waiting}>
                            <TouchableOpacity style={styles.waiting_button} onPress={() => this.redirectToPage()}>
                                <Text style={{ flex: 1, color: '#1890ff', textAlignVertical: 'center', alignSelf: 'center', fontSize: setSpText(26) }}>进入YuanYuan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Swiper>
                <StatusBar
                    backgroundColor={'transparent'}
                    barStyle={'light-content'}
                    translucent={true}
                />
            </View>
        );
    }
}
export default LandingPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        position: 'relative'
    },
    backgroundImage: {
        // flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        width,
        height: height + StatusBar.currentHeight,
        backgroundColor: 'transparent',
        position: 'absolute'
    },
    waiting: {
        position: 'absolute',
        bottom: scaleSizeW(100),
        left: 0,
        right: 0,
        zIndex: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        justifyContent: 'center',
        opacity: 1
    },
    waiting_button: {
        height: scaleSizeW(80),
        width: scaleSizeW(300),
        borderWidth: scaleSizeW(1),
        borderColor: '#1890ff',
        borderRadius: scaleSizeW(30),
    },
    image: {
        width,
        height: height + StatusBar.currentHeight,
    },
    popMask: {
        position: 'absolute',
        backgroundColor: '#000',
        opacity: .8,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 999
    },
    popContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
    , loading: {
        width: scaleSizeW(160),
        height: scaleSizeW(160),
        borderRadius: scaleSizeW(80),
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loading_text: {
        color: '#000',
        fontSize: setSpText(30)
    }
});
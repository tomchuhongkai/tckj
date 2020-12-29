import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar, Dimensions, Linking } from 'react-native'
import { SafeAreaView, NavigationActions, StackActions } from 'react-navigation'
import { inject, observer } from 'mobx-react'
import commonStyle from '../../tools/commonstyles'
import { config, scaleSize, setSpText, scaleSizeW, clearBoxPng, defaultAvatar } from '../../tools/util'
import CustomizeHeader from '../components/customizeheader'
import RightButton from '../components/rightButton'
import BackButton from '../components/backButton'
import HeaderTitle from '../components/headerTitle'
import AutoHeightWebView from 'react-native-autoheight-webview-fix'
import * as api from '../../mocks/api'
import Waiting from '../commons/waiting'
var _this;

@inject('store')
@observer
class InfoEditPage extends Component {
    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            loaded: false,

        }
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
        // this.loadData();
    }
    loadData = () => {
        let that = this;
        let id = this.props.navigation.getParam('id');
        api.GetNewsDetail(id)
            .then(res => {
                that.setState({
                    loaded: true,
                    Detail: res.data
                })

            })
    }

    render() {
        // if (!this.state.loaded) {
        //     return (<Waiting />);
        // }

        return (<SafeAreaView style={[commonStyle.safeViewWithCusHead,commonStyle.safeView]}>
            <StatusBar
                animated={true}
                hidden={false}
                backgroundColor={'transparent'}
                translucent={true}
                barStyle={'light-content'}
            />
            <ScrollView>
                {/* <View style={styles.sectiontitle}><Text style={styles.title}>详细介绍</Text></View> */}
                <View style={[styles.formRowItem2]}>
                    <TouchableOpacity style={commonStyle.formRowItem_row} onPress={() => { this.props.navigation.push("NicknameEdit") }}>
                        <View style={commonStyle.formRowItem_row_left}>
                            <Text style={commonStyle.rowItem_left_text}>昵称</Text>
                        </View>
                        <View style={commonStyle.formRowItem_row_left}>
                            <Text style={{color:"#666",marginRight:scaleSize(10)}}>
                                {this.props.store.config.userInfo.nickName}
                            </Text>
                            <Image style={styles.rightarrow} source={require('../../../images/right-arrow-black.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={commonStyle.formRowItem_row} onPress={() => { this.props.navigation.push("ResetPassword") }}>
                        <View style={commonStyle.formRowItem_row_left}>
                            <Text style={commonStyle.rowItem_left_text}>密码修改</Text>
                        </View>
                        <Image style={styles.rightarrow} source={require('../../../images/right-arrow-black.png')} />
                    </TouchableOpacity>
                </View>






            </ScrollView>
            <CustomizeHeader Title="资料修改"  theme="blue" goBack={() => { this.props.navigation.goBack() }}>
                </CustomizeHeader>
        </SafeAreaView>)
    }
}

export default InfoEditPage


const styles = StyleSheet.create({
    popbg: { backgroundColor: '#f4f4f4' },
    avatar: { width: scaleSize(134), height: scaleSize(134), marginRight: scaleSizeW(30) },
    phonetxt: { fontSize: scaleSize(30), color: '#333' },
    sectiontitle: { borderLeftWidth: scaleSize(10), borderLeftColor: '#4576f7', paddingLeft: scaleSize(20), marginVertical: scaleSize(20) },
    title: { fontSize: scaleSize(32), color: '#333' },
    formRowItem2: {
        paddingLeft: scaleSize(30),
        paddingRight: scaleSize(30),
        backgroundColor: '#fff',

    },
    icon: { width: scaleSize(37), height: scaleSize(37), marginRight: scaleSize(10) },
    rightarrow: { width: scaleSize(15), height: scaleSize(26) },
    margintop: { marginTop: scaleSize(20) },
    aligncenter: { alignItems: 'center', justifyContent: 'center' },
    leftimg: { width: scaleSize(184), height: scaleSize(184), borderRadius: 4, marginRight: scaleSize(10) },
    righttext: { height: scaleSize(184), justifyContent: 'space-around', flex: 1 },
    item: { borderBottomColor: '#eeeeee', borderBottomWidth: scaleSize(1), marginBottom: scaleSize(20) },
    iconaddress: { width: scaleSize(22), height: scaleSize(26) },
    txtaddress: { marginLeft: scaleSize(10), marginRight: scaleSize(40), fontSize: scaleSize(24), color: '#a2a2a4', width: scaleSize(300) },
    txttime: { fontSize: scaleSize(24), color: '#b7b7b7' },
    item50: { flexDirection: 'row', marginBottom: scaleSize(28), width: '50%' },
    itemtitle: { color: '#777777', fontSize: scaleSize(28), marginRight: scaleSize(28) },
    itemtext: { color: '#161616', fontSize: scaleSize(28) },
    desctext: { color: '#777777', fontSize: scaleSize(28) },
    descimg: { marginBottom: scaleSize(28) },
    btncontact: { marginBottom: scaleSize(28), backgroundColor: '#4576f7' }
})

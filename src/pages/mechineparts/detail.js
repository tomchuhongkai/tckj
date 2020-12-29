import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar, Dimensions } from 'react-native'
import { SafeAreaView, NavigationActions, StackActions } from 'react-navigation'
import { inject, observer } from 'mobx-react'
import commonStyle from '../../tools/commonstyles'
import { config, scaleSize, setSpText, scaleSizeW, clearBoxPng, defaultAvatar } from '../../tools/util'
import CustomizeHeader from '../components/customizeheader'
import RightButton from '../components/rightButton'
import BackButton from '../components/backButton'
import HeaderTitle from '../components/headerTitle'
import AutoHeightImage from 'react-native-auto-height-image'
import Swiper from 'react-native-swiper'
import * as api from '../../mocks/api'
import AutoHeightWebView from 'react-native-autoheight-webview-fix'
const customStyle = "<style>* {max-width: 100%;} body {font-family: sans-serif;} h1 {color: red;}</style>";
const descimgwidth = Dimensions.get('window').width - 40;
const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'AuthLogin' }),  //Login 要跳转的路由
    ]
})

// @inject('store')
// @observer
class MachinePartDetail extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <HeaderTitle Title="详情" />,
            headerLeft: <BackButton color="white" goBack={navigation.goBack} />,
            headerRight: <RightButton />,
            headerStyle: {
                height: config.headerHeight+StatusBar.currentHeight,
                shadowOpacity: 0,
                backgroundColor: '#4576f7',
                paddingTop:StatusBar.currentHeight
            }
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            data: {
                "id": 1,
                "name": "",
                "brands": [],
                "photos": [],
                "storeName": "桐城科技",
                "productAttributes": "[]",
                "price": 0,
                "quantity": 1000.0000,
                "soldOut": 100.0000,
                "viewCount": 0,
                "description": ""
            },
            WebViewHeight: scaleSizeW(200)
        }
    }
    componentDidMount = () => {
        this.loadInfo();
    }
    loadInfo = () => {
        let that = this;
        let id = this.props.navigation.getParam('id');
        api.GetMachinePartDetail(id)
            .then(res => {
                that.setState({ data: res.data.data });
            })
    }
    renderbrands() {
        var brands = []
        if (this.state.data.brands.length > 0) {
            brands = this.state.data.brands.map((item, index) => {
                return item.name;
            });
        }
        return brands.join()
    }
    renderattrs() {
        if (this.state.data.productAttributes.length > 0) {
            this.state.data.productAttributes.map((item, index) => {
                return (<View style={styles.item50}>
                    <Text style={styles.itemtitle}>{item.Name}</Text>
                    <Text style={styles.itemtext}>鞋面机</Text>
                </View>)
            });
        }
    }


    render() {
        var slides = null;
        if (this.state.data != null && this.state.data.photos.length > 0) {
            slides = this.state.data.photos.map((item, index) => {
                return (<View style={styles.bannerimg} key={index}>
                    <Image style={styles.bannerimg} source={{ uri: item.thumbnal }} />
                </View>);
            });
        }
        // const { profile } = this.props.store.comunity_profile;
        return (<SafeAreaView style={[commonStyle.safeView, styles.popbg]}>
            <StatusBar
                animated={true}
                hidden={false}
                backgroundColor={'transparent'}
                translucent={true}
                barStyle={'light-content'}
            />
            <ScrollView>
                <View style={styles.banner}>
                    {slides !== null && slides.length > 0 ?
                        <Swiper>
                            {slides}
                        </Swiper> : null}
                </View>
                <View style={commonStyle.postshow}>

                    <Text numberOfLines={2} style={commonStyle.postdesc}>
                        {"【" + this.state.data.storeName + "】" + this.state.data.name}
                    </Text>
                    <View style={styles.priceshow}><Text>价格：</Text><Text style={styles.pricetxt}>￥{this.state.data.price}</Text></View>
                </View>

                <View style={[styles.formRowItem2, styles.margintop]}>
                    <View style={styles.sectiontitle}><Text style={styles.title}>信息</Text></View>
                    <View style={styles.item}>
                        <View style={[commonStyle.formRowItem_row_left, { flexWrap: 'wrap' }]}>

                            <View style={styles.item50}>
                                <Text style={styles.itemtitle}>品牌</Text>
                                <Text style={styles.itemtext}>{this.renderbrands()}</Text>
                            </View>


                        </View>
                    </View>

                </View>

                <View style={[styles.formRowItem2, styles.margintop]}>
                    <View style={styles.sectiontitle}><Text style={styles.title}>详细介绍</Text></View>
                    {/* <Text numberOfLines={2} style={styles.desctext}>
                        
                    </Text> */}
                    <AutoHeightWebView
                        style={{ width: Dimensions.get('window').width, }}
                        customScript={`document.body.style.background = 'lightyellow';`}
                        customStyle={`
                        * {
                            font-family: 'Times New Roman';
                        }
                        p {
                            font-size: 16px;
                        }
                        `}
                        files={[{
                            href: 'cssfileaddress',
                            type: 'text/css',
                            rel: 'stylesheet'
                        }]}
                        source={{ html: this.state.data.description }}
                        scalesPageToFit={true}
                        viewportContent={'width=device-width, user-scalable=no'}
                    />
                </View>
                <View style={[styles.formRowItem2, styles.margintop]}>
                    <TouchableOpacity style={[commonStyle.fullWidthButton, styles.btncontact]} onPress={() => { }}>
                        <Text style={commonStyle.fullWidthButton_text}>联系卖家</Text>
                    </TouchableOpacity>
                </View>



            </ScrollView>
            {/* <CustomizeHeader Title="设置" goBack={() => this.props.navigation.goBack()} /> */}
        </SafeAreaView>)
    }
}

export default MachinePartDetail


const styles = StyleSheet.create({
    banner: {
        width: scaleSize(750),
        height: scaleSize(750)
    },
    bannerimg: {
        width: scaleSize(750),
        height: scaleSize(750),
    },
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
    btncontact: { marginBottom: scaleSize(28), backgroundColor: '#4576f7' },
    priceshow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end' },
    pricetxt: { color: 'red', fontSize: scaleSizeW(36), fontWeight: 'bold' }
})

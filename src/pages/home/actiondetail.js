import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar, Linking } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { inject, observer } from 'mobx-react'
import commonStyle from '../../tools/commonstyles'
import { config, scaleSize, setSpText, scaleSizeW } from '../../tools/util'
import CustomizeHeader from '../components/customizeheader'
import Swiper from 'react-native-swiper';
import AutoHeightWebView from 'react-native-autoheight-webview-fix'
import * as api from '../../mocks/api'
import { Toast } from '../../tools/tool'
import Loading from '../components/loading'
import * as tools from '../../tools/tool'


@inject('store')
@observer
class ActionDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            currentview: 1,
            Banners: [{ "image": require('../../../images/desc-img1.png') }, { "image": require('../../../images/desc-img1.png') }],
            Detail: {
                "id": 0,
                "categoryId": 0,
                "categoryName": "",
                "title": "",
                "subTitle": null,
                "source": null,
                "shortDesc": null,
                "description": null,
                "strCreatedOn": "一周前",
                "pictures": [],
                "bidItems": [],
                "customAttributes": null
            }
        }
    }
    static navigationOptions = () => {
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
        this.loadData();
        let that = this;
        this.interval = setInterval(() => {
            that.refreshAuction()
        }, 5000);
    }
    componentWillUnmount = () => {
        clearInterval(this.interval);
        this.interval = null;
    }
    refreshAuction = () => {
        let that = this;
        let id = this.props.navigation.getParam('id');
        api.RefreshAuction(id)
            .then(res => {
                let _model = Object.assign({}, this.state.Detail, { amount: res.data.price, endTime: res.data.endTime, status: res.data.status });
                that.setState({
                    Detail: _model
                });
            })
    }
    loadData = () => {
        let that = this;
        let id = this.props.navigation.getParam('id');
        api.GetAuctionDetail(id)
            .then(res => {
                that.setState({
                    loaded: true,
                    Detail: res.data
                })

            })
    }

    callUser = (tel) => {
        const url = `tel:${tel}`;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                return Alert.alert('提示', `您的设备不支持该功能，请手动拨打 ${tel}`, [
                    { text: '确定' }
                ]);
            }
            return Linking.openURL(url);
        }).catch(err => Alert(err));
    }



    desc() {
        return (<View style={[styles.formRowItem2, styles.margintop]}>
            <View style={styles.sectiontitle}><Text style={styles.title}>详细介绍</Text></View>

            <AutoHeightWebView
                style={{ width: "100%" }}
                customScript={`document.body.style.background = 'white';`}
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
                source={{ html: this.state.Detail.description }}
                scalesPageToFit={true}
                viewportContent={'width=device-width, user-scalable=no'}
            />
        </View>)
    }
    joinaction = (id, type) => {
        const { userInfo } = this.props.store.config;
        if (userInfo.nickName === '') {
            this.props.navigation.navigate('SignIn')
            return;
        }
        api.JoinAuction({
            auctionId: id,
            joinType: type
        })
            .then(res => {
                if (res.data.result === 1) {
                    this.loadData()
                } else {
                    Toast.info(res.data.message);
                }
            })
    }
    doaction = (id, price) => {
        const { userInfo } = this.props.store.config;
        if (userInfo.nickName === '') {
            this.props.navigation.navigate('SignIn')
            return;
        }
        api.DoAuction({
            auctionId: id,
            bidPrice: price
        })
            .then(res => {
                if (res.data.result === 0) {
                    Toast.fail(res.data.message)
                }
                else {
                    Toast.success('出价成功', 0.5, () => {
                        this.loadData()
                    });
                }

            })
    }
    goToBaoMing = () => {
        let that = this;
        const { userInfo } = this.props.store.config;
        if (userInfo.nickName === '') {
            this.props.navigation.navigate('SignIn')
            return;
        }
        const { Detail } = this.state;
        this.props.navigation.push('BaoMing', {
            id: Detail.id,
            callBack: () => {
                that.loadData()
            }
        })
    }
    render() {
        const { Detail } = this.state;
        var slides = null;
        let tabview;

        tabview = (<View style={[styles.formRowItem2]}>
            <AutoHeightWebView
                style={{ width: "100%" }}
                customScript={`document.body.style.background = 'white';`}
                customStyle={`
                 * {
                     font-family: 'Times New Roman';
                 }
                 p {
                     font-size: 14px;
                 }
                 `}
                files={[{
                    href: 'cssfileaddress',
                    type: 'text/css',
                    rel: 'stylesheet'
                }]}
                source={{ html: this.state.Detail.description }}
                scalesPageToFit={true}
                viewportContent={'width=device-width, user-scalable=no'}
            />
        </View>)

        if (this.state.currentview === 2) {
            tabview = (<View style={[styles.formRowItem2]}>
                {/* <View style={styles.sectiontitle}><Text style={styles.title}>详细介绍</Text></View> */}
                <AutoHeightWebView
                    style={{ width: "100%", }}
                    customScript={`document.body.style.background = 'white';`}
                    customStyle={`
                    * {
                        font-family: 'Times New Roman';
                    }
                    p {
                        font-size: 14px;
                    }
                    `}
                    files={[{
                        href: 'cssfileaddress',
                        type: 'text/css',
                        rel: 'stylesheet'
                    }]}
                    source={{ uri: `${tools.GetRootUrl()}` + 'Home/TopicDetail?systemName=gonggao' }}
                    scalesPageToFit={true}
                    viewportContent={'width=device-width, user-scalable=no'}
                />

            </View>)
        }
        if (this.state.currentview === 3) {
            tabview = (<View style={[styles.formRowItem2]}>
                {/* <View style={styles.sectiontitle}><Text style={styles.title}>详细介绍</Text></View> */}
                <AutoHeightWebView
                    style={{ width: "100%", }}
                    customScript={`document.body.style.background = 'white';`}
                    customStyle={`
                    * {
                        font-family: 'Times New Roman';
                    }
                    p {
                        font-size: 14px;
                    }
                    `}
                    files={[{
                        href: 'cssfileaddress',
                        type: 'text/css',
                        rel: 'stylesheet'
                    }]}
                    source={{ uri: `${tools.GetRootUrl()}` + 'Home/TopicDetail?systemName=canpaixize' }}
                    scalesPageToFit={true}
                    viewportContent={'width=device-width, user-scalable=no'}
                />

            </View>)
        }
        if (this.state.currentview === 4) {
            let bititems
            if (Detail.bidItems.length === undefined || Detail.bidItems.length === 0) {
                bititems = <View><Text style={{ fontSize: scaleSize(24), textAlign: 'center', margin: scaleSize(30) }}>没有更多出价记录...</Text></View>
            }
            else {
                bititems = Detail.bidItems.map((item, index) => {
                    let zhuangtai = "";
                    if (item.isWinner) {
                        zhuangtai = "成交";
                    } else {
                        if (index === 0) {
                            zhuangtai = "领先";
                        }
                        else { zhuangtai = "出局"; }
                    }
                    return (<View key={index} style={styles.jiluitem}><Text style={[styles.txt11, (item.isWinner || index === 0) ? styles.bidwin : styles.bidout]}>{zhuangtai}</Text><Text style={styles.txt11}>{item.userNickName}</Text><Text style={styles.txt11}>{item.bidPrice}</Text><Text style={[styles.txt11, { flex: 1 }]}>{item.strCreatedOn}</Text></View>)
                })
            }
            tabview = (<View style={styles.jilu}>
                <View style={styles.jiluitem}><Text style={styles.txt9}>状态</Text><Text style={styles.txt9}>昵称</Text><Text style={styles.txt9}>价格</Text><Text style={[styles.txt9, { flex: 1 }]}>时间</Text></View>
                <View style={styles.jiluitems}>{bititems}</View>
            </View>)
        }

        if (Detail.photos != null && Detail.photos.length > 0) {
            slides = Detail.photos.map((item, index) => {
                return (<View style={[styles.bannerimg, { height: scaleSize(400) + StatusBar.currentHeight }]} key={index}>
                    <Image style={[styles.bannerimg, { height: scaleSize(400) + StatusBar.currentHeight }]} source={{ uri: item.thumbnal }} />
                </View>);
            });
        }

        let topstatus;
        let rendbtn;
        let focusauction;
        if (Detail.status === 5) {
            topstatus = (<View style={styles.actionstatus}>
                <View style={[styles.statustxt, { backgroundColor: '#19aa6b' }]}><Text style={{ color: '#fff', fontSize: scaleSize(24), paddingHorizontal: scaleSize(50) }}>即将开始</Text>
                    <Image style={styles.statusimg} source={require('../../../images/sanjiao.png')} />
                </View>
                <View style={styles.actiontime}>
                    <Text style={{ lineHeight: scaleSize(60) }}>{Detail.startTime} 开始</Text>
                </View>
            </View>)
        }
        if (Detail.status === 1) {
            topstatus = (<View style={styles.actionstatus}>
                <View style={[styles.statustxt]}><Text style={{ color: '#fff', fontSize: scaleSize(24), paddingHorizontal: scaleSize(50) }}>正在进行</Text>
                    <Image style={styles.statusimg} source={require('../../../images/sanjiao.png')} />
                </View>
                <View style={styles.actiontime}>
                    <Text style={{ lineHeight: scaleSize(60) }}>预计{Detail.endTime} 结束</Text>
                </View>
            </View>)
        }
        if (Detail.status === 10) {
            topstatus = (<View style={styles.actionstatus}>
                <View style={[styles.statustxt, { backgroundColor: '#777' }]}><Text style={{ color: '#fff', fontSize: scaleSize(24), paddingHorizontal: scaleSize(50) }}>已结束</Text>
                    <Image style={styles.statusimg} source={require('../../../images/sanjiao.png')} />
                </View>
                <View style={styles.actiontime}>
                    <Text style={{ lineHeight: scaleSize(60) }}>{Detail.endTime}</Text>
                </View>
            </View>)
        }
        if (Detail.status === 5 && !Detail.joinBid) {
            rendbtn = (<TouchableOpacity onPress={() => { this.goToBaoMing() }}><View style={styles.actionbtn}><Text style={styles.txt4}>立即报名</Text><Text style={styles.txt5}>保证金 ￥{Detail.deposit}</Text></View></TouchableOpacity>)
        }
        else if (Detail.status === 1 && !Detail.joinBid) {
            rendbtn = (<TouchableOpacity onPress={() => { this.goToBaoMing() }}><View style={styles.actionbtn}><Text style={styles.txt4}>立即报名</Text><Text style={styles.txt5}>保证金 ￥{Detail.deposit}</Text></View></TouchableOpacity>)
        }
        else if (Detail.status === 5 && Detail.joinBid) {
            if (Detail.isBidPaid) {
                rendbtn = (<TouchableOpacity onPress={() => { this.joinaction(Detail.id, 2) }}><View style={styles.actionbtn}><Text style={styles.txt4}>已报名，等开始</Text><Text style={styles.txt5}>保证金 ￥{Detail.deposit}</Text></View></TouchableOpacity>)
            } else {
                rendbtn = (<TouchableOpacity onPress={() => { this.goToBaoMing() }}><View style={styles.actionbtn}><Text style={styles.txt4}>去付款</Text><Text style={styles.txt5}>保证金 ￥{Detail.deposit}</Text></View></TouchableOpacity>)
            }
        }
        else if (Detail.status === 1 && Detail.joinBid) {
            if (Detail.isBidPaid) {
                rendbtn = (<TouchableOpacity onPress={() => { this.doaction(Detail.id, Detail.amount + Detail.addBidPrice) }}><View style={styles.actionbtn}><Text style={styles.txt4}>￥{Detail.amount + Detail.addBidPrice} 确认出价</Text></View></TouchableOpacity>)
            } else {
                rendbtn = (<TouchableOpacity onPress={() => { this.goToBaoMing() }}><View style={styles.actionbtn}><Text style={styles.txt4}>去付款</Text><Text style={styles.txt5}>保证金 ￥{Detail.deposit}</Text></View></TouchableOpacity>)
            }
        }
        if (Detail.status <= 5) {
            if (Detail.isFocused) {
                focusauction = (<TouchableOpacity onPress={() => { this.joinaction(Detail.id, 1) }}><View style={styles.actionfocus}>
                    <Image style={styles.focusimg} source={require('../../../images/loved.png')} />
                    <Text style={styles.txt7}>已关注</Text></View></TouchableOpacity>)
            }
            else {
                focusauction = (<TouchableOpacity onPress={() => { this.joinaction(Detail.id, 1) }}><View style={styles.actionfocus}>
                    <Image style={styles.focusimg} source={require('../../../images/love.png')} /><Text style={styles.txt6}>关注</Text></View></TouchableOpacity>)
            }
        }
        return (<SafeAreaView style={[commonStyle.safeViewWithCusHead, styles.popbg]}>
            <StatusBar
                animated={true}
                hidden={false}
                backgroundColor={'transparent'}
                translucent={true}
                barStyle={'light-content'}
            />
            {this.state.loaded ? <ScrollView>
                <View style={styles.banner}>
                    <View style={[styles.homeprosearch]}>
                        {topstatus}


                    </View>
                    {slides !== null && slides.length > 0 ?
                        <Swiper>
                            {slides}
                        </Swiper> : null}
                </View>
                <View style={styles.actiontitle}>

                    <Text numberOfLines={2} style={styles.titlename}>
                        {Detail.title}
                    </Text>
                    <View style={[commonStyle.commonflexbetween, { alignItems: 'flex-end' }]}>
                        <Text style={{ color: '#666', fontSize: scaleSize(20), marginRight: scaleSize(10) }}>当前价</Text>
                        <Text style={{ color: '#e65e46', fontSize: scaleSize(36), fontWeight: 'bold' }}>￥{Detail.amount}</Text>
                    </View>
                    <View style={[commonStyle.commonflexbetween, { paddingTop: scaleSize(10) }]}>
                        <Text style={styles.txt1}>{Detail.participants}人报名</Text>
                        <Text style={styles.txt1}>{Detail.focusedCount}人关注</Text>
                        {/* <Text style={styles.txt1}>4000人围观</Text> */}
                    </View>
                </View>
                <View>
                    <View style={{ padding: scaleSize(20) }}><Text style={{ fontSize: scaleSize(22) }}>备备网竞价零佣金、公开、透明、高效</Text></View>
                </View>
                <View style={styles.actioninfo}>
                    <View style={commonStyle.commonflexbetween}><Text style={styles.txt2}>保证金</Text><Text style={styles.txt3}>￥{Detail.deposit}</Text></View>
                    <View style={commonStyle.commonflexbetween}>
                        <View style={[commonStyle.commonflexbetween, styles.halfwidth]}>
                            <Text style={styles.txt2}>起始价</Text>
                            <Text style={styles.txt3}>￥{Detail.startPrice}</Text></View>
                        <View style={[commonStyle.commonflexbetween, styles.halfwidth]}>
                            <Text style={styles.txt2}>加价幅度</Text>
                            <Text style={styles.txt3}>￥{Detail.addBidPrice}</Text></View>
                    </View>
                    <View style={commonStyle.commonflexbetween}>
                        <View style={[commonStyle.commonflexbetween, styles.halfwidth]}>
                            <Text style={styles.txt2}>评估价</Text>
                            <Text style={styles.txt3}>￥{Detail.ratePrice}</Text></View>
                        <View style={[commonStyle.commonflexbetween, styles.halfwidth]}>
                            <Text style={styles.txt2}>优先购买权人</Text>
                            <Text style={styles.txt3}>无</Text></View>
                    </View>
                    <View style={commonStyle.commonflexbetween}>
                        <View style={[commonStyle.commonflexbetween, styles.halfwidth]}>
                            <Text style={styles.txt2}>竞价周期</Text>
                            <Text style={styles.txt3}>一天</Text></View>
                        <View style={[commonStyle.commonflexbetween, styles.halfwidth]}>
                            <Text style={styles.txt2}>延时周期</Text>
                            <Text style={styles.txt3}>5分钟</Text></View>
                    </View>
                </View>

                <View style={styles.tabsview}>
                    <TouchableOpacity onPress={() => this.setState({ currentview: 1 })} >
                        <View style={[styles.tabview, this.state.currentview === 1 ? styles.currenttab : null]}><Text style={styles.txt8}>标的物介绍</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ currentview: 2 })} >
                        <View style={[styles.tabview, this.state.currentview === 2 ? styles.currenttab : null]}><Text style={styles.txt8}>竞买公告</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ currentview: 3 })} >
                        <View style={[styles.tabview, this.state.currentview === 3 ? styles.currenttab : null]}><Text style={styles.txt8}>竞买须知</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ currentview: 4 })} >
                        <View style={[styles.tabview, this.state.currentview === 4 ? styles.currenttab : null]}><Text style={styles.txt8}>竞买记录（{Detail.bidItems.length}）</Text></View>
                    </TouchableOpacity>
                </View>
                <View>
                    {tabview}
                </View>


            </ScrollView> : null}
            {this.state.loaded ? <View style={styles.applyaction}>
                {focusauction}
                {rendbtn}
            </View> : null}
            <CustomizeHeader style={{ borderBottomColor: '#dedede', borderBottomWidth: scaleSizeW(1) }} Title="详情" goBack={() => { this.props.navigation.goBack() }}>
            </CustomizeHeader>
            <Loading show={!this.state.loaded} />
        </SafeAreaView>)
    }
}

export default ActionDetail


const styles = StyleSheet.create({
    banner: {
        width: scaleSize(750),
        height: scaleSize(400)
    },
    homeprosearch: {
        position: 'absolute',
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        width: scaleSize(750),
        zIndex: 99
    },
    bannerimg: {
        width: scaleSize(750),
        height: scaleSize(400),
    },
    actionstatus: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    statusimg: {
        width: scaleSize(11),
        height: scaleSize(60),
        opacity: 0.8
    },
    txt8: {
        fontSize: scaleSize(26),
        marginHorizontal: scaleSize(10)
    },
    actiontime: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        height: scaleSize(60),
        opacity: 0.8
    },
    statustxt: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#4576f7',
    },
    actiontitle: {
        padding: scaleSizeW(20),
        backgroundColor: '#fff'
    },
    titlename: {
        fontSize: scaleSizeW(30),
        color: '#111010'
    },
    txt1: {
        color: '#666',
        fontSize: scaleSize(22),
        marginRight: scaleSize(20)
    },
    actioninfo: {
        backgroundColor: '#fff',
        padding: scaleSize(20)
    },
    halfwidth: { width: scaleSize(345) },
    txt2: { color: '#333', marginRight: scaleSize(10), marginBottom: scaleSize(10) },
    txt3: { color: '#777', flex: 1, marginBottom: scaleSize(10) },
    applyaction: {
        paddingVertical: scaleSize(20), flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionbtn: {
        backgroundColor: '#4576f7', borderBottomLeftRadius: scaleSize(30), borderTopLeftRadius: scaleSize(30), flexDirection: 'column', height: scaleSize(80),
        justifyContent: 'center', width: scaleSize(600),
        alignItems: 'center', padding: scaleSize(10)
    },
    actionfocus: {
        flexDirection: 'column', alignItems: 'center', width: scaleSize(150),
        justifyContent: 'center'
    },
    focusimg: { width: scaleSize(32), height: scaleSize(32), marginBottom: scaleSize(4) },
    txt4: { color: '#fff', fontWeight: 'bold' },
    txt5: { color: '#fff', fontSize: scaleSize(20) },
    txt6: { color: '#515151', fontSize: scaleSize(20) },
    txt7: { color: '#e65e46', fontSize: scaleSize(20) },
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
    item: { marginBottom: scaleSize(20) },
    iconaddress: { width: scaleSize(22), height: scaleSize(26) },
    txtaddress: { marginLeft: scaleSize(10), marginRight: scaleSize(40), fontSize: scaleSize(24), color: '#a2a2a4', width: scaleSize(300) },
    txttime: { fontSize: scaleSize(24), color: '#b7b7b7' },
    item50: { flexDirection: 'row', marginBottom: scaleSize(28), width: '50%' },
    itemtitle: { color: '#777777', fontSize: scaleSize(28), marginRight: scaleSize(28), width: scaleSize(140) },
    itemtext: { color: '#161616', fontSize: scaleSize(28) },
    desctext: { color: '#777777', fontSize: scaleSize(28) },
    descimg: { marginBottom: scaleSize(28) },
    btncontact: { marginBottom: scaleSize(28), backgroundColor: '#4576f7' },
    tabsview: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    tabview: { padding: scaleSize(10), borderTopColor: '#fff', borderTopWidth: scaleSize(3) },
    currenttab: { backgroundColor: '#fff', borderTopColor: '#4576f7' },
    jilu: { padding: scaleSize(20) },
    jiluitem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    txt9: { fontWeight: 'bold', color: '#444', fontSize: scaleSize(24), textAlign: 'center', padding: scaleSize(8), width: scaleSize(130), textAlign: 'center' },
    txt11: { color: '#444', fontSize: scaleSize(22), textAlign: 'center', padding: scaleSize(8), width: scaleSize(130), textAlign: 'center' },
    bidwin: { color: '#d91615' },
    bidout: { color: '#848484' }
})

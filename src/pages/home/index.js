import React, { Component } from 'react'
import {SafeAreaView, Animated, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, StatusBar, Dimensions, NativeModules } from 'react-native'
import { scaleSize, setSpText, scaleSizeW, Icons } from "../../tools/util";
import Swiper from 'react-native-swiper';
import commonStyle from '../../tools/commonstyles'
import * as api from '../../mocks/api'
import { observer, inject } from 'mobx-react';
import Waiting from '../commons/waiting'
import PostPicker from '../components/postpicker'
import BottomItems from '../components/bottomitems';
import Loading from '../components/loading'
const {StatusBarManager}=NativeModules;
let statusBarHeight;
	if (Platform.OS === "ios") {
	     StatusBarManager.getHeight(height => {
	         statusBarHeight = height.height;
	     });
	 } else {
	     statusBarHeight = StatusBar.currentHeight;
}

const { width, height } = Dimensions.get('window');
const interval = null

@inject("store")
@observer
class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Banners: [],
            OldMachines: [],
            NewMachines: [],
            Show: false,
            activePage: 0,
            homenews: [],
            totalRegisterUser: 0,
            totalDownloadUser: 0,
            isShowTop: true, count: 0
        }
    }
    static navigationOptions = {
        header: null
    }
    componentDidMount = () => {
        this.loadData();
        this.interval = setInterval(() => {
            this.setState({
                count: this.state.count + 1,
            })
            if (this.state.count === 8) {
                clearInterval(interval);
                this.setState({ isShowTop: !this.state.isShowTop, });
            }
        }, 1000)
    }
    componentWillUnmount = () => {
        clearInterval(this.interval);
        this.interval = null;
    }

    onScrollAnimationEnd = (e) => {
        // 求出当前的页码
        var currentPage = Math.floor(e.nativeEvent.contentOffset.x / width);
        // 更新状态机
        this.setState({
            activePage: currentPage
        });
    }


    loadData = (location) => {
        let that = this;
        const { userInfo } = this.props.store.config;
        if (location == undefined && userInfo.location !== '') {
            location = userInfo.location;
        }
        api.GetHomePage(location)
            .then(res => {
                that.setState({
                    Banners: res.data.banners,
                    OldMachines: res.data.oldMachines,
                    NewMachines: res.data.newMachines,
                    Show: true,
                    totalRegisterUser: res.data.totalRegisterUser,
                    totalDownloadUser: res.data.totalDownloadUser
                })
            })



        api.GetNewsList({ type: 'xwjd' })
            .then(res => {
                that.setState({
                    homenews: res.data.data, 
                })
            })

    }
    ShowLocation = () => {
        let that = this;
        this.props.navigation.push('LocationSelector', {
            callBack: (title) => {
                that.loadData(title);
            }
        });
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
    // 当一帧滚动结束的时候调用
    onScrollAnimationEnd = (e) => {
        // 求出当前的页码
        var currentPage = Math.floor((e.nativeEvent.contentOffset.x / width) * 6);
        // 更新状态机
        this.setState({
            activePage: currentPage
        });
    }
    renderIndicator() {
        var indicatorArr = [], style;
        for (var i = 0; i < 2; i++) {
            style = (i === this.state.activePage) ? { color: 'orange', backgroundColor: "#4575f6" } : { color: 'gray', backgroundColor: "#ccc" }
            indicatorArr.push(
                <View key={i} style={[{ width: 10, height: 2, marginRight: scaleSize(4) }, style]}></View>
            );
        }
        return indicatorArr;
    }

    changeRowItem = (row) => {
        var index = this.state.OldMachines.findIndex(x => x.id == row.id);
        if (index != -1) {
            var machines = this.state.OldMachines.slice();
            machines[index] = Object.assign({}, machines[index], row);
            this.setState({
                OldMachines: machines
            })
        }
    }
    setdirect = (item) => {
        switch (item) {
            case '1':
                this.props.navigation.push("PostNewMachine");
                break;
            case '2':
                this.props.navigation.push("Ershouji");
                break;
            case '3':
                this.props.navigation.push("Pinggu");
                break;
            case '4':
                this.props.navigation.push("Hengji");
                break;
            case '5':
                this.props.navigation.push("ZhaofahuoForm", { type: "FindProducts" });
                break;
            case '6':
                this.props.navigation.push("ZhaofahuoForm", { type: "SendProducts" });
                break;
            case '7':
                this.props.navigation.push("ZhaofahuoForm", { type: "YXCXProducts" });
                break;
            case '8':
                this.props.navigation.push("Advertisement");
                break;
            default:
                break;
        }
    }
    render() {
        var slides = null;
        var newsslides = [];
        const { userInfo } = this.props.store.config;
        if (!this.state.Show) {
            return null;
        }
        if (this.state.Banners != null && this.state.Banners.length > 0) {
            slides = this.state.Banners.map((item, index) => {
                return (<View style={[styles.bannerimg, { height: scaleSize(300) + statusBarHeight }]} key={index}>
                    <TouchableOpacity onPress={() => this.props.navigation.push('AdvDetail', { id: item.id })}>
                        <Image resizeMode={'cover'} style={[styles.bannerimg, { height: scaleSize(250) + statusBarHeight }]} source={{ uri: item.image }} />
                    </TouchableOpacity>
                </View>);
            });
        }

        if (this.state.homenews != null && this.state.homenews.length > 0) {
            newsslides = this.state.homenews.map((item, index) => {
                return (
                    <View key={index} style={{ display: 'flex',height:scaleSize(60), alignItems: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.push('AdvDetail', { id: item.id })}>
                            <Text numberOfLines={2} style={[{fontSize:scaleSizeW(21),color:"#333"}]}>{item.title}</Text>
                        </TouchableOpacity>
                    </View>
                )
            })
        }
        let postdata = [{ key: "1", value: '新机器' }, { key: "2", value: '二手机' }, { key: "3", value: '免费评估' }, { key: "4", value: '机器服务' }, { key: "5", value: '我要找货' }, { key: "6", value: '我要发货' }, { key: "7", value: '服装处理' }, { key: "8", value: '广告投放' }];
        return (
        <View style={styles.container}>
           
            {this.state.isShowTop ?
                <View style={[styles.tongzhi,{top:scaleSize(80) + statusBarHeight}]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: scaleSize(45), height: scaleSize(45), marginRight: scaleSize(6) }} source={require('../../../images/laba.gif')} />
                        <Text style={{ color: '#fff' }}>下载量{this.state.totalDownloadUser}次，注册人数{this.state.totalRegisterUser}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { clearInterval(this.interval); this.setState({ isShowTop: false }) }}>
                        <Image style={{ width: scaleSize(21), height: scaleSize(21) }} source={require('../../../images/close-white.png')} />
                    </TouchableOpacity>
                </View> : null
            }
            <ScrollView style={{ width: '100%', height: '100%' }}
                keyboardShouldPersistTaps={'always'}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[commonStyle.scrollViewContainer]}>

                <View style={styles.banner}>
                    <View style={[styles.homeprosearch, { paddingTop: scaleSize(5) + statusBarHeight}]}>
                        <Image style={{ width: scaleSize(60), height: scaleSize(45) }} source={require('../../../images/logo-white.png')} />
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.push('PopHistory', {
                                type: ''
                            })
                        }} style={styles.searchinput}>
                            <Image style={styles.searchimg} source={require('../../../images/icon-search.png')} />
                            <Text style={styles.searchkey}>请输入关键词</Text>
                        </TouchableOpacity>
                        <PostPicker Items={postdata}
                            onChange={(v) => {
                                this.setdirect(v)
                            }}
                            keyName={'key'} valueName={'value'}
                        />
                    </View>
                    {slides !== null && slides.length > 0 ?
                        <Swiper>
                            {slides}
                        </Swiper> : null}
                </View>
                <ScrollView ref='scrollview'
                    horizontal={true}
                    pagingEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={this.onScrollAnimationEnd}
                >
                    <View style={styles.itemtab}>
                        <TouchableOpacity style={styles.hometab} onPress={() => this.props.navigation.navigate('NewMechine')}>
                            <View>
                                <Image style={styles.hometabimg} source={require('../../../images/icon-tab-2.png')} />
                                <Text style={styles.hometabtxt}>新机器</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.hometab} onPress={() => this.props.navigation.navigate('Zhaofahuo')}>
                            <View>
                                <Image style={styles.hometabimg} source={require('../../../images/icon-tab-1.png')} />
                                <Text style={styles.hometabtxt}>找发货</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.itemtab}>
                        <TouchableOpacity style={styles.hometab} onPress={() => this.props.navigation.navigate('SecondMechine')}>
                            <View>
                                <Image style={styles.hometabimg} source={require('../../../images/icon-tab-3.png')} />
                                <Text style={styles.hometabtxt}>二手机</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.hometab} onPress={() => this.props.navigation.navigate('MechineParts')}>
                            <Image style={styles.hometabimg} source={require('../../../images/icon-tab-6.png')} />
                            <Text style={styles.hometabtxt}>买配件</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.itemtab}>
                        <TouchableOpacity style={styles.hometab} onPress={() => this.props.navigation.push('Pinggu')}>
                            <View>
                                <Image style={styles.hometabimg} source={require('../../../images/icon-tab-4.png')} />
                                <Text style={styles.hometabtxt}>免费评估</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.hometab} onPress={() => this.props.navigation.push('Actions')}>
                            <View>
                                <Image style={styles.hometabimg} source={require('../../../images/icon-auction.png')} />
                                <Text style={styles.hometabtxt}>在线竞价</Text>
                            </View></TouchableOpacity>

                    </View>
                    <View style={styles.itemtab}>
                        <TouchableOpacity style={styles.hometab} onPress={() => this.props.navigation.push('ServiceList')}>
                            <View>
                                <Image style={styles.hometabimg} source={require('../../../images/icon-tab-5.png')} />
                                <Text style={styles.hometabtxt}>机器服务</Text>
                            </View></TouchableOpacity>
                        <TouchableOpacity style={styles.hometab} onPress={() => this.props.navigation.navigate('Forums', { name: '服装处理' })}>
                            <View>
                                <Image style={styles.hometabimg} source={require('../../../images/icon-tab-11.png')} />
                                <Text style={styles.hometabtxt}>服装处理</Text>
                            </View></TouchableOpacity>
                    </View>
                    <View style={styles.itemtab}>

                        <TouchableOpacity onPress={() => { this.props.navigation.push('JoinUs') }} style={styles.hometab}>
                            <Image style={styles.hometabimg} source={require('../../../images/icon-tab-9.png')} />
                            <Text style={styles.hometabtxt}>合作加盟</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.hometab} onPress={() => {
                            this.props.navigation.push('Advertisement')
                        }}>
                            <Image style={styles.hometabimg} source={require('../../../images/icon-tab-10.png')} />
                            <Text style={styles.hometabtxt}>广告投放</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.itemtab}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Forums', { name: '人力资源' }) }} style={styles.hometab}>
                            <Image style={styles.hometabimg} source={require('../../../images/icon-tab-8.png')} />
                            <Text style={styles.hometabtxt}>人力资源</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.hometab} onPress={() => this.props.navigation.push('Forums')}>
                            <View>
                                <Image style={styles.hometabimg} source={require('../../../images/icon-tab-7.png')} />
                                <Text style={styles.hometabtxt}>论坛</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
                <View style={styles.indicatorViewStyle}>
                    {this.renderIndicator()}
                </View>



                <View style={styles.greybg}>

                    {/* 焦点start */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: scaleSize(6), backgroundColor: "#fff", padding: scaleSize(18) }}>
                        <View style={{ marginRight: scaleSize(10), height: scaleSizeW(60), display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            {/* <Image source={require('../../../images/fire.png')} style={{ width: scaleSizeW(32), height: scaleSizeW(32), marginRight: scaleSizeW(10) }} /> */}
                            <Image source={require('../../../images/jiaodian.jpg')} style={{ width: scaleSizeW(180), height: scaleSizeW(60), marginLeft: scaleSizeW(10) }} />
                            {/* <Text style={{backgroundColor:"red"}}>备备</Text> */}
                            {/* <Text style={{ fontSize: setSpText(26) }}>热点</Text>*/}
                        </View>
                        <Swiper
                            horizontal={false} autoplay={true} height={scaleSizeW(60)}  showsPagination={false}>
                            {newsslides}
                        </Swiper>

                    </View>
                    {/* 焦点end */}



                    <View style={commonStyle.title1}>
                        <Image style={commonStyle.leftborder} source={require('../../../images/title-border.png')} />
                        <Text style={commonStyle.title1txt}>新机器推荐</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('NewMechine')}>
                            <Text style={commonStyle.titlemore}>更多</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={commonStyle.cols2pros}>
                        {this.renderNewMachines()}
                    </View>
                    <View style={commonStyle.title1}>
                        <Image style={commonStyle.leftborder} source={require('../../../images/title-border.png')} />
                        <Text style={commonStyle.title1txt}>二手机推荐</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SecondMechine')}>
                            <Text style={commonStyle.titlemore}>更多</Text>
                        </TouchableOpacity>
                    </View>
                    {this.renderOldMachines()}
                </View>
            </ScrollView>
            <StatusBar
                backgroundColor={'transparent'}
                barStyle={'light-content'}
                translucent={true}
            />
        </View>)
    }
    renderOldMachines = () => {
        return this.state.OldMachines.map((item, index) => {
            return (
                <View key={index} style={commonStyle.postshow}>
                    {item.user.isShiMing && item.user.isCompany ? <View style={commonStyle.companyHeader}>
                        <Image source={{ uri: item.user.avatar }} style={[commonStyle.avatar,{width:scaleSize(70),height:scaleSize(70)}]} />
                        <View style={commonStyle.companyColumn}>
                            <View style={commonStyle.companyTitle}><Text style={commonStyle.companyTitleText}>{item.user.realOrCompanyName}</Text></View>
                            <View style={commonStyle.companyRow}>
                                <View style={commonStyle.companyIcon}>
                                    <Image source={Icons.ShiMingIcon} style={commonStyle.companyShiMingIcon} />
                                </View>
                                <View style={[commonStyle.companyYearIcon]}>
                                    <Text style={commonStyle.companySmallText}>第{item.user.years}年</Text>
                                </View>
                            </View>
                        </View>
                    </View> : null}
                    <TouchableOpacity onPress={() => { this.props.navigation.push('MachineDetail', { id: item.id, callBack: this.changeRowItem }) }} key={index} >
                        <View style={commonStyle.posttop}>
                            <View style={commonStyle.posttype}>
                                <Text style={commonStyle.posttypetxt}>{item.properties.PersonCompany}</Text>
                            </View>
                            {item.properties.IsJiMai === '是' ? <View style={commonStyle.posttype}><Text style={commonStyle.posttypetxt}>急卖</Text></View> : null}
                            <Text style={[commonStyle.posttime, { marginLeft: scaleSizeW(4) }]}>{item.createdOn}</Text>
                            <View style={{ flex: 1 }}></View>
                            <Image style={commonStyle.postphone} source={require('../../../images/icon-phone.png')} />
                            <TouchableOpacity onPress={() => { this.callUser(item.properties.ContactPhone) }}>
                                <Text style={commonStyle.phonetxt}>马上拨打</Text>
                            </TouchableOpacity>
                        </View>
                        <Text numberOfLines={2} style={commonStyle.postdesc}>
                            {item.title}
                        </Text>
                        {item.properties.Address === undefined || item.properties.Address === '' ? null : <View style={commonStyle.postinfo}>
                            <Image style={commonStyle.postpition} source={require('../../../images/icon-address.png')} />
                            <Text style={commonStyle.postaddress}>{item.properties.ContactPerson}</Text>
                            {/* <Text style={commonStyle.posttime}>{item.createdOn}</Text> */}
                        </View>}
                        <View style={commonStyle.postImgs}>
                            {item.pictures.length == 0 ? null : item.pictures.map((pic, subIndex) => {
                                return (<View key={subIndex}><Image style={commonStyle.postImg} source={{ uri: pic.thumbnal }} /></View>)
                                // return (<TouchableOpacity onPress={() => { this.props.navigation.navigate("MyModal", { list: item.pictures, index: subIndex }) }} key={subIndex}><Image style={commonStyle.postImg} source={{ uri: pic.thumbnal }} /></TouchableOpacity>)
                            })}
                        </View>
                    </TouchableOpacity>
                    <View style={{ marginTop: scaleSize(10) }}>
                        <Text style={{ fontSize: scaleSize(20), color: "#666" }}>{item.viewCount}人浏览过</Text>
                    </View>
                    <View style={[commonStyle.postshow, { marginBottom: 0, paddingBottom: 0, paddingHorizontal: scaleSizeW(0) }]}>
                        <BottomItems {...this.props} changeRow={this.changeRowItem} item={item} styles={{ borderTopWidth: 0, marginVertical: 0, paddingTop: 0 }} />
                    </View>
                </View>
            )
        })
    }
    renderNewMachines = () => {
        return this.state.NewMachines.map((item, index) => {
            return (
                <TouchableOpacity onPress={() => { this.props.navigation.push('MachineDetail', { id: item.id }) }} key={index} style={commonStyle.cols2pro}>
                    <View style={commonStyle.proimgcontainer}>
                        {item.pictures.length == 0 ? <Image style={commonStyle.proimg} source={require('../../../images/test-product.jpg')} /> :
                            <Image style={commonStyle.proimg} source={{ uri: item.pictures[0].thumbnal }} />}
                    </View>
                    <Text style={commonStyle.protitle1} numberOfLines={1}>{item.title}</Text>
                    <Text style={commonStyle.protitle2} numberOfLines={1}>{item.properties.MachineBrand}</Text>
                    <TouchableOpacity onPress={() => { this.props.navigation.push('MachineDetail', { id: item.id }) }} style={[commonStyle.bluebtn, styles.mart10]}>
                        <Text style={commonStyle.promore}>点击查看详情</Text>
                    </TouchableOpacity>
                </TouchableOpacity>)
        })
    }
}
const styles = StyleSheet.create({
    container: {
        position: 'relative'
    },
    banner: {
        width: scaleSize(750),
        height: scaleSize(360),
       
    },
    bannerimg: {
        width: scaleSize(750),
        height: scaleSize(360)
    },
    homeprosearch: {
        position: 'absolute',
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        padding: scaleSize(30),
        zIndex: 99
    },
    homeadd: {
        width: scaleSize(36),
        height: scaleSize(36),
        marginLeft: scaleSize(50)
    },
    location: {
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
    },
    locname: {
        color: '#fff',
        fontSize: scaleSize(30)
    },
    locdown: {
        width: scaleSize(17),
        height: scaleSize(10),
        marginLeft: scaleSize(4)
    },
    searchinput: {
        width: scaleSize(501),
        height: scaleSize(52),
        borderRadius: scaleSize(10),
        paddingLeft: scaleSize(15),
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        marginLeft: scaleSize(10)
    },
    searchimg: {
        width: scaleSize(27),
        height: scaleSize(29),
        marginRight: scaleSize(15)
    },
    searchkey: {
        color: '#bfbfbf',
        fontSize: scaleSize(24)
    },
    hometags: {
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: scaleSize(10),
        paddingRight: scaleSize(10),
        marginTop: scaleSize(30)
    },
    secline: {
        marginBottom: scaleSize(30)
    },
    itemtab: {
        width: width / 5,
    },
    hometab: {
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: 'center',
        height: scaleSize(140)

        // width: '20%',
        // display: 'flex'
    },
    hometabimg: {
        width: scaleSize(65),
        height: scaleSize(65),
        marginBottom: scaleSize(20),
        alignSelf: 'center'
    },
    hometabtxt: {
        fontSize: scaleSize(22)
    },
    greybg: {
        backgroundColor: '#f4f4f4'
    },
    mart10: {
        marginTop: scaleSize(15)
    },
    indicatorViewStyle: {
        flexDirection: 'row',
        justifyContent: 'center', marginBottom: scaleSize(10)
    },
    tongzhi: {
        // top: scaleSize(120),
        position: 'absolute',  zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.7)', flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', paddingVertical: scaleSize(4), paddingLeft: scaleSize(4), paddingRight: scaleSize(20), borderRadius: scaleSize(28),
        width: scaleSize(540), left: (width - scaleSize(540)) / 2
    },

})

export default HomePage
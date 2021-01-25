import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar } from 'react-native'
import { SafeAreaView, NavigationActions, StackActions } from 'react-navigation'
import { inject, observer } from 'mobx-react'
import commonStyle from '../../tools/commonstyles'
import { config, scaleSize, setSpText, scaleSizeW, clearBoxPng, defaultAvatar } from '../../tools/util'
import CustomizeHeader from '../components/customizeheader'
import Waiting from '../commons/waiting'
import * as api from '../../mocks/api'
import Loading from '../components/loading'

const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'AuthLogin' }),  //Login 要跳转的路由
    ]
})

@inject('store')
@observer
class AuctionPage extends Component {
    static navigationOptions = () => {
        return {
            headerTitle: null,
            headerLeft: null,
            headerRight: null,
            headerStyle: {
                height: StatusBar.currentHeight,
                shadowOpacity: 0,
                backgroundColor: '#4576f7',
                elevation: 0,
                borderBottomWidth: 0,
            }
        }
    }
    constructor(props) {
        super(props);
        let that = this;
        this.state = {
            Categories: [],
            Data1: [],
            Data2: [],
            Data3: [],
            show1: false,
            show2: false,
            show3: false
        }

    }
    componentDidMount = () => {
        this.loadData();
    }
    loadData = () => {
        let that = this;
        api.GetMyAuctions(1)
            .then(res => {
                that.setState({
                    Data1: res.data,
                    show1: true
                })
            }, () => {
                that.setState({
                    show1: true
                })
            })
        api.GetMyAuctions(2)
            .then(res => {
                that.setState({
                    Data2: res.data,
                    show2: true
                })
            }, () => {
                that.setState({
                    show2: true
                })
            })
        api.GetMyAuctions(3)
            .then(res => {
                that.setState({
                    Data3: res.data,
                    show3: true
                })
            }, () => {
                that.setState({
                    show3: true
                })
            })
    }
    renderdata1 = () => {
        if (this.state.Data1 === null || this.state.Data1.length === 0) {
            return (<View style={{ padding: scaleSize(30), alignItems: 'center' }}><Text style={commonStyle.commonText}>暂无关注的拍卖</Text></View>)
        }
        return this.state.Data1.map((item, index) => {
            return this.renderItems(item, index)
        });
    }
    renderdata2 = () => {
        if (this.state.Data2 === null || this.state.Data2.length === 0) {
            return (<View style={{ padding: scaleSize(30), alignItems: 'center' }}><Text style={commonStyle.commonText}>暂无报名的拍卖</Text></View>)
        }
        return this.state.Data2.map((item, index) => {
            return this.renderItems(item, index)
        });
    }
    renderdata3 = () => {
        if (this.state.Data3 === null || this.state.Data3.length === 0) {
            return (<View style={{ padding: scaleSize(30), alignItems: 'center' }}><Text style={commonStyle.commonText}>暂无成功的拍卖</Text></View>)
        }
        return this.state.Data3.map((item, index) => {
            return this.renderItems(item, index)
        });
    }
    renderItems = (item, index) => {
        let auctioninfo;
        if (item.status === 5) {
            auctioninfo = (<View>
                <View style={styles.comingprice}>
                    <Text style={styles.txt1}>起拍</Text>
                    <Text style={styles.txt2}>￥</Text>
                    <Text style={styles.txt3}>{item.startPrice}</Text>
                </View>
                <Text style={styles.endtime}>{item.startTime}开拍</Text></View>)
        }
        else if (item.status === 8) {
            auctioninfo = (<View>
                <View style={styles.comingprice}>
                    <Text style={styles.txt1}>起拍</Text>
                    <Text style={styles.txt2}>￥</Text>
                    <Text style={styles.txt3}>{item.startPrice}</Text>
                </View>
                <Text style={styles.endtime}>流拍中</Text></View>)
        }
        else if (item.status === 1) {
            auctioninfo = (<View>
                <View style={styles.comingprice}>
                    <Text style={styles.redtxt1}>当前</Text>
                    <Text style={styles.redtxt2}>￥</Text>
                    <Text style={styles.redtxt3}>{item.startPrice}</Text>
                </View>
                <Text style={styles.endtime}>预计{item.endTime}结束</Text></View>)
        }
        else if (item.status === 10) {
            auctioninfo = (<View>
                <View style={styles.comingprice}>
                    <Text style={styles.redtxt1}>当前</Text>
                    <Text style={styles.redtxt2}>￥</Text>
                    <Text style={styles.redtxt3}>{item.startPrice}</Text>
                </View>
                <Text style={styles.endtime}>已结束</Text></View>)
        }
        return (
            <TouchableOpacity key={index} onPress={() => { this.props.navigation.push('ActionDetail', { id: item.id }) }}>
                <View style={styles.actionslist}>


                    <Image style={styles.actionsimg} source={{ uri: item.photos[0].thumbnal }} />

                    <View style={styles.actioninfo}>
                        <Text numberOfLines={2} style={commonStyle.postdesc}>
                            {item.title}
                        </Text>
                        {auctioninfo}


                    </View>


                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (<SafeAreaView style={[commonStyle.safeView, styles.popbg]}>
            <ScrollView>
                <View style={[styles.formRowItem2, styles.margintop]}>
                    <View style={styles.sectiontitle}>
                        <Text style={styles.title}>成功的竞价</Text>
                    </View>
                    {this.renderdata3()}
                </View>
                <View style={[styles.formRowItem2, styles.margintop]}>
                    <View style={styles.sectiontitle}>
                        <Text style={styles.title}>我的报名</Text>
                    </View>
                    {this.renderdata2()}
                </View>
                <View style={[styles.formRowItem2, styles.margintop]}>
                    <View style={styles.sectiontitle}>
                        <Text style={styles.title}>我的关注</Text>
                    </View>
                    {this.renderdata1()}
                </View>
            </ScrollView>
            <Loading show={!this.state.show1 || !this.state.show2 || !this.state.show3}/>
            <CustomizeHeader goBack={() => this.props.navigation.goBack()} Title="我的竞价" theme='blue' />
        </SafeAreaView>)
    }
}

export default AuctionPage


const styles = StyleSheet.create({
    popbg: { backgroundColor: '#f4f4f4' },
    avatar: { width: scaleSize(134), height: scaleSize(134), marginRight: scaleSizeW(30) },
    phonetxt: { fontSize: scaleSize(30), color: '#333' },
    sectiontitle: { borderLeftWidth: scaleSize(10), borderLeftColor: '#ec5947', paddingLeft: scaleSize(20), marginVertical: scaleSize(20) },
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
    item: { borderBottomColor: '#eeeeee', borderBottomWidth: scaleSize(1), marginBottom: scaleSize(20), paddingBottom: scaleSize(20) },
    iconaddress: { width: scaleSize(22), height: scaleSize(26) },
    txtaddress: { marginLeft: scaleSize(10), marginRight: scaleSize(40), fontSize: scaleSize(24), color: '#a2a2a4', width: scaleSize(300) },
    txttime: { fontSize: scaleSize(24), color: '#b7b7b7' },
    actionslist: {
        paddingHorizontal: scaleSizeW(20),
        paddingVertical: scaleSizeW(10),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: "center",
    }, actionsimg: {
        width: scaleSizeW(300),
        height: scaleSize(200),
        borderRadius: scaleSizeW(20)
    },
    actioninfo: {
        flex: 1,
        height: scaleSizeW(240),
        paddingLeft: scaleSizeW(20),
        marginLeft: scaleSize(20),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderBottomColor: '#ccc',
        paddingBottom: scaleSizeW(30),
        borderBottomWidth: scaleSizeW(1)
    },
    endtime: {
        fontSize: scaleSize(22),
        color: '#999'
    },
    comingprice: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        marginBottom: scaleSizeW(10)
    },
    txt1: {
        fontWeight: 'bold',
        fontSize: scaleSizeW(22),
        color: '#19aa6b',
        marginRight: scaleSize(10)
    },
    txt2: {
        fontWeight: 'bold',
        fontSize: scaleSizeW(22),
        color: '#19aa6b'
    },
    txt3: {
        fontWeight: 'bold',
        fontSize: scaleSizeW(34),
        color: '#19aa6b'
    },
    redtxt1: {
        fontWeight: 'bold',
        fontSize: scaleSizeW(22),
        color: '#C21F3A',
        marginRight: scaleSize(10)
    },
    redtxt2: {
        fontWeight: 'bold',
        fontSize: scaleSizeW(22),
        color: '#C21F3A'
    },
    redtxt3: {
        fontWeight: 'bold',
        fontSize: scaleSizeW(34),
        color: '#C21F3A'
    }
})

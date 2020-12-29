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
import AutoHeightImage from 'react-native-auto-height-image';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient'
import * as api from '../../mocks/api'
import { Toast } from '@ant-design/react-native'
import Waiting from '../commons/waiting'
import CustomAttribute from '../components/customattribute'
import Alipay from '../../tools/alipay'

const descimgwidth = Dimensions.get('window').width - 40;
var _this;

@inject('store')
@observer
class BaoMing extends Component {
    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            loaded: false,
            checked: false,
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
    }
    loadData = () => {
        let that = this;
        let id = this.props.navigation.getParam('id');
        api.GetAuctionDetail(id)
            .then(res => {
                console.log(res.data)
                that.setState({
                    loaded: true,
                    Detail: res.data
                })

            })
    }
    joinaction = (id, type) => {
        let that = this;
        const { Detail } = this.state;
        if (Detail.joinBid) {
            that.doalipay();
        } else {
            api.JoinAuction({
                auctionId: id,
                joinType: type
            })
                .then(res => {
                    if (res.data.result === 1) {
                        that.doalipay();
                    } else {
                        Toast.info(res.data.message);
                    }
                })
        }
    }
    doalipay = () => {
        api.PayForBid(this.state.Detail.bidId)
            .then(res => {
                console.log(res.data);
                let data = res.data;
                let ret = Alipay.pay(data);
                console.log(ret)
            })
    }
    doaction = (id, price) => {
        //this.doalipay()
        api.DoAuction({
            auctionId: id,
            bidPrice: price
        })
            .then(res => {
                console.log(res.data)
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
    render() {
        const { Detail } = this.state;
        const { userInfo } = this.props.store.config;
        let checked = require('../../../images/circle-active.png');
        let unChecked = require('../../../images/circle-inactive.png');
        let imgpot = require('../../../images/messages2.png');
        let rendimg;
        if (this.state.checked) {
            rendimg = (<TouchableOpacity onPress={() => { this.setState({ checked: !this.state.checked }) }}>
                <Image source={checked} style={styles.readimg} />
            </TouchableOpacity>);
        }
        else {
            rendimg = (<TouchableOpacity onPress={() => { this.setState({ checked: !this.state.checked }) }}>
                <Image source={unChecked} style={styles.readimg} />
            </TouchableOpacity>);
        }
        if (!this.state.loaded) {
            return (<Waiting />);
        }

        return (<SafeAreaView style={[commonStyle.safeViewWithCusHead, styles.popbg]}>
            <StatusBar
                animated={true}
                hidden={false}
                backgroundColor={'transparent'}
                translucent={true}
                barStyle={'light-content'}
            />
            <ScrollView style={{ backgroundColor: '#E9EAEB' }}>
                <LinearGradient colors={['#4576f7', '#E9EAEB',]}>
                    <View style={styles.topinfo}>
                        <Text style={styles.txt1}>预缴款</Text>
                        <Text style={styles.txt2}>{Detail.deposit}</Text>
                        <View style={styles.baomingbox}>
                            <View style={[styles.flexrow, styles.marginb20]}>
                                <Text style={styles.txt3}>竞买人</Text>
                                <Text style={styles.txt4}>{Detail.loginUser.userName}</Text>
                            </View>
                            <View style={styles.flexrow}>
                                <Text style={styles.txt3}>手机号</Text>
                                <Text style={styles.txt4}>{Detail.loginUser.phone}</Text>
                            </View>
                        </View>
                        <View style={styles.baomingbox}>
                            <View style={styles.flexrow}>
                                {rendimg}
                                <Text style={styles.txt6}>竞买人知晓并同意以下事项</Text>

                            </View>
                            <View style={[styles.flexrow, styles.readlist]}>
                                <Image source={imgpot} style={styles.readimgli} />
                                <TouchableOpacity onPress={() => { this.props.navigation.push("XiZe") }}><Text style={styles.txt10}>已阅读知晓：竞买人信息披露、拍下不买后果、未实地看样等参拍细则</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.flexrow, styles.readlist]}>
                                <Image source={imgpot} style={styles.readimgli} />
                                <Text style={styles.txt7}>已阅读并知晓：本次报名仅代表本人，未接受他人委托参与竞买。</Text>
                            </View>
                            <View style={[styles.flexrow, styles.readlist]}>
                                <Image source={imgpot} style={styles.readimgli} />
                                <TouchableOpacity onPress={() => { this.props.navigation.push("XieYi") }}>
                                    <Text style={styles.txt10}>已阅读并同意竞拍服务协议</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View></View>
                </LinearGradient>
                <View style={styles.notice}>
                    <Text style={styles.txt5}>
                        温馨提示
                            </Text>
                    <Text style={styles.txt8}>
                        请提前安排时间确认产品质量，有任何疑问都可致电13800990099咨询。
                            </Text>
                </View>
            </ScrollView>
            <View style={{ backgroundColor: '#fff', paddingVertical: scaleSize(20) }}>
                <View style={styles.applyaction}>
                    <TouchableOpacity onPress={() => { this.joinaction(Detail.id, 2) }}><View style={styles.actionbtn}><Text style={styles.txt9}>去支付</Text></View></TouchableOpacity>
                </View>
            </View>
            <CustomizeHeader style={{ borderBottomColor: '#dedede', borderBottomWidth: scaleSizeW(1) }} Title="报名参加" goBack={() => { this.props.navigation.goBack() }}>
            </CustomizeHeader>
        </SafeAreaView>)
    }
}

export default BaoMing


const styles = StyleSheet.create({
    txt1: {
        color: '#fff',
        fontSize: scaleSize(24),
        marginTop: scaleSize(20),
        marginHorizontal: scaleSize(20)
    },
    txt2: {
        color: '#fff',
        fontSize: scaleSize(60),
        marginTop: scaleSize(10),
        marginHorizontal: scaleSize(20)
    },
    baomingbox: {
        width: scaleSize(720),
        borderRadius: scaleSize(20),
        backgroundColor: '#fff',
        borderWidth: scaleSize(1),
        borderColor: '#ddd',
        marginLeft: scaleSize(15),
        padding: scaleSize(30),
        marginTop: scaleSize(30)
    },
    flexrow: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    txt3: {
        color: '#333',
        width: scaleSize(180)
    },
    txt4: {
        color: '#000',
        fontSize: scaleSize(30),
        fontWeight: 'bold',
        flex: 1
    },
    marginb20: {
        marginBottom: scaleSize(20)
    },
    readimg: {
        width: scaleSize(40),
        height: scaleSize(40)
    },
    txt6: {
        fontSize: scaleSize(30),
        color: '#000',
        marginLeft: scaleSize(20)
    },
    readimgli: {
        width: scaleSize(20),
        height: scaleSize(20),
        marginTop: scaleSize(10),
        marginRight: scaleSize(20)
    },
    txt7: {
        fontSize: scaleSize(26),
        width: scaleSize(600)
    },
    txt10: {
        fontSize: scaleSize(26),
        width: scaleSize(600),
        color: '#4576f7'
    },
    readlist: {
        alignItems: 'flex-start',
        paddingTop: scaleSize(20)
    },
    notice: {
        marginTop: scaleSize(30),
        padding: scaleSize(20)
    },
    txt5: {
        color: '#444',
        marginBottom: scaleSize(15)
    },
    txt8: {
        color: '#444',
    },
    actionbtn: {
        width: '90%',
        backgroundColor: '#ec5947',
        borderWidth: scaleSizeW(1),
        borderColor: '#ec5947',
        borderRadius: scaleSizeW(35),
        height: scaleSizeW(70),
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    txt9: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: scaleSize(30)
    }
})

import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Linking, RefreshControl, StatusBar, SafeAreaView } from 'react-native'
import { observer, inject } from 'mobx-react'
import { config, scaleSize, setSpText, scaleSizeW, clearBoxPng, defaultAvatar } from '../../tools/util'
import commonStyle from '../../tools/commonstyles'
import * as api from '../../mocks/api'
import * as tools from '../../tools/tool'
import BackButton from '../components/backButton'
import RightButton from '../components/rightButton'
import HeaderTitle from '../components/headerTitle'
import CustomizeHeader from "../components/customizeheader";

var _this;
@inject('store')
@observer
class ServiceList extends Component {

    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            refreshing: false,
            isFirstTime: true,
            Data: [],
            Filter: {
                type: 'MechineService',
                name: '',
                page: 1,
                location: '',
                pageSize: 20
            }
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
    // static navigationOptions = ({ navigation }) => {
    //     return {
    //         headerTitle: <HeaderTitle Title="机器服务" />,
    //         headerLeft: <BackButton color={"white"} goBack={() => { _this.props.navigation.goBack() }} />,
    //         headerRight: <RightButton children={<TouchableOpacity
    //             onPress={() => _this.props.navigation.navigate('Hengji', { callBack: () => { that.loadData({ page: 1 }, true) } })}><View><Image style={styles.homeadd} source={require('../../../images/icon-add.png')} /></View></TouchableOpacity>} />,
    //         headerStyle: {
    //             height: config.headerHeight + StatusBar.currentHeight,
    //             shadowOpacity: 0,
    //             backgroundColor: '#4576f7',
    //             paddingTop: StatusBar.currentHeight

    //         }
    //     }

    // }

    componentDidMount = () => {
        let that = this;
        this.loadData();


    }
    loadData = (filter, refresh) => {
        let that = this;
        const { userInfo } = this.props.store.config;
        if (filter === undefined || filter === null) {
            filter = {};
        }
        filter.location = userInfo.location;
        filter = Object.assign({}, this.state.Filter, filter);
        api.GetNewsList(filter)
            .then(res => {
                var data = [];
                if (refresh) {
                    data = res.data.data;
                } else {
                    data = this.state.Data.slice();
                    data = data.concat(res.data.data);
                }
                that.setState({
                    Data: data,
                    Filter: filter,
                    isFirstTime: false
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
    refresh = () => {
        this.loadData({
            page: 1
        }, true);
    }
    reachEnd = () => {
        const { pageCount, page } = this.state.Filter;
        if (page < pageCount) {
            this.loadData({ page: page + 1 }, false);
        }
    }
    renderItems = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.push('Detail', {
                    id: item.id, callBack: () => {
                        this.loadData({ page: 1 }, true)
                    }
                })
            }}>
                <View style={[commonStyle.postshow, styles.ershouji]}>
                    <View style={styles.ershoujicontent}>
                        <Text numberOfLines={2} style={commonStyle.postdesc}>
                            {item.title}
                        </Text>
                        <View style={commonStyle.postinfo}><Text style={styles.priceshow}>{item.customAttributes.ServiceFee.value}</Text></View>
                        <View style={commonStyle.postinfo}>
                            <Image style={commonStyle.postpition} source={require('../../../images/icon-account.png')} />
                            <Text style={commonStyle.postaddress}>{item.customAttributes.ContactPerson.value}</Text>
                            <Text style={commonStyle.posttime}>{item.strCreatedOn}</Text>
                            <View style={styles.telinfo}>
                                <Image style={commonStyle.postphone} source={require('../../../images/icon-phone.png')} />
                                <TouchableOpacity onPress={() => { this.callUser(item.customAttributes.ContactPhone.value) }}>
                                    <Text style={commonStyle.phonetxt}>马上拨打</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    _keyExtractor = (item) => { return item.id.toString(); }
    render() {
        let that =this;
        return (<SafeAreaView style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff' }]}>
            <FlatList
                style={{ backgroundColor: '#fff', paddingTop: scaleSizeW(20) }}
                renderItem={this.renderItems}
                data={this.state.Data}
                keyExtractor={this._keyExtractor}
                contentContainerStyle={commonStyle.scrollViewContainer}
                onEndReached={this.reachEnd}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.refresh}
                    />
                }
            />
            <CustomizeHeader Title="机器服务" theme="blue" goBack={()=>this.props.navigation.goBack()}>
                <RightButton children={<TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Hengji', { callBack: () => { that.loadData({ page: 1 }, true) } })}><View><Image style={styles.homeadd} source={require('../../../images/icon-add.png')} /></View></TouchableOpacity>} />
            </CustomizeHeader>
        </SafeAreaView>)
    }
}
const styles = StyleSheet.create({
    homeadd: {
        width: scaleSize(36),
        height: scaleSize(36),
        marginRight: scaleSize(1)
    },
    ershouji: {
        padding: 0,
        borderBottomWidth: scaleSizeW(1),
        borderBottomColor: '#eeeeee',
    }, ershoujitop: {
        paddingHorizontal: scaleSizeW(30)
    },
    searchinput: {
        width: scaleSize(600),
        height: scaleSizeW(60),
        borderRadius: scaleSize(10),
        paddingLeft: scaleSize(15),
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        marginLeft: scaleSizeW(30)
    },
    searchimg: {
        width: scaleSize(27),
        height: scaleSize(29),
        marginRight: scaleSize(15)
    },
    pagetitle: { fontSize: scaleSize(34), fontWeight: 'bold', color: '#fff', flex: 1, textAlign: 'center' },
    searchkey: {
        color: '#bfbfbf',
        fontSize: scaleSize(30)
    },
    ershoujicontent: {
        paddingHorizontal: scaleSizeW(30)
    },
    priceshow: {
        fontWeight: 'bold',
        fontSize: scaleSizeW(30),
        color: '#eb5946'
    },
    pricehour: {
        color: '#a2a2a4',
        fontSize: scaleSizeW(30)
    },
    telinfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1
    }
})

export default ServiceList
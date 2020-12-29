import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Linking, RefreshControl, StatusBar, SafeAreaView } from 'react-native'
import { observer, inject } from 'mobx-react'
import { Icons, scaleSizeW, scaleSize } from "../../tools/util";
import commonStyle from '../../tools/commonstyles'
import CustomizeHeader from "../components/customizeheader";
import * as api from '../../mocks/api'
import * as tools from '../../tools/tool'
import RightButton from '../components/rightButton'
const removeIcon = require('../../../images/cha.png')
import BottomItems from '../components/bottomitems';

@inject('store')
@observer
class SecondMechinePage extends Component {
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
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            isFirstTime: true,
            Data: [],
            Filter: {
                type: 'OldMachine',
                location: '',
                name: '',
                page: 1,
                pageSize: 20
            }
        }
    }
    componentDidMount = (filter) => {
        let that = this;
        this.props.navigation.addListener(
            'didFocus',
            (obj) => {
                if (this.state.isFirstTime == false) {
                    const { userInfo } = that.props.store.config;
                    if (userInfo.location != that.state.Filter.location) {
                        that.loadData({}, true);
                    }

                    tools.SetSearchFilter(that.state.Filter, (_filter) => {
                        this.loadData(_filter, true);
                    }, true)
                }
            }
        )

        tools.SetSearchFilter(that.state.Filter, (_filter) => {
            this.loadData(_filter, true);
        }, false)
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
    changeRowItem = (row) => {
        var index = this.state.Data.findIndex(x => x.id == row.id);
        if (index != -1) {
            var data = this.state.Data.slice();
            data[index] = Object.assign({}, data[index], row);
            this.setState({
                Data: data
            })
        }
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
            <TouchableOpacity onPress={() => { this.props.navigation.push('SecondMechineDetail', { id: item.id, callBack: this.changeRowItem }) }}>
                <View style={[commonStyle.postshow, styles.ershouji]}>
                    <View style={[commonStyle.posttop, styles.ershoujitop]}>
                        {item.user.isShiMing && item.user.isCompany ? <View style={commonStyle.companyHeader}>
                            <Image source={{ uri: item.user.avatar }} style={commonStyle.avatar} />
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
                        <View style={commonStyle.posttype}>
                            <Text style={commonStyle.posttypetxt}>{item.customAttributes.PersonCompany === undefined ? '个人' : item.customAttributes.PersonCompany.value}</Text>
                        </View>
                        {item.customAttributes.IsJiMai === '是' ? <View style={commonStyle.posttype}><Text style={commonStyle.posttypetxt}>急卖</Text></View> : null}
                        <View style={commonStyle.postinfo}>
                            <Text style={commonStyle.posttime}>{item.strCreatedOn}</Text>
                        </View>
                        <View style={{ flex: 1 }}></View>
                        <Image style={commonStyle.postphone} source={require('../../../images/icon-phone.png')} />
                        <TouchableOpacity onPress={() => { this.callUser(item.customAttributes.ContactPhone.value) }}>
                            <Text style={commonStyle.phonetxt}>马上拨打</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ershoujicontent}>
                        <Text numberOfLines={2} style={commonStyle.postdesc}>
                            {item.title}
                        </Text>
                        {item.customAttributes.Address === undefined || item.customAttributes.Address === '' ? null : <View style={commonStyle.postinfo}>
                            <Image style={commonStyle.postpition} source={require('../../../images/icon-address.png')} />
                            <Text style={commonStyle.postaddress}>{item.customAttributes.ContactPerson}</Text>
                            {/* <Text style={commonStyle.posttime}>{item.createdOn}</Text> */}
                        </View>}
                        {item.pictures.length == 0 ? null : <View style={commonStyle.postImgs}>
                            {item.pictures.map((pic, subIndex) => {
                                return (
                                    <Image key={subIndex} style={commonStyle.postImg} source={{ uri: pic.thumbnal }} />
                                )
                            })}
                        </View>}
                        <View style={{ marginTop: scaleSize(10) }}>
                            <Text style={{ fontSize: scaleSize(20), color: "#666" }}>{item.viewCount}人浏览过</Text>
                        </View>

                        <View style={[commonStyle.postshow, { marginBottom: 0, paddingBottom: 0, paddingHorizontal: scaleSizeW(0) }]}>
                            <BottomItems {...this.props} changeRow={this.changeRowItem} item={item} styles={{ borderTopWidth: 0, marginVertical: 0, paddingTop: 0 }} />
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    _keyExtractor = (item) => { return item.id.toString(); }

    render() {
        let that = this;
        return (<SafeAreaView style={[commonStyle.safeView, { backgroundColor: '#fff', paddingTop: scaleSize(80) }]}>
            <FlatList
                style={{ backgroundColor: '#f4f4f4' }}
                renderItem={this.renderItems}
                data={this.state.Data}
                keyExtractor={this._keyExtractor}
                contentContainerStyle={commonStyle.scrollViewContainer}
                onEndReached={this.reachEnd}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.refresh}
                    />
                }
            />
            <CustomizeHeader showBack={false} style={{ paddingLeft: 0, width: '100%', backgroundColor: '#4576f7', justifyContent: 'flex-start' }}>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.push('PopHistory', {
                        type: this.state.Filter.type, callback: (name) => {
                            that.loadData({ name: name }, true);
                        }
                    })
                }} style={styles.searchinput}>
                    <Image style={styles.searchimg} source={require('../../../images/icon-search.png')} />
                    {this.state.Filter.name === '' ? <Text style={styles.searchkey}>请输入关键词</Text> :
                        <View style={styles.searchNameBox}>
                            <Text style={styles.searchkey} numberOfLines={1}>{this.state.Filter.name}</Text>
                            <TouchableOpacity onPress={() => {
                                global.SearchInfo = null;
                                this.loadData({ name: '' }, true)
                            }}>
                                <Image source={removeIcon} style={styles.deleteImage} />
                            </TouchableOpacity>
                        </View>}
                </TouchableOpacity>
                <RightButton children={<TouchableOpacity
                    onPress={() => that.props.navigation.navigate('Ershouji', { callBack: () => { that.loadData({ page: 1 }, true) } })}><View><Image style={styles.homeadd} source={require('../../../images/icon-add.png')} /></View></TouchableOpacity>} />
            </CustomizeHeader>
        </SafeAreaView >
        )
    }
}
const styles = StyleSheet.create({
    gerybg: {
        backgroundColor: '#f7f7f9'
    },
    ershouji: {
        paddingLeft: 0,
        paddingRight: 0, marginBottom: scaleSize(10)
    },
    ershoujitop: {
        paddingTop: scaleSizeW(15),
        paddingHorizontal: scaleSizeW(30),
        // borderBottomWidth: scaleSizeW(1),
        // borderBottomColor: '#eeeeee',
        // paddingBottom: scaleSizeW(15)
    },
    ershoujicontent: {
        paddingHorizontal: scaleSizeW(30)
    },
    searchinput: {
        width: scaleSize(600),
        height: scaleSize(68),
        borderRadius: scaleSize(10),
        paddingLeft: scaleSize(15),
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        marginLeft: scaleSize(30)
    },
    searchimg: {
        width: scaleSize(27),
        height: scaleSize(29),
        marginRight: scaleSize(15)
    },
    searchkey: {
        color: '#bfbfbf',
        fontSize: scaleSize(30)
    },
    homeadd: {
        width: scaleSize(36),
        height: scaleSize(36),
        marginRight: scaleSize(1)
    },
    deleteImage: {
        width: scaleSizeW(20),
        height: scaleSizeW(20),
        marginRight: scaleSizeW(30)
    },
    searchNameBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        flex: 1
    }
})

export default SecondMechinePage
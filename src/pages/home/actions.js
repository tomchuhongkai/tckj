import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Linking, RefreshControl, StatusBar, SafeAreaView, Animated, TextInput } from 'react-native'
import { observer, inject } from 'mobx-react'
import { scaleSizeW, scaleSize, RequirementFields } from "../../tools/util";
import commonStyle from '../../tools/commonstyles'
import CustomizeHeader from "../components/customizeheader";
import * as api from '../../mocks/api'
import * as tools from '../../tools/tool'
import NoRecords from '../components/norecords'
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

@inject('store')
@observer
class Actions extends Component {
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
                name: '',
                page: 1,
                pageSize: 20
            },
            textBoxWidth: new Animated.Value(0),
            showSearch: false,
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
        if (filter === undefined || filter === null) {
            filter = {};
        }
        filter = Object.assign({}, this.state.Filter, filter);
        api.ListAuctions(filter)
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

        let auctioninfo;
        let closeimg;
        if (item.status === 5) {
            auctioninfo = (<View>
                <View style={styles.comingprice}>
                    <Text style={styles.txt1}>起始</Text>
                    <Text style={styles.txt2}>￥</Text>
                    <Text style={styles.txt3}>{item.startPrice}</Text>
                </View>
                <Text style={styles.endtime}>{item.startTime}开始</Text></View>)
        }
        if (item.status === 1) {
            auctioninfo = (<View>
                <View style={styles.comingprice}>
                    <Text style={styles.redtxt1}>当前</Text>
                    <Text style={styles.redtxt2}>￥</Text>
                    <Text style={styles.redtxt3}>{item.startPrice}</Text>
                </View>
                <Text style={styles.endtime}>预计{item.endTime}结束</Text></View>)
        }
        if (item.status === 10) {
            auctioninfo = (<View>
                <View style={styles.comingprice}>
                    <Text style={styles.greytxt1}>当前</Text>
                    <Text style={styles.greytxt2}>￥</Text>
                    <Text style={styles.greytxt3}>{item.startPrice}</Text>
                </View>
                <Text style={styles.endtime}>已结束</Text></View>)
            closeimg = (<Image style={styles.closedimg} source={require('../../../images/closed.png')} />)
        }
        return (
            <TouchableOpacity onPress={() => { this.props.navigation.push('ActionDetail', { id: item.id }) }}>
                <View style={styles.actionslist}>
                    <View style={styles.actionsimgview}>
                    <Image style={styles.actionsimg} source={{ uri: item.photos[0].thumbnal }} />
                    {closeimg}
                    </View>
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
    _keyExtractor = (item) => { return item.id.toString(); }

    render() {
        let that = this;
        let _width = scaleSizeW(550);
        let titleOpacity = this.state.textBoxWidth.interpolate({
            inputRange: [0, _width],
            outputRange: [1, 0]
        })
        let boxOpacity = this.state.textBoxWidth.interpolate({
            inputRange: [0, _width],
            outputRange: [0, 1]
        })
        return (<SafeAreaView style={[commonStyle.safeViewWithCusHead, { backgroundColor: '#fff', paddingTop: scaleSize(80) }]}>
           {Platform.OS=='ios'?<View style={commonStyle.fixheight}></View>:null}
            <FlatList
                style={{ backgroundColor: '#fff', height: '100%' }}
                renderItem={this.renderItems}
                data={this.state.Data}
                keyExtractor={this._keyExtractor}
                contentContainerStyle={commonStyle.scrollViewContainer}
                onEndReached={this.reachEnd}
                ListEmptyComponent={<NoRecords />}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.refresh}
                    />
                }
            />
            <CustomizeHeader showBack={false} style={{ width: '100%', backgroundColor: '#4576f7', paddingLeft: 0 }}>
                <View style={{ marginLeft: scaleSizeW(0), width: scaleSizeW(90), position: 'absolute', left: 0 }}>
                    <TouchableOpacity style={{ paddingLeft: scaleSizeW(40) }} onPress={() => that.props.navigation.goBack()}>
                        <Image style={{ width: scaleSizeW(18), height: scaleSizeW(30) }} source={require('../../../images/back_icon_white.png')} />
                    </TouchableOpacity>
                </View>
                {/* <TouchableOpacity onPress={() => {
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
                </TouchableOpacity> */}

                <AnimatedTextInput onSubmitEditing={(v) => this.loadData({ name: v.nativeEvent.text }, true)} placeholderTextColor="#fff" paddingVertical={0} type="input" style={[commonStyle.textinput, styles.textInput, { width: this.state.textBoxWidth, opacity: boxOpacity }]} placeholder="请输入关键字" />
                <Animated.View style={{ position: 'absolute', left: scaleSizeW(90), right: scaleSizeW(90), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', display: 'flex', opacity: titleOpacity }}>
                    <Text style={[commonStyle.commonText, { color: '#fff' }]}>拍卖</Text>
                </Animated.View>
                {this.state.showSearch ? null : <Animated.View style={{ position: 'absolute', zIndex: 2, right: 0, marginRight: scaleSizeW(30), width: scaleSizeW(80), alignItems: 'flex-end', opacity: titleOpacity }}>
                    <TouchableOpacity onPress={() => {
                        Animated.timing(this.state.textBoxWidth, {
                            toValue: _width,
                            useNativeDriver: false
                        }).start(() => {
                            that.setState({
                                showSearch: true
                            })
                        })
                    }}>
                        <Image source={require('../../../images/search_white.png')} style={{ width: scaleSizeW(36), height: scaleSizeW(36) }} />
                    </TouchableOpacity>
                </Animated.View>}
                {this.state.showSearch ? <Animated.View style={{ position: 'absolute', zIndex: 1, right: 0, marginRight: scaleSizeW(30), width: scaleSizeW(80), alignItems: 'flex-end', opacity: boxOpacity }}>
                    <TouchableOpacity onPress={() => {
                        Animated.timing(this.state.textBoxWidth, {
                            toValue: 0,
                            useNativeDriver: false
                        }).start(() => {
                            that.setState({
                                showSearch: false,
                            })
                        })
                    }}>
                        <Text style={[commonStyle.commonText, { color: '#fff' }]}>取消</Text>
                    </TouchableOpacity>
                </Animated.View> : null}
            </CustomizeHeader>
        </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    textInput: {
        borderColor: '#fff',
        borderWidth: scaleSizeW(1),
        borderRadius: scaleSizeW(10),
        paddingLeft: scaleSizeW(30),
        paddingRight: scaleSizeW(15),
        fontSize: scaleSizeW(28),
        paddingTop: scaleSizeW(5),
        paddingBottom: scaleSizeW(5),
        position: 'absolute',
        right: scaleSizeW(120),
        zIndex: 3,
        color: '#fff'
    },
    gerybg: {
        backgroundColor: '#f7f7f9'
    },
    ershouji: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0
    }, ershoujitop: {
        borderBottomWidth: scaleSizeW(1),
        borderBottomColor: '#eeeeee',
        paddingHorizontal: scaleSizeW(30),
        paddingBottom: scaleSizeW(15)
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
        marginLeft: scaleSize(0)
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
    },
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
    actionsimgview: {
        width: scaleSizeW(300),
        height: scaleSize(200),
        position: 'relative'
    },
    closedimg: {
        position: 'absolute',
        width: scaleSize(121),
        height: scaleSize(67),
        zIndex: 88,
        top: scaleSize(120),
        right: scaleSize(20)
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
        color: '#e65e46',
        marginRight: scaleSize(10)
    },
    redtxt2: {
        fontWeight: 'bold',
        fontSize: scaleSizeW(22),
        color: '#e65e46'
    },
    redtxt3: {
        fontWeight: 'bold',
        fontSize: scaleSizeW(34),
        color: '#e65e46'
    },
    greytxt1: {
        fontWeight: 'bold',
        fontSize: scaleSizeW(22),
        color: '#777',
        marginRight: scaleSize(10)
    },
    greytxt2: {
        fontWeight: 'bold',
        fontSize: scaleSizeW(22),
        color: '#777'
    },
    greytxt3: {
        fontWeight: 'bold',
        fontSize: scaleSizeW(34),
        color: '#777'
    }

})

export default Actions
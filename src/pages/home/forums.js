import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, DeviceEventEmitter, RefreshControl, FlatList, SafeAreaView, StatusBar } from 'react-native'
import { scaleSize, scaleSizeH, scaleSizeW } from "../../tools/util";
import NoRecords from '../components/norecords'
import commonStyle from '../../tools/commonstyles'
import * as locals from '../../tools/localdata'
import * as api from '../../mocks/api'
import Loading from '../components/loading';
class Forums extends Component {
    constructor(props) {
        super(props);
        let routeName = props.navigation.state.key;
        var plate = props.screenProps.plates.filter(x => x.name === routeName)[0];
        this.state = {
            refreshing: false,
            loaded: false,
            plateName: plate.title,
            Data: [],
            filter: {
                title: '',
                plateId: plate.id,
                page: 1,
                pageSize: 10,
                pageCount: 0,
                totalItemCount: 0
            }
        }
    }
    static navigationOptions = {
        header: null
    }
    componentDidMount = () => {
        let that = this;
        this.listener = DeviceEventEmitter.addListener(`forum_${this.state.filter.plateId}`, () => {
            that.loadData();
        })
        this.loadData();
    }
    componentWillUnmount = () => {
        this.listener = null;
    }
    loadData = (filter, reload) => {
        let that = this;
        if (filter === undefined) {
            filter = {}
        }
        if (reload === undefined) {
            reload = true;
        }
        filter = Object.assign({}, this.state.filter, filter)
        api.ForumTopics(filter)
            .then(res => {
                let data = [];
                //设置数据
                if (reload) {
                    data = res.data.data;
                } else {
                    data = data.contact(res.data.data);
                }
                that.setState({
                    loaded: true,
                    Data: data,
                    filter: {
                        page: res.data.pageNumber,
                        pageSize: filter.pageSize,
                        totalItemCount: res.data.totalItemCount,
                        plateId: filter.plateId,
                        title: filter.title
                    }
                })
            })
    }
    setRow = (Model, item, index) => {
        var _item = Object.assign({}, item, Model)
        var _data = this.state.Data.slice();
        _data[index] = _item;
        this.setState({
            Data: _data
        })
    }
    refresh = () => {
        this.loadData({
            page: 1
        }, true);
    }
    reachEnd = () => {
        const { pageCount, page } = this.state.filter;
        if (page < pageCount) {
            this.loadData({ page: page + 1 }, false);
        }
    }
    renderFlatListItem = ({ item, index }) => {
        let that = this;
        return (
            <TouchableOpacity onPress={() => {
                this.props.screenProps.parentNavigation.push('ForumDetail', {
                    id: item.id, title: this.state.plateName,
                    callBack: (model) => {
                        that.setRow(model, item, index)
                    }
                })
            }} style={[commonStyle.postshow, styles.separate]}>
                <Text numberOfLines={2} style={commonStyle.postdesc}>
                    {item.title}
                </Text>
                <View style={commonStyle.postinfo}>
                    <View>
                        <Text style={styles.bluetxt}>{item.author}</Text>
                    </View>
                    <Text style={commonStyle.postaddress}>回复数：{item.replyCount}</Text>
                    <Text style={commonStyle.posttime}>{item.createdOn}</Text>
                </View>
                {item.photos.length > 0 ? <View style={commonStyle.postImgs}>
                    {item.photos.map((item, index) => {
                        return <Image key={index} style={commonStyle.postImg} source={{ uri: item.thumbnal }} />
                    })}
                </View> : null}
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <SafeAreaView style={commonStyle.safeView}>
                {/* <View style={styles.homeprosearch}>
                    <View style={styles.searchinput}>
                        <Image style={styles.searchimg} source={require('../../../images/icon-search.png')} />
                        <Text style={styles.searchkey}>请输入关键词</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.props.screenProps.parentNavigation.push('Post', { plateId: this.state.filter.plateId })}>
                        <Image style={styles.iconmsg} source={require('../../../images/icon-message.png')} /></TouchableOpacity>
                </View> */}
                <Loading show={!this.state.loaded} />
                {this.state.loaded ? <FlatList
                    data={this.state.Data}
                    extraData={this.state}
                    style={{ height: '100%' }}
                    contentContainerStyle={{ minHeight: '100%' }}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={this.renderFlatListItem}
                    onEndReached={this.reachEnd}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.refresh}
                        />
                    }
                    ListEmptyComponent={
                        <NoRecords />
                    }
                /> : null}
            </SafeAreaView>)
    }
}
const styles = StyleSheet.create({
    homeprosearch: {
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        width: scaleSize(690),
        padding: scaleSize(30),
        paddingBottom: scaleSizeW(0),
        zIndex: 99
    },
    iconmsg: {
        width: scaleSize(36),
        height: scaleSize(36),
        marginLeft: scaleSize(14)
    },
    backimg: {
        width: scaleSize(20),
        height: scaleSize(35),
        marginRight: scaleSize(30)
    },
    searchinput: {
        width: scaleSize(620),
        height: scaleSize(68),
        borderRadius: scaleSize(10),
        paddingLeft: scaleSize(15),
        backgroundColor: '#f2f2f2',
        justifyContent: 'flex-start',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
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

    greybg: {
        backgroundColor: '#f4f4f4'
    },
    mart10: {
        marginTop: scaleSize(15)
    },
    bluetxt: {
        color: '#4576f7',
        fontSize: scaleSize(24),
        marginRight: scaleSize(20)
    },
    separate: {
        borderBottomColor: '#dcdcdc',
        borderBottomWidth: scaleSize(1),
        paddingLeft: scaleSizeW(30),
        paddingRight: scaleSizeW(30),
        paddingTop: scaleSize(30),
        marginTop: 0,
        marginBottom: 0
    }
})

export default Forums
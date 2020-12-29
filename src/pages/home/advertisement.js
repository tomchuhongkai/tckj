import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { View, SafeAreaView, Image, Text, FlatList, Dimensions, StyleSheet, RefreshControl, TouchableOpacity, StatusBar } from 'react-native'
import * as commonStyles from '../../tools/commonstyles'
import * as api from '../../mocks/api'
import { scaleSizeW } from '../../tools/util';
import CustomizeHeader from '../components/customizeheader';
import * as tools from '../../tools/tool'
import Share from 'react-native-share';
import Loading from '../components/loading'
const { width, height } = Dimensions.get('window')
const addIcon = require('../../../images/addad.png')

@inject('store')
@observer
class Advertisement extends Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        _this = this;
        this.state = {
            refreshing: false,
            visible: false,
            textInput: '',
            loaded: false,
            Data: [],
            Filter: {
                type: 'Advertisement',
                location: '',
                name: '',
                page: 1,
                pageSize: 20
            }
        }
    }
    componentDidMount = () => {
        this.loadData(null, true);
    }
    loadData = (filter, refresh) => {
        let that = this;
        if (filter === undefined || filter === null) {
            filter = {};
        }
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
                    loaded: true,
                    Data: data,
                    Filter: filter,
                    isFirstTime: false
                })
            })
    }
    good = (item) => {
        let data = {
            newsId: item.id,
            desc: '',
            type: 1
        }
        let that = this;
        if (this.loadinggood === undefined || this.loadinggood === false) {
            this.loadinggood = true;
        } else {
            return;
        }

        if (!item.isZan) {
            api.RelationPost(data).then((res) => {
                if (res.data.result == 1) {
                    that.loadinggood = false;
                    if (res.data.result == 1) {
                        var index = this.state.Data.findIndex(x => x.id == item.id);
                        if (index != -1) {
                            var posts = this.state.Data.slice();
                            var zancount = item.zanCount + 1;
                            posts[index] = Object.assign({}, posts[index], { isZan: true, zanCount: zancount });
                            this.setState({
                                Data: posts
                            })
                        }
                    } else {
                        tools.Toast.fail(res.data.message);
                    }
                } else {
                    tools.Toast.fail(res.data.message);
                    return;
                }
            }, err => {
                that.loadinggood = false;
            })
        } else {
            tools.Toast.success('您已经赞过了');
            that.loadinggood = false;
        }

    }
    share = (id) => {
        const { userInfo } = this.props.store.config;
        const shareOptions = {
            title: '分享',
            url: `${tools.GetRootUrl}/news/share/${id}?uid=${userInfo.userId}`
        };

        Share.open(shareOptions)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                err && console.log(err);
            });
    }
    refresh = () => {
        this.loadData({
            page: 1
        }, true);
    }
    reachEnd = () => {
        const { pageCount, pageIndex } = this.state.Filter;
        if (pageIndex < pageCount) {
            this.loadData({ page: pageIndex + 1 }, false);
        }
    }
    _keyExtractor = (item) => {
        return item.id.toString();
    }
    renderItems = ({ item }) => {
        let that=this;
        return (
            <View style={styles.item_container} >
                {item.pictures.length > 0 ?
                    <Image
                        style={styles.item_image}
                        source={{ uri: item.pictures[0].thumbnal }}
                        resizeMode='cover'
                    /> : <View></View>}
                <View style={styles.bottombar}>
                    <Text style={{ fontSize: scaleSizeW(26), marginBottom: scaleSizeW(10), color: '#fff' }}>@{item.user.nickName}</Text>
                    <Text style={{ fontSize: scaleSizeW(24), color: '#fff' }} numberOfLines={2}>{item.customAttributes.description.value}</Text>
                    <View style={styles.bottomview}>

                    </View>
                </View>
                <View style={styles.rightactions}>
                    <View style={styles.actions}>
                        <Image
                            style={styles.useravatar}
                            source={{ uri: item.user.avatar }}
                        />
                        <TouchableOpacity style={styles.flexrow} onPress={() => {
                            that.props.navigation.push('PostAd',{callBack:()=>{
                                that.loadData({page:1},true);
                            }})
                        }}>
                            <Image style={styles.postad} source={addIcon} />
                            <Text style={styles.txt}>发布</Text></TouchableOpacity>

                        <TouchableOpacity style={styles.flexrow} onPress={() => { this.good(item) }}>
                            <Image source={item.isZan ? require('../../../images/zaned.png') : require('../../../images/dianzan.png')} style={styles.icon} />
                            <Text style={item.isZan ? styles.txtZaned : styles.txt}>点赞({item.zanCount})</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.flexrow} onPress={() => { this.share(item.id) }}>
                            <Image source={require('../../../images/fenxiang.png')} style={styles.icon} />
                            <Text style={styles.txt}>分享</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.flexrow} onPress={() => { this.props.navigation.push('Jubao', { id: item.id }) }}>
                            <Image source={require('../../../images/jubao.png')} style={styles.icon} />
                            <Text style={styles.txt}>举报</Text>
                        </TouchableOpacity>
                    </View></View>
            </View>

        )
    }
    render() {
        return (<SafeAreaView style={commonStyles.safeView}>
            {this.state.loaded ? 
            <FlatList
                data={this.state.Data}
                style={{ height: '100%' }}
                contentContainerStyle={{ minHeight: '100%' }}
                pagingEnabled={true}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={this.renderItems}
                onEndReached={this.reachEnd}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.refresh}
                    />
                }>
            </FlatList> : null}
            <Loading show={!this.state.loaded} />
            <CustomizeHeader Title=" " theme="blue" goBack={() => { this.props.navigation.goBack() }} style={{ backgroundColor: 'transparent', top: StatusBar.currentHeight }} />
        </SafeAreaView>)
    }
}
export default Advertisement

const styles = StyleSheet.create({
    item_image: {
        width: width,
        height: height + StatusBar.currentHeight,
        position: 'absolute',
        left: 0,
        top: 0,
        opacity:0.8
    },
    item_container: {
        height: height + StatusBar.currentHeight,
        paddingLeft: scaleSizeW(40),
        paddingRight: scaleSizeW(30),
        position: 'relative',
        backgroundColor: '#000',
        paddingTop: scaleSizeW(60)
    },
    item_top: {
        paddingTop: scaleSizeW(8),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    bottombar: {
        position: 'absolute',
        width: scaleSizeW(750),
        height: scaleSizeW(180),
        top: height +StatusBar.currentHeight- scaleSizeW(180),
        padding: scaleSizeW(20),
        left: 0,

    },
    rightactions: {
        position: 'absolute',
        width: scaleSizeW(120),
        height: scaleSizeW(430),
        top: height - scaleSizeW(610),
        padding: scaleSizeW(20),
        left: width - scaleSizeW(120),
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    flexrow: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scaleSizeW(20)
    },
    bottomview: {
        display: 'flex',
        height: scaleSizeW(80),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'

    },
    postad: {
        width: scaleSizeW(40),
        height: scaleSizeW(40)
    },
    useravatar: {
        width: scaleSizeW(52),
        height: scaleSizeW(52),
        borderRadius: scaleSizeW(26),
        marginBottom: scaleSizeW(20)
    },
    icon: { width: scaleSizeW(30), height: scaleSizeW(30) },
    txt: { fontSize: scaleSizeW(20), color: '#fff', marginTop: scaleSizeW(5) },
    txtZaned: { fontSize: scaleSizeW(20), color: '#d81e06', marginTop: scaleSizeW(5) }
})
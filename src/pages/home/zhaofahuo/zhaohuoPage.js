import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, DeviceEventEmitter, Image, FlatList, RefreshControl } from 'react-native'
import { SafeAreaView, NavigationActions, StackActions } from 'react-navigation'
import { inject, observer } from 'mobx-react'
import commonStyle from '../../../tools/commonstyles'
import { config, scaleSize, setSpText, scaleSizeW, clearBoxPng, defaultAvatar } from '../../../tools/util'
import CustomizeHeader from '../../components/customizeheader'
import * as api from '../../../mocks/api'
import Waiting from '../../commons/waiting'
const keyName = "FindProducts";

// const resetAction = StackActions.reset({
//     index: 0,
//     actions: [
//         NavigationActions.navigate({ routeName: 'AuthLogin' }),  //Login 要跳转的路由
//     ]
// })

@inject('store')
@observer
class zhaohuoPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            loaded: false,
            NewsList: [],
            NewsFilter: {
                pageNumber: 1,
                pageSize: 20,
                pageCount: 0,
                totalItemCount: 0
            }

        }
    }

    componentDidMount = () => {
        let that = this;
        this.reloadListener = DeviceEventEmitter.addListener("ZhaoHuoEvent", () => {
            that.loadData({ page: 1 }, true);
        })
        this.refresh()
    }
    loadData = (_filter, reload) => {
        // let { NewsList, NewsFilter, setList } = this.props.store.news;
        let { NewsFilter } = this.state;
        let that = this;
        if (_filter === undefined || _filter === null) {
            _filter = { page: NewsFilter.pageIndex, pageSize: NewsFilter.pageSize };
        }
        _filter.type = keyName;
        api.GetNewsList(_filter)
            .then(res => {
                if (reload) {
                    that.setState({
                        NewsList: res.data.data,
                        NewsFilter: {
                            pageIndex: res.data.pageNumber,
                            pageSize: res.data.pageSize,
                            pageCount: res.data.pageCount,
                            totalItemCount: res.data.totalItemCount,
                        },
                        loaded: true
                    })
                } else {
                    that.setState({
                        NewsList: that.state.NewsList.concat(res.data.data),
                        NewsFilter: {
                            pageIndex: res.data.pageNumber,
                            pageSize: res.data.pageSize,
                            pageCount: res.data.pageCount,
                            totalItemCount: res.data.totalItemCount,
                        },
                        loaded: true,
                        isFirstTime: false
                    })
                }
            }, err => {
                console.log(err);
            })
    }
    refresh = () => {
        this.loadData({
            page: 1
        }, true);
    }

    reachEnd = () => {
        const { pageCount, pageIndex } = this.state.NewsFilter;
        if (pageIndex < pageCount) {
            this.loadData({ page: pageIndex + 1 }, false);
        }
    }
    _keyExtractor = (item, index) => {
        return item.id.toString();
    }

    renderItems = ({ item }) => {
        let that = this;
        return (
            <TouchableOpacity style={styles.item} onPress={() => that.props.screenProps.parentNavigation.push('ZhaofahuoDetail', { id: item.id })}>
                <View style={commonStyle.formRowItem_row_left}>
                    {item.pictures != null && item.pictures.length > 0 ? <Image style={styles.leftimg} source={{ uri: item.pictures[0].thumbnal }} /> : <Image style={styles.leftimg} source={require('../../../../images/no-image.png')} />}
                    <View style={styles.righttext}>
                        <View style={commonStyle.tag_wrap_list}>
                            {item.customAttributes.City.value != '' ? <View style={commonStyle.tag_wrap_red}><Text style={commonStyle.tag_red_txt}>{item.customAttributes.City.value}</Text></View> : null}
                            {item.customAttributes.CompanyName.value != '' ? <View style={commonStyle.tag_wrap_red}><Text style={commonStyle.tag_red_txt}>{item.customAttributes.CompanyName.value}</Text></View> : null}
                        </View>
                        <Text numberOfLines={2} style={{ fontSize: scaleSize(30), color: '#333' }}>{item.title}</Text>
                        <View style={commonStyle.formRowItem_row_left}>
                            <Image style={styles.iconaddress} source={require('../../../../images/icon-address.png')} />
                            <Text numberOfLines={1} style={styles.txtaddress}>{item.title}</Text>
                            <Text style={styles.txttime}>{item.strCreatedOn}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

        )
    }


    render() {
        const { NewsList } = this.state;
        if(!this.state.loaded){
            return (<Waiting/>)
        }
        return (<SafeAreaView style={[commonStyle.safeView, styles.popbg]}>
            <View>
                <View style={[styles.formRowItem2, styles.margintop]}>
                    {/* <View style={styles.sectiontitle}><Text style={styles.title}>找发货</Text></View> */}

                    <FlatList data={NewsList.slice()}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={5}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this.renderItems}
                        contentContainerStyle={{ paddingTop: scaleSize(40) }}
                        showsVerticalScrollIndicator={false}
                        onEndReached={this.reachEnd}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.refresh}
                            />
                        }
                    // ListEmptyComponent={
                    //     <Empty Loaded={this.state.loaded} Message="暂无发货~" />
                    // }
                    />


                    {/* <View style={styles.item}>
                        <View style={commonStyle.formRowItem_row_left}>
                            <Image style={styles.leftimg} source={require('../../../../images/no-image.png')} />
                            <View style={styles.righttext}>
                                <View style={commonStyle.tag_wrap_list}>
                                    <View style={commonStyle.tag_wrap_red}><Text style={commonStyle.tag_red_txt}>桐乡</Text></View>
                                    <View style={commonStyle.tag_wrap_red}><Text style={commonStyle.tag_red_txt}>找发货</Text></View>
                                </View>
                                <Text numberOfLines={2}  style={{fontSize:scaleSize(30),color:'#333'}}>找合适的带货商，价格合适，诚意者联系我</Text>
                                <View style={commonStyle.formRowItem_row_left}>
                                    <Image style={styles.iconaddress} source={require('../../../../images/icon-address.png')} />
                                    <Text numberOfLines={1} style={styles.txtaddress}>嘉兴市桐乡市联合新村嘉兴市桐乡市联合新村嘉兴市桐乡市联合新村</Text>
                                    <Text style={styles.txttime}>15:04</Text>
                                </View>
                            </View>
                        </View>
                    </View> */}
                </View>


            </View>
            {/* <CustomizeHeader Title="设置" goBack={() => this.props.navigation.goBack()} /> */}
        </SafeAreaView>)
    }
}

export default zhaohuoPage


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
    item: { borderBottomColor: '#eeeeee', borderBottomWidth: scaleSize(1), marginBottom: scaleSize(20),paddingBottom:scaleSize(20) },
    iconaddress: { width: scaleSize(22), height: scaleSize(26) },
    txtaddress: { marginLeft: scaleSize(10), marginRight: scaleSize(40), fontSize: scaleSize(24), color: '#a2a2a4', width: scaleSize(280) },
    txttime: { fontSize: scaleSize(24), color: '#b7b7b7' }
})

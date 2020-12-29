import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, DeviceEventEmitter, Image, FlatList, RefreshControl } from 'react-native'
import { SafeAreaView, NavigationActions, StackActions } from 'react-navigation'
import { inject, observer } from 'mobx-react'
import commonStyle from '../../../tools/commonstyles'
import { config, scaleSize, setSpText, scaleSizeW, clearBoxPng, defaultAvatar } from '../../../tools/util'
import CustomizeHeader from '../../components/customizeheader'
import * as api from '../../../mocks/api'
import Waiting from '../../commons/waiting'
const keyName = "YXCXProducts";



@inject('store')
@observer
class YXCXPage extends Component {
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
        this.reloadListener = DeviceEventEmitter.addListener("YXCXEvent", () => {
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
                 
                    />


                </View>


            </View>
        </SafeAreaView>)
    }
}

export default YXCXPage


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

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, RefreshControl, Dimensions, TextInput,StatusBar } from 'react-native'
import { SafeAreaView, NavigationActions, StackActions } from 'react-navigation'
import { inject, observer } from 'mobx-react'
import commonStyle from '../../tools/commonstyles'
import { config, scaleSize, setSpText, scaleSizeW, clearBoxPng, defaultAvatar } from '../../tools/util'
import CustomizeHeader from '../components/customizeheader'
import * as api from '../../mocks/api'
import Waiting from '../commons/waiting'
import { FlatList, TouchableNativeFeedback } from 'react-native-gesture-handler'
import Empty from '../commons/empty'
import { Toast } from '../../tools/tool'
import ScaleImage from '../commons/scaleimage'

const descimgwidth = Dimensions.get('window').width - 40;
const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'AuthLogin' }),  //Login 要跳转的路由
    ]
})

@inject('store')
@observer
class ForumDetailPage extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: null,
            headerLeft: null,
            headerRight: null,
            headerStyle: {
                height: StatusBar.currentHeight,
                shadowOpacity: 0,
                backgroundColor: '#4576f7',
            }
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            Content: '',
            TopicId: props.navigation.state.params.id,
            TopicTitle: props.navigation.state.params.title,
            ReplyId: 0,//针对哪个会员
            ReplyTo: '',
            ParentId: 0,
            Model: null,
            Data: [],
            filter: {
                page: 1,
                pageSize: 20,
                totalItemCount: 0,
                pageCount: 0
            }
        }
    }
    componentDidMount() {
        this.loadDetail();
    }
    loadDetail = () => {
        let id = this.state.TopicId;
        let that = this;
        api.TopicDetail(id)
            .then(res => {
                that.setState({
                    Model: {
                        id: res.data.id,
                        title: res.data.title,
                        userId: res.data.userId,
                        strStatus: res.data.strStatus,
                        status: res.data.status,
                        nickName: res.data.nickName,
                        avatar: res.data.avatar,
                        createdOn: res.data.createdOn,
                        Photos: res.data.photos,
                        Description: res.data.description,
                        replyCount: res.data.replyCount,
                        viewCount: res.data.viewCount
                    },
                    Data: res.data.data,
                    Filter: {
                        page: res.data.pageNumber,
                        pageSize: 20,
                        totalItemCount: res.data.totalItemCount,
                        pageCount: res.data.pageCount
                    },
                    Content: ''
                })
            })
    }
    loadData = (filter, reload) => {
        let that = this;
        if (filter === undefined) {
            filter = {};
        }
        filter = Object.assign({}, this.state.Filter, filter);
        api.LoadReplies(filter)
            .then(res => {
                let data = that.state.Data.slice();
                if (reload === undefined || reload == false) {
                    data = data.concat(res.data.data);
                } else {
                    data = [];
                }
                that.setState({
                    Data: data,
                    Filter: {
                        page: res.data.pageNumber,
                        pageSize: 20,
                        totalItemCount: res.data.totalItemCount,
                        pageCount: res.data.pageCount
                    }
                })
            })
    }
    refresh = () => {
        this.loadDetail();
    }
    reachEnd = () => {
        const { pageCount, page } = this.state.Filter;
        if (page < pageCount) {
            this.loadData({ page: page + 1 }, false);
        }
    }
    submitReply = () => {
        let that = this;
        if (this.state.Content === '') {
            Toast.info('请输入您的回复');
            return false;
        }
        api.SaveTopicReply({
            Title: this.state.Content,
            ForumTopicId: this.state.TopicId,
            ParentId: this.state.ParentId,
            ReplyId: this.state.ReplyId
        })
            .then(res => {
                if (res.data.result === 1) {
                    Toast.info('回复成功', 1, () => {
                        that.replyCallBack();
                    });
                }
            })
        return false;
    }
    replyCallBack = () => {
        let that = this;
        if (that.state.ParentId != 0) {
            that.loadSubItems(that.state.Model.id, that.state.ParentId);
        } else {
            that.loadDetail();
        }
    }
    loadSubItems = (topicId, parentId) => {
        let that = this;
        var items = this.state.Data.slice();
        var item = items.filter(x => x.id === parentId)[0];
        var model = Object.assign({},this.state.Model);
        api.LoadReplies({
            topicId: topicId,
            parentId: parentId,
            page: 1,
            pageSize: 999
        })
            .then(res => {
                item.subs = res.data.data.map((item, index) => {
                    return { id: item.id, title: item.title, userId: item.userId, nickName: item.nickName, avatar: item.avatar, createdOn: item.createdOn };
                })
                model.viewCount = res.data.viewCount;
                model.replyCount = res.data.replyCount;
                that.setState({
                    Data: items,
                    ParentId: 0,
                    ReplyId: 0,
                    ReplyTo: '',
                    Content: '',
                    Model:model
                })
            })
    }
    showSubItems = (index) => {
        var items = this.state.Data.slice();
        items[index].showSub = true;
        this.setState({
            Data: items
        })
    }
    render() {
        if (this.state.Model == null) {
            return <Waiting />
        }
        const { Model, Data } = this.state;
        const { userInfo } = this.props.store.config;
        return (<SafeAreaView style={[commonStyle.safeViewWithCusHead,{paddingBottom:scaleSizeW(90)}]}>
            <CustomizeHeader Title={this.state.TopicTitle} goBack={() => {
                if (this.props.navigation.state.params.callBack !== undefined) {
                    this.props.navigation.state.params.callBack({ replyCount: Model.replyCount, viewCount: Model.viewCount })
                }
                this.props.navigation.goBack()
            }} />
            <FlatList
                data={this.state.Data}
                extraData={this.state}
                keyExtractor={(item) => item.id.toString()}
                renderItem={this.renderItems}
                onEndReached={this.reachEnd}
                contentContainerStyle={{ paddingHorizontal: scaleSizeW(30) }}
                ListHeaderComponent={
                    <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        this.setState({
                            ParentId: 0,
                            ReplyId: 0,
                            ReplyTo: ''
                        })
                    }}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: scaleSizeW(20) }}><Image source={{ uri: Model.avatar }} style={styles.avatar} /><Text style={styles.name}>{Model.nickName}</Text></View>
                        <View><Text style={styles.title}>{Model.title}</Text></View>
                        <View><Text style={styles.datetime}>{Model.createdOn}</Text></View>
                        {Model.Photos.length > 0 ? <View>
                            {Model.Photos.map((item, index) => {
                                return (<ScaleImage style={{marginBottom:scaleSizeW(10)}} key={index}  width={scaleSizeW(690)} uri={item} />)
                            })}
                        </View> : null}
                        <View style={styles.desc_contaienr}>
                            <Text style={styles.desc_text}>{Model.Description}</Text>
                        </View>
                        {Data.length === 0 ? <Empty Message="还没有沙发哦，快来坐沙发吧o(*￣▽￣*)ブ" Loaded={true} /> : <View style={styles.section}>
                            <Text style={styles.sectiontitle}>全部回复</Text>
                        </View>}
                    </TouchableOpacity>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.refresh}
                    />
                }
            />
            {userInfo.nickName !== '' ? <TextInput placeholder={this.state.ReplyTo === '' ? '请发表你的评论~' : `回复${this.state.ReplyTo}：`} returnKeyType='done' onSubmitEditing={this.submitReply} onChangeText={(v) => { this.setState({ Content: v }) }} value={this.state.Content} style={commonStyle.fields_textroundboxbottom} /> :
                <TouchableOpacity style={styles.reply_content} onPress={() => {
                    this.props.navigation.push('SignIn')
                }}><Text style={styles.reply_text}>登录并回复</Text></TouchableOpacity>}
        </SafeAreaView>)
    }
    renderItems = ({ item, index }) => {
        return (
            <View style={styles.item}>
                <Image style={styles.avatar} source={{ uri: item.avatar }} />
                <View style={styles.righttext}>
                    <Text style={styles.name}>{item.nickName}</Text>
                    <Text style={styles.txt}>{item.title}</Text>
                   <View style={{flexDirection:'row',marginBottom:scaleSize(10)}}>
                   <Text style={styles.txttime}>{item.createdOn} ·</Text>
                        <TouchableOpacity style={{}} onPress={() => {
                        this.setState({
                            ParentId: item.id,
                            ReplyId: item.userId,
                            ReplyTo: item.nickName
                        })
                    }}>
                         <Text style={styles.txttime}> 回复</Text>
                    </TouchableOpacity>
                    </View>
                    {item.subs.length > 0 ?this.renderSubs(item, index) : null}
                </View>
            </View>
        )
    }
    renderSubs = (item, index) => {
        if (item.showSub === undefined || item.showSub === false) {
            return (<TouchableOpacity onPress={() => {
                this.showSubItems(index);
            }}>
                <Text style={styles.showmore}>查看{item.subs.length}条回复 {">"}</Text>
            </TouchableOpacity>)
        } else {
            return(<View style={{backgroundColor:'#f5f5f5',padding:scaleSize(5)}}>
            {  item.subs.map((sub, subIndex) => {
                return <View key={subIndex} style={styles.itemSub}>
                    <View style={styles.subContainer}>
                        <Text style={styles.subReplyName}>{sub.nickName}：</Text>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                ParentId: item.id,
                                ReplyId: sub.userId,
                                ReplyTo: sub.nickName
                            })
                        }}>
                            <Text style={styles.subReplyContent}>{sub.title}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            })}
            </View>)
           
        }
    }
}

export default ForumDetailPage


const styles = StyleSheet.create({
    popbg: { backgroundColor: '#f4f4f4' },
    title: { fontSize: scaleSize(36), color: '#171717' },
    datetime: { fontSize: scaleSize(24), color: '#787878', marginVertical: scaleSize(20) },
    section: { borderTopColor: '#eeeeee', borderTopWidth: scaleSize(1), marginTop: scaleSize(30), paddingTop: scaleSize(20) },
    sectiontitle: { fontSize: scaleSize(36), color: '#171717', },
    avatar: { width: scaleSize(66), height: scaleSize(66), marginRight: scaleSizeW(20), borderRadius: scaleSizeW(33) },
    name: { fontSize: scaleSize(24), color: '#171717', },
    subReplyName: { fontSize: scaleSize(24), color: '#a4a7a9' },
    subReplyContent: { fontSize: scaleSize(24), color: '#a4a7a9' },
    txt: { fontSize: scaleSize(30), color: '#333', marginVertical: scaleSize(12) },
    txt2: { fontSize: scaleSize(24), color: '#666',  },
    txttime: { fontSize: scaleSize(24), color: '#a4a7a9', },
    showmore: { fontSize: scaleSize(24), color: '#8e9293', },
    item: { marginVertical: scaleSize(20), flexDirection: 'row', alignItems: 'flex-start' },
    itemSub: { marginVertical: scaleSize(3), flexDirection: 'row', alignItems: 'flex-start'},
    desc_container: {
        lineHeight: scaleSize(40)
    },
    desc_text: {
        color: '#050505',
        fontSize: scaleSize(30)
    },
    reply_content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: scaleSizeW(90),
        backgroundColor: '#dedede',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
    reply_text: {
        fontSize: scaleSizeW(30),
    },
    subContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    }
})

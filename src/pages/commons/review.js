import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, Animated, FlatList, RefreshControl, SafeAreaView, TouchableOpacity, TouchableHighlight } from 'react-native'
import { observer, inject } from 'mobx-react'
import CustomizeHeader from '../components/customizeheader'
import SendBox from '../chats/components/sendbox'
import RichTextWrapper from '../chats/components/richtextwrapper'
import commonStyle from '../../tools/commonstyles'
import { Toast } from './tools/tool' 
import { scaleSizeW, setSpText, config, Icons } from '../../tools/util'
import * as api from '../../mocks/api'
// import * as tools from '../../tools/tool'
import SendBoxParent from '../chats/components/sendboxParent'
import LongTouchAction from '../components/longtouchaction'
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
@inject('store')
@observer
class Review extends SendBoxParent {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      ReplyToUserId: 0,
      ReplyToCommentId: 0,
      placeHolder: '请输入您的评论',
      showSendBox: false,
      scrollY: new Animated.Value(0),
      SelectedId: 0,
      ShowActions: false,
      SendBoxHeight: new Animated.Value(0),
      CircleFriendItem: {
        id: 0,
        userId: 0,
        nickName: '',
        avatar: '',
        content: '',
        totalZans: 0,
        totalComments: 0,
        images: [],
        isZan: false,
        zanFriends: [],
        data: [],
        page: 1
      }
    }
  }
  // 初始化Circle Friend item
  initCircleFriendItem = () => {
    this.setState({
      CircleFriendItem: {
        id: 0,
        userId: 0,
        nickName: '',
        avatar: '',
        content: '',
        totalZans: 0,
        totalComments: 0,
        images: [],
        isZan: false,
        zanFriends: [],
        data: [],
        page: 1
      },
      Filter: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
        totalItemCount: 0
      }
    })
  }
  setCircleFriendItem = (item) => {
    let data = Object.assign({}, this.state.CircleFriendItem, item);
    this.setState({
      CircleFriendItem: data
    });
  }
  deleteFromCirclFriendItem = (id, totalComments) => {
    let circleFriendItem = Object.assign({}, this.state.CircleFriendItem);
    let _index = -1;
    let _subIndex = -1;
    circleFriendItem.data.forEach((item, index) => {
      if (item.id === id) {
        _index = index;
      }
      if (item.subComments !== undefined && item.subComments.length > 0) {
        item.subComments.forEach((subItem, subIndex) => {
          if (subItem.id === id) {
            _index = index;
            _subIndex = subIndex;
          }
        })
      }
    })
    if (_index !== -1 && _subIndex !== -1) {
      circleFriendItem.data[_index].subComments.splice(_subIndex, 1);
    }
    if (_index !== -1 && _subIndex === -1) {
      circleFriendItem.data.splice(_index, 1);
    }
    circleFriendItem.totalComments = totalComments;
    this.setState({
      CircleFriendItem: circleFriendItem
    });
  }

  refresh = () => {
    this.loadData();
  }
  reachEnd = () => {
    const { CircleFriendItem } = this.state;
    this.loadData({ page: CircleFriendItem.page + 1 });
  }
  componentDidMount = () => {
    this.loadData();
  }
  componentWillUnmount = () => {
    this.initCircleFriendItem();
  }

  loadData = (filter, callback) => {
    let that = this;
    if (filter === undefined || filter === null) {
      filter = {};
    }
    var currentData = this.props.navigation.getParam('data');
    const { CircleFriendItem } = this.state;
    filter.circleFriendId = currentData.id;
    if (filter.page === undefined)
      filter.page = CircleFriendItem.page;
    filter.replyToCommentId = 0;
    api.LoadComments(filter)
      .then(res => {
        that.setCircleFriendItem({
          id: currentData.id,
          userId: currentData.userId,
          nickName: currentData.nickName,
          avatar: currentData.avatar,
          content: currentData.content,
          images: currentData.images,
          isZan: currentData.isZan,
          zanFriends: currentData.zanFriends,
          totalZans: res.data.totalZans,
          totalComments: res.data.totalComments,
          data: res.data.data,
          page: res.data.pageNumber
        })
        if (callback !== undefined) {
          callback({
            totalZans: res.data.totalZans,
            totalComments: res.data.totalComments
          });
        }
      })
  }
  _renderItem = ({ item }) => {
    const { userInfo } = this.props.store.config;
    const { CircleFriendItem } = this.state;
    let canDelete = item.userId === userInfo.userId || userInfo.userId === CircleFriendItem.userId;
    return (
      <View style={styles.commentitem} key={item.id}>
        <TouchableOpacity onPress={() => this.props.navigation.push('UserDetail', { userId: item.userId })}>
          <Image source={{ uri: item.avatar }} style={styles.personavatar_sub} />
        </TouchableOpacity>
        <View style={styles.commentinfo}>
          <TouchableHighlight underlayColor={canDelete ? "#dedede" : "none"} onPress={() => { this.reply(item, item.id) }} onLongPress={(e) => {
            e.stopPropagation();
            if (canDelete) {
              this.setState({
                SelectedId: item.id,
                ShowActions: true
              })
            }
            return false;
          }}>
            <View>
              <View style={styles.idsex}>
                <Text style={styles.id}>{item.nickName}</Text>
                <View style={styles.sex}>
                  {/* <Image source={require('../../../images/test-avatar.png')} style={styles.xingbie} />
            <Text style={styles.txt6}>24</Text> */}
                </View>
              </View>
              <Text style={styles.commenttime}>{item.createdOn}</Text>
              <RichTextWrapper containerStyle={{ paddingTop: scaleSizeW(10) }} textStyle={styles.txt3} textContent={item.content} />
            </View>
          </TouchableHighlight>
          {item.subComments.length > 0 ? <View style={styles.commentcomment}>
            {item.subComments.map((subItem, index) => {
              let subCanDelete = subItem.userId === userInfo.userId || userInfo.userId === CircleFriendItem.userId;
              return (<TouchableHighlight underlayColor={subCanDelete ? "#dedede" : "none"}
                onPress={() => this.reply(subItem, item.id)}
                onLongPress={(e) => {
                  if (subCanDelete) {
                    e.stopPropagation();
                    this.setState({
                      SelectedId: subItem.id,
                      ShowActions: true
                    })
                  }
                  return false;
                }} style={styles.subcomment} key={index}>
                <RichTextWrapper textStyle={styles.txt5} textContent={subItem.content} />
              </TouchableHighlight>)
            })}
          </View> : null}
        </View>
      </View>
    )
  }
  _keyExtractor = (item, index) => item.id.toString();
  zanFriends = () => {
    let that = this;
    const { CircleFriendItem } = this.state;
    api.ZanFriend(CircleFriendItem.id)
      .then(res => {
        if (res.data.result === 1) {
          that.setCircleFriendItem({ isZan: res.data.isZan, totalZans: res.data.data.length });
          if (that.props.navigation.state.params.callback !== undefined) {
            that.props.navigation.state.params.callback({ isZan: res.data.isZan, totalZans: res.data.data.length, zanFriends: res.data.data })
          }
        }
      })
  }
  replyMain = () => {
    let that = this;
    this.setState({
      placeHolder: '请输入您的评论',
      ReplyToUserId: 0,
      ReplyToCommentId: 0,
    });
    return false;
  }
  reply = (item, commentId) => {
    let that = this;
    this.setState({
      placeHolder: `回复${item.nickName}：`,
      ReplyToUserId: item.userId,
      ReplyToCommentId: commentId === undefined ? 0 : commentId,
    })
    return false;
  }
  sendText = (v, callback) => {
    let that = this;
    if (v === '') {
      Toast.info('请输入您的回复');
      return;
    }
    const { CircleFriendItem } = this.state;
    api.SendComments({
      Content: v,
      CircleOfFriendId: CircleFriendItem.id,
      ReplyToUserId: this.state.ReplyToUserId,
      ReplyToCommentId: this.state.ReplyToCommentId,
    })
      .then(res => {
        if (res.data.result === 1) {
          that.loadData(null, ({ totalZans, totalComments }) => {
            that.props.navigation.state.params.callback({
              totalZans: totalZans,
              totalComments: totalComments,
            })
          });
          if (callback !== undefined) {
            callback();
          }
          Toast.info('您的评论已发表');
        } else {
          Toast.info(res.data.message);
        }
      });
    this.closePanel(() => {
      that.setState({
        showSendBox: false,
        ReplyToCommentId: 0,
        ReplyToUserId: 0
      });
    });

  }
  removeComment = () => {
    let that = this;
    if (this.state.SelectedId === 0) {
      Toast.info('请选择要删除的评论');
      return;
    }
    api.DeleteComment(this.state.SelectedId)
      .then(res => {
        if (res.data.result === 1) {
          that.deleteFromCirclFriendItem(this.state.SelectedId, res.data.totalComments);
          that.setState({
            SelectedId: 0,
            ShowActions: false
          })
        }
      });
  }
  deleteRow = () => {
    let that = this;
    let id = this.state.CircleFriendItem.id;
    let { removeItem } = this.props.store.activity;
    api.DeleteFriendCircle(id)
      .then(res => {
        if (res.data.result === 1) {
          Toast.info('删除成功', 0.5, () => {
            //从列表中删除
            removeItem(id);
            that.props.navigation.goBack();
          });
        }
      })
  }
  render() {
    const { userInfo } = this.props.store.config;
    const { CircleFriendItem } = this.state;
    let options = {
      sendVoice: () => { },
      sendText: this.sendText,
      sendImage: () => { },
      showPanel: this.showPanel,
      closePanel: this.closePanel,
      showPhotoPanel: false,
    }
    const { showBigPhoto } = this.props.store.bigphoto;
    // const _height = global.SendBox.keyBoardHeight;
    // var translateY = global.SendBox.panelHeight.interpolate({
    //   inputRange: [0, _height],
    //   outputRange: [0, -_height]
    // })
    let isSelf = CircleFriendItem.userId === userInfo.userId;

    return (
      <SafeAreaView style={[commonStyle.safeViewWithCusHead]}>
        <AnimatedFlatList
          // style={{ transform: [{ translateY: translateY }] }}
          contentContainerStyle={{ paddingBottom: scaleSizeW(110) }}
          onTouchStart={() => {
            this.closePanel();
          }}
          data={CircleFriendItem.data.slice()}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.refresh}
              onEndReached={this.reachEnd}
            />
          }
          ListHeaderComponent={
            <View onTouchMove={() => {
              this.setState({
                ReplyToUserId: 0,
                ReplyToCommentId: 0,
              })
            }}>

              <View style={styles.lifeitem}>
                <View style={styles.head1}>
                  <Image source={{ uri: CircleFriendItem.avatar }} style={styles.personavatar} />
                  <View style={styles.head1txt}>
                    <Text style={styles.txt1}>{CircleFriendItem.nickName}</Text>
                    {/* <Text style={styles.infotxt2}></Text> */}
                  </View>
                </View>
                <View style={styles.pengyouquan}>
                  {CircleFriendItem.content !== undefined && CircleFriendItem.content !== "" ? <Text style={styles.lifetxt}>{CircleFriendItem.content}</Text> : null}
                  <View style={styles.photos}>
                    {/* 图片 */}
                    {CircleFriendItem.images !== null && CircleFriendItem.images.length > 0 ? <View style={styles.image_list}>
                      {CircleFriendItem.images.map((_image, index) => {
                        return <TouchableOpacity onPress={() =>
                          showBigPhoto(0, [{ url: _image.imageUrl }], () => {
                            this.props.navigation.navigate('MyModal')
                          })} style={styles.image_item} key={index}>
                          <Image source={{ uri: _image.thumbnail }} resizeMode={'cover'} style={styles.lifepic1} />
                        </TouchableOpacity>
                      })}
                    </View> : null}
                  </View>
                </View>
                <View style={styles.lifeaction}>
                  {/* 分享 */}
                  {/* <View style={styles.zhuanfa}>
                    <Image source={require('../../../images/lifeicon4.png')} style={styles.lifepic2} />
                  </View> */}
                  {isSelf ? <View style={styles.delete}>
                    <TouchableOpacity onPress={() => {
                      this.deleteRow()
                    }}>
                      <Text style={styles.delete_text}>删除</Text>
                    </TouchableOpacity>
                  </View> : null}
                  {/* 赞 */}
                  <TouchableOpacity onPress={this.zanFriends} style={styles.like}>
                    {CircleFriendItem.isZan ? <Image source={require('../../../images/zan.png')} style={styles.lifepic3} /> :
                      <Image source={require('../../../images/lifeicon1.png')} style={styles.lifepic3} />}
                    <Text style={styles.txt2}>{CircleFriendItem.totalZans}</Text>
                  </TouchableOpacity>
                  {/* 回复 */}
                  <TouchableOpacity onPress={this.replyMain} style={styles.total_comments}>
                    <Image source={require('../../../images/lifeicon3.png')} style={styles.lifepic4} />
                    <Text style={styles.txt2}>{CircleFriendItem.totalComments}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.commenttitle}>
                最新评论（{CircleFriendItem.totalComments}）
                </Text>
            </View>}
        />
        {/* 长按弹出操作 */}
        <LongTouchAction Show={this.state.ShowActions} onClose={() => {
          this.setState({
            ShowActions: false
          })
        }}>
          <TouchableOpacity onPress={(e) => { e.stopPropagation(); this.removeComment(); }} style={styles.button_item}>
            <Text style={styles.button_text}>删除评论</Text>
          </TouchableOpacity>
        </LongTouchAction>
        <CustomizeHeader Title="评论" goBack={() => this.props.navigation.goBack()} />
        <SendBox {...options} textPlaceHolder={this.state.placeHolder} />
      </SafeAreaView>);
  }
}

export default Review;
const styles = StyleSheet.create({
  lifeitem: { paddingVertical: scaleSizeW(20), paddingHorizontal: scaleSizeW(40), borderBottomWidth: scaleSizeW(1), borderBottomColor: '#d9d9d9', borderTopColor: '#dedede', marginBottom: scaleSizeW(40) },
  head1: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
  head1txt: { paddingLeft: scaleSizeW(20) },
  personavatar: { width: scaleSizeW(130), height: scaleSizeW(130), borderRadius: scaleSizeW(65) },
  personavatar_sub: { width: scaleSizeW(70), height: scaleSizeW(70), borderRadius: scaleSizeW(35) },
  personinfo: { flex: 1, paddingLeft: scaleSizeW(30), paddingTop: scaleSizeW(20) },
  pengyouquan: { paddingTop: scaleSizeW(30) },
  photos: { paddingTop: scaleSizeW(20) },
  txt1: { fontSize: setSpText(28), color: '#302a2a', marginBottom: scaleSizeW(20) },
  infotxt2: { fontSize: setSpText(24), color: '#cacaca', marginBottom: scaleSizeW(20) },
  lifepic1: { width: scaleSizeW(200), height: scaleSizeW(200) },
  lifetxt: { fontSize: setSpText(28), color: '#555' },
  lifeaction: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingTop: scaleSizeW(30) },
  zhuanfa: { flex: 1 },
  lifepic2: { width: scaleSizeW(35), height: scaleSizeW(35), marginTop: scaleSizeW(5) },
  lifepic3: { width: scaleSizeW(40), height: scaleSizeW(36), marginLeft: scaleSizeW(50), marginTop: scaleSizeW(5) },
  lifepic4: { width: scaleSizeW(37), height: scaleSizeW(35), marginTop: scaleSizeW(5) },
  delete: { flex: 1, textAlign: 'left' },
  delete_text: { fontSize: setSpText(28), color: '#fc4185' },
  like: { flexDirection: 'row', marginRight: scaleSizeW(50) },
  total_comments: { flexDirection: 'row' },
  txt2: { fontSize: setSpText(28), color: '#9a98ad', marginLeft: scaleSizeW(10) },
  image_list: { flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start", flexWrap: 'wrap' },
  image_item: { width: scaleSizeW(200), height: scaleSizeW(200), marginRight: scaleSizeW(20), marginBottom: scaleSizeW(20) },
  commenttitle: { color: '#302a2a', fontSize: setSpText(28), paddingLeft: scaleSizeW(40) },
  commentitem: {
    paddingTop: scaleSizeW(30), paddingLeft: scaleSizeW(40), paddingRight: scaleSizeW(40),
    paddingBottom: 0, flexDirection: 'row', justifyContent: 'flex-start'
  },
  commentinfo: { flex: 1, paddingLeft: scaleSizeW(20) },
  id: { color: '#808080', fontSize: setSpText(28), marginRight: scaleSizeW(40) },
  idsex: { paddingTop: scaleSizeW(10), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', borderRadius: scaleSizeW(8) },
  sex: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#508bf8' },
  xingbie: { width: scaleSizeW(24), height: scaleSizeW(24) },
  txt6: { fontSize: setSpText(28), color: '#fff' },
  txt3: { fontSize: setSpText(30), color: '#302a2a' },
  commentcomment: { backgroundColor: '#fafafa', paddingVertical: scaleSizeW(20), paddingHorizontal: scaleSizeW(20), marginTop: scaleSizeW(20) },
  subcomment: { paddingTop: scaleSizeW(10), paddingBottom: scaleSizeW(10), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
  txt5: { color: '#a5a5a5', fontSize: setSpText(24) },
  commenttime: { color: '#a5a5a5', fontSize: setSpText(22) },
  button_item: { paddingTop: scaleSizeW(10), paddingBottom: scaleSizeW(10) },
  button_text: { fontSize: setSpText(24) },
})
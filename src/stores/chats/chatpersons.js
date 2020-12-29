import { observable, action, computed } from 'mobx'
import { GetFormatDateFormTimstamp, SetToLocal } from '../../tools/tool'
import AsyncStorage from '@react-native-community/async-storage';

class ChatPersons {
    @observable ChatFriends = []

    @action GetList = (userId) => {
        let that = this;
        AsyncStorage.getItem(`ChatFriends_${userId}`)
            .then(res => {
                let data = [];
                if (res === undefined || res === null || res === "") {
                    res = [];
                }
                if (typeof (res) === "string") {
                    data = JSON.parse(res);
                }
                let _data = [];
                if (data.length > 0) {
                    data.forEach((item) => {
                        let _item = Object.assign({}, item);
                        _item.lastTime = GetFormatDateFormTimstamp(_item.lastTime);
                        _data.push(_item);
                    });
                    _data = _data.sort((x, y) => { return y.lastTime > x.lastTime });
                    that.ChatFriends = _data;
                } else {
                    that.ChatFriends = [];
                }
            }, error => {
            })
    }

    ///userId为当前登录人的id
    @action AddToChatFriends = (item, userId) => {
        var lineItem = {
            userid: item.userid,
            name: item.name,
            age: item.age === undefined ? '' : item.age,
            city: item.city === undefined ? '' : item.city,
            height: item.height === undefined ? '' : item.height,
            hobby: item.hobby === undefined ? '' : item.hobby,
            photoUrl: item.photoUrl,
            lastMessage: item.lastMessage,
            lastMessageType: item.lastMessageType,
            lastTime: item.lastTime.getTime(),//时间戳
        };
        var showThisItem = true;
        if (lineItem.lastMessage === '' && lineItem.lastMessageType === 'text') {
            showThisItem = false;
        }
        AsyncStorage.getItem(`ChatFriends_${userId}`)
            .then(res => {
                let data = [];
                if (res === undefined || res === null || res === "") {
                    res = [];
                }
                if (typeof (res) === "string") {
                    data = JSON.parse(res);
                }
                else {
                    data = res;
                }
                if (data.filter(x => x.userid === item.userid).length === 0) {
                    data.push(lineItem);
                    //添加到本地
                    SetToLocal(`ChatFriends_${userId}`, data)
                } else {
                    if (showThisItem) {
                        data.filter(x => x.userid === item.userid)[0] = lineItem;
                    }
                }
            }, err => {
                console.log(err)
            });
        //添加到Store
        var index = this.ChatFriends.findIndex(x => x.userid === item.userid);
        if (index === -1) {
            this.ChatFriends.push({
                userid: item.userid,
                name: item.name,
                age: item.age === undefined ? '' : item.age,
                city: item.city === undefined ? '' : item.city,
                height: item.height === undefined ? '' : item.height,
                hobby: item.hobby === undefined ? '' : item.hobby,
                photoUrl: item.photoUrl,
                lastMessage: item.lastMessage,
                lastMessageType: item.lastMessageType,
                lastTime: GetFormatDateFormTimstamp(item.lastTime),//时间戳
            });
        } else {
            if (showThisItem) {
                var newItem = { lastTime: GetFormatDateFormTimstamp(lineItem.lastTime) };
                newItem = Object.assign({}, lineItem, newItem);
                this.ChatFriends[index] = newItem;
            }
        }
    }
    //从聊天列表中移除
    @action RemoveChatFriends(userId, targetId) {
        let that = this;
        AsyncStorage.getItem(`ChatFriends_${userId}`)
            .then(res => {
                let data = [];
                if (res === undefined || res === null || res === "") {
                    res = [];
                }
                if (typeof (res) === "string") {
                    data = JSON.parse(res);
                }
                else {
                    data = res;
                }
                let newData = [];
                data.forEach(item => {
                    if (item.userid !== targetId) {
                        newData.push(item);
                    }
                })
                SetToLocal(`ChatFriends_${userId}`, newData);
                that.GetList(userId, true);
            })
    }

    //更新最后消息信息
    ///isChangeStore 是否更新ChatFriends中信息
    @action UpdateFriendLastInfo = (userId, unReadMessages, fromUserIdList) => {
        let that = this;
        fromUserIdList.forEach(fromUserId => {
            AsyncStorage.getItem(`ChatFriends_${userId}`)
                .then(res => {
                    let data = [];
                    if (res === undefined || res === null || res === "") {
                        res = [];
                    }
                    if (typeof (res) === "string") {
                        data = JSON.parse(res);
                    }
                    else {
                        data = res;
                    }
                    var lastMessage = unReadMessages.filter(x => x.fromUserId === fromUserId);
                    if (lastMessage.length > 0) {
                        let _last = lastMessage[lastMessage.length - 1];
                        let hasUser = false;
                        if (data.length > 0) {
                            data.forEach(item => {
                                if (item.userid === fromUserId) {
                                    hasUser = true;
                                    //更新最新消息
                                    item.lastMessage = _last.content;
                                    item.lastMessageType = _last.type === 0 ? 'text' : _last.type === 1 ? 'image' : 'audio';
                                    item.lastTime = _last.time
                                }
                            })
                        }
                        if (!hasUser) {
                            data.push({
                                userid: _last.fromUserId,
                                name: _last.nickName,
                                photoUrl: _last.avatar,
                                lastMessage: _last.content,
                                lastMessageType: _last.type === 0 ? 'text' : _last.type === 1 ? 'image' : 'audio',
                                lastTime: _last.time,//时间戳
                                age: _last.age === undefined ? '' : _last.age,
                                city: _last.city === undefined ? '' : _last.city,
                                height: _last.height === undefined ? '' : _last.height,
                                hobby: _last.hobby === undefined ? '' : _last.hobby,
                            })
                        }
                    }
                    data = data.sort((x, y) => { return y.lastTime - x.lastTime });
                    SetToLocal(`ChatFriends_${userId}`, data);
                    that.ChatFriends = data.map((info) => {
                        info.lastTime = GetFormatDateFormTimstamp(info.lastTime);
                        return info;
                    });
                })
        })
    }


    @action UpdateFriendInfo(userId, targetId, message) {
        let that = this;
        AsyncStorage.getItem(`ChatFriends_${userId}`)
            .then(res => {
                let data = [];
                if (res === undefined || res === null || res === "") {
                    res = [];
                }
                if (typeof (res) === "string") {
                    data = JSON.parse(res);
                }
                else {
                    data = res;
                }
                let hasItem = false;
                if (data.length > 0) {
                    data.forEach(item => {
                        if (item.userid === targetId) {
                            hasItem = true;
                            //更新最新消息
                            item.lastMessage = message.lastMessage;
                            item.lastMessageType = message.lastMessageType;
                            item.lastTime = message.lastTime
                        }
                    })
                }
                if (!hasItem) {
                    data.push({
                        userid: message.userid,
                        name: message.name,
                        photoUrl: message.photoUrl,
                        lastMessage: message.lastMessage,
                        lastMessageType: message.lastMessageType,
                        lastTime: message.lastTime,//时间戳
                        age: message.age === undefined ? '' : message.age,
                        city: message.city === undefined ? '' : message.city,
                        height: message.height === undefined ? '' : message.height,
                        hobby: message.hobby === undefined ? '' : message.hobby,
                    })
                }
                data = data.sort((x, y) => { return y.lastTime - x.lastTime });
                SetToLocal(`ChatFriends_${userId}`, data);
                data = data.map((info) => {
                    info.lastTime = GetFormatDateFormTimstamp(info.lastTime);
                    return info;
                });
                that.ChatFriends = data;
            })
    }
}

export default new ChatPersons();
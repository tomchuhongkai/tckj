import { observable, action, computed } from 'mobx'
import { GetFormatDateFormTimstamp, SetToLocal } from '../../tools/tool'
import AsyncStorage from '@react-native-community/async-storage';

class Chat {
    @observable ChatMessages = []
    @action GetChatMessage = (isFirstTime, userId, targetUserId, page, pageSize) => {
        AsyncStorage.getItem(`ChatMessage_${userId}_${targetUserId}`)
            .then(res => {
                let data = [];
                if (res === undefined || res === null || res === "") {
                    res = [];
                }
                if (typeof (res) === "string") {
                    data = JSON.parse(res);
                }
                if (data.length > 0) {
                    data = data.sort((x,y)=>{y.time<x.time});
                    let total = data.length;
                    let totalPage = total / pageSize;
                    if (total % pageSize > 0) {
                        totalPage++;
                    }
                    let pageStart = (page - 1) * pageSize + 1;
                    let pageEnd = pageStart + pageSize;
                    if (pageEnd > total) {
                        pageEnd = total;
                    }
                    let _data = [];
                    for (var i = pageStart - 1; i < pageEnd; i++) {
                        let _item = data[i];
                        _item.time = GetFormatDateFormTimstamp(_item.time);
                        _data.push(_item);
                    }
                    if (page <= totalPage) {
                        let currentData = isFirstTime ? [] : this.ChatMessages.slice();
                        _data = _data.concat(currentData);
                        _data = _data.reverse();
                        this.ChatMessages = _data;
                    }
                } else {
                    this.ChatMessages = [];
                }
            }, error => {

            })
    }

    @action AddChatMessage = (item, userId, targetUserId) => {
        AsyncStorage.getItem(`ChatMessage_${userId}_${targetUserId}`)
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
                var lineItem = {
                    id: item.id,
                    userid: item.userid,
                    name: item.name,
                    time: item.time,//时间戳
                    url: item.url,
                    type: item.type,
                    status: 'completed',
                    content: item.content,
                    duration: item.duration,
                    imageWidth: item.imageWidth,
                    imageHeight: item.imageHeight,
                    pictureId: item.pictureId === undefined ? 0 : item.pictureId
                };
                data.splice(0, 0, lineItem);
                //添加到本地
                SetToLocal(`ChatMessage_${userId}_${targetUserId}`, data)
            }, err => {
                console.log(err)
            });
        //添加到Store
        this.ChatMessages.push({
            id: item.id,
            userid: item.userid,
            name: item.name,
            time: GetFormatDateFormTimstamp(item.time),//时间戳
            url: item.url,
            type: item.type,
            status: item.status,
            content: item.content,
            duration: item.duration,
            imageWidth: item.imageWidth,
            imageHeight: item.imageHeight,
            pictureId: item.pictureId === undefined ? 0 : item.pictureId
        });
    }

    @action RemoveChatAll(userId, targetUserId) {
        let that = this;
        AsyncStorage.removeItem(`ChatMessage_${userId}_${targetUserId}`)
            .then(res => {
                that.ChatMessages = [];
            })
    }
    // 更新离线信息
    @action AddUnReadMessages(unReadMessages, userId, fromUserIdList) {
        fromUserIdList.forEach(fromUserId => {
            AsyncStorage.getItem(`ChatMessage_${userId}_${fromUserId}`)
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
                    let _data = unReadMessages.filter(x => x.fromUserId === fromUserId).map(item => {
                        if (data.filter(t => t.time === item.time && t.userid === item.fromUserId).length > 0) {
                            //移除已经有的消息
                            return null;
                        }
                        return {
                            id: item.id.toString(),
                            userid: item.fromUserId,
                            name: item.nickName,
                            time: item.time,//时间戳
                            url: item.avatar,
                            type: item.type === 0 ? 'text' : item.type === 1 ? 'image' : 'audio',
                            status: 'completed',
                            content: item.content,
                            duration: item.duration,
                            imageWidth: item.imageWidth,
                            imageHeight: item.imageHeight,
                            pictureId: item.pictureId === undefined ? 0 : item.pictureId
                        };
                    });
                    _data = _data.filter(x => x !== null).concat(data);
                    _data = _data.sort((x, y) => { return y.lastTime - x.lastTime });
                    SetToLocal(`ChatMessage_${userId}_${fromUserId}`, _data);
                })
        })
    }

    @action changeChatStatus = (id, status, picId) => {
        let items = this.ChatMessages.slice();
        let _index = items.findIndex(x => x.id === id);
        if (_index !== -1) {
            items[_index].status = status;
            if (picId !== undefined) {
                items[_index].pictureId = picId;
            }
        }
        this.ChatMessages = items;
    }
}

export default new Chat();
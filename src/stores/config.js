
import { observable, action, computed } from 'mobx'
import * as tools from '../tools/tool'

class Config {
    @observable loading = [];
    @observable registrationId = "";
    @observable userInfo = {
        token: '',
        nickName: '',
        userId: 0,
        avatar: '',
        location: '嘉兴'
    };
    @observable badges = {
        ChatList: [],
        TotalChat: 0
    }
    @observable globalSearch={
        type:'',
        name:''
    }

    @action changeLoading(isLoading) {
        if (isLoading) {
            this.loading.push(1);
        } else {
            this.loading.splice(0, 1);
        }
    }

    @action setMessage(message, errorType) {
        if (this.message !== '' && this.messageInterval != null) {
            clearTimeout(this.messageInterval);
            this.messageInterval = null;
        }
        this.message = message;
        if (errorType !== undefined && errorType !== null) {
            this.messageType = errorType;
        }
        if (this.message === '') {
            clearTimeout(this.messageInterval);
            this.messageInterval = null;
        }
    }

    @action setMessageInterval(interval) {
        this.messageInterval = interval;
    }

    @action setRegistrationId(registrationId) {
        this.registrationId = registrationId;
    }

    @action setLoginInfo = (data) => {
        var _data = Object.assign({}, this.userInfo, data);
        this.userInfo = _data;
        tools.SetSiteToken(_data);
    }

    @action initUserInfo() {
        this.userInfo = {
            token: '',
            nickName: '',
            userId: 0,
            avatar: '',
            location: ''
        }
    }

    @action setGlobalSearch(obj){
        var _data = Object.assign({},this.globalSearch,obj);
        this.globalSearch = _data;
    }
}
export default new Config();
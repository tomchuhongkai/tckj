import { observable, action, computed } from 'mobx'
import { GetFormatDateFormTimstamp, SetToLocal } from '../../tools/tool'

class FormsProfile {
    //个人资料信息  这里的只做查看
    @observable postinfo = {
        data:[]
    }
    //用于修改的时候保存变量
    @observable hobby = {
        hobbyTags: [],
        favoriteStars: []
    }

    @observable editProfile = {
        phoneNumber: '',
        strGender: '',
        strAge: '',
        strAge: '',
        strConstellations: '',
        strHomeTown: '',
        strOccupation: '',
        strMaritalStatus: '',
        iLike: '',
        iDontLike: '',
        character: '',
        signature: ''
    }

    @action initData = () => {
        this.postinfo = {
            initprofile:[]
        }
        this.editProfile = {
            phoneNumber: '',
            strGender: '',
            strAge: '',
            strAge: '',
            constellations: '',
            strHomeTown: '',
            strOccupation: '',
            strMaritalStatus: '',
            iLike: '',
            iDontLike: '',
            character: '',
            signature: ''
        }
        this.hobby = {
            hobbyTags: [],
            favoriteStars: []
        }
    }
    //更新个人资料
    @action setProfile = (data) => {
        let model = Object.assign({}, this.postinfo, data);
        this.postinfo = model;
    }

    @action setHobby = (data) => {
        let _hobby = Object.assign({}, this.hobby, data);
        this.hobby = _hobby;
    }

    @action setEditProfile = (data) => {
        let _edit = Object.assign({}, this.editProfile, data);
        this.editProfile = _edit;
    }
}

export default new FormsProfile()
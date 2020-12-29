import { observable, action, computed } from 'mobx'
import { GetFormatDateFormTimstamp, SetToLocal } from '../../tools/tool'

class ComunityProfile {
    //个人资料信息  这里的只做查看
    @observable profile = {
        id: 0,
        nickName: '',
        avatar: '',
        backgroundImage: '',
        signature: '',
        profile: null,
        habit: null,
        hobby: null,
        senseWorth: null
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
        this.profile = {
            id: 0,
            nickName: '',
            avatar: '',
            backgroundImage: '',
            signature: '',
            profile: null,
            habit: null,
            hobby: null,
            senseWorth: null
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
        let model = Object.assign({}, this.profile, data);
        this.profile = model;
        this.editProfile = {
            phoneNumber: model.phoneNumber,
            strGender: model.profile.strGender,
            strAge: model.profile.strAge,
            strConstellations: model.profile.strConstellations,
            strHomeTown: model.profile.strHomeTown,
            strOccupation: model.profile.strOccupation,
            strMaritalStatus: model.profile.strMaritalStatus,
            iLike: model.profile.iLike,
            iDontLike: model.profile.idontLike,
            character: model.profile.character,
            signature: model.signature
        }
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

export default new ComunityProfile()
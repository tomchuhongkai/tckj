import { observable, action } from 'mobx'

class HerFate {
    @observable BasicModel = null;
    @observable HobbyModel = {
        favoriteStars: [],
        hobbyTags: [],
        hobbyTagsResource: [],
        hobbyTagsResourcePool: []
    }
    @observable HabitModel = null;
    @observable SenseWorthModel = null;
    @observable UserModel = {
        gender: 1
    }

    @action setBasicDefault = (data, gender) => {
        if(data.length>0 && data.filter(x=>x.key==="blood").length===0)
        {
            data.push({score:0,value:'',key:'blood',type:''});
        }
        if(data.length>0 && data.filter(x=>x.key==="wenShenState").length===0)
        {
            data.push({score:0,value:'',key:'wenShenState',type:''});
        }
        var basicModel = {
            gender: null, age: null, height: null, maritalStatus: null, hasKids: null,
            figure: null, likePet: null, homeTownId: null, cityId: null, occupation: null, monthSalary: null,
            constellations: null, likeSmoke: null, drink: null, education: null,blood:null,wenShenState:null
        };
        for (var keyName in basicModel) {
            if (data.filter(x => x.key === keyName).length > 0) {
                if (basicModel[keyName] !== undefined)
                    basicModel[keyName] = data.filter(x => x.key === keyName)[0];
            }
            switch (keyName) {
                // case 'homeTownId':
                // case 'cityId':
                case 'figure':
                case 'occupation':
                case 'constellations':
                case 'education':
                case 'monthSalary':
                    if (basicModel[keyName] !== undefined) {
                        if (typeof (basicModel[keyName].value) === 'string') {
                            if (basicModel[keyName].value !== "")
                                basicModel[keyName].value = JSON.parse(basicModel[keyName].value)
                        }
                    }
                    break;
            }
        }
        this.UserModel.gender = gender;
        this.BasicModel = basicModel;
    }

    @action setHobbyModel = (model) => {
        let _model = Object.assign({}, this.HobbyModel, model);
        this.HobbyModel = _model;
    }

    @action changeBasicModel = (key, model) => {
        var _model = Object.assign({}, this.BasicModel);
        for (var _field in _model) {
            if (_field === key) {
                _model[_field] = model;
            }
        }
        this.BasicModel = _model;
    }

    @action setHabitDefault = (data, gender) => {
        let habitModel = { houseWork: null, workAndRest: null, workStyle: null, workSystem: null, diet: null, lifeStyle: null }
        for (var keyName in habitModel) {
            if (data.filter(x => x.key === keyName).length > 0) {
                habitModel[keyName] = data.filter(x => x.key === keyName)[0];
            }
            if (typeof (habitModel[keyName].value) === 'string') {
                if (habitModel[keyName].value !== "")
                    habitModel[keyName].value = JSON.parse(habitModel[keyName].value)
            }
        }
        this.UserModel.gender = gender;
        this.HabitModel = habitModel;
    }

    @action changeHabitModel = (key, model) => {
        var _model = Object.assign({}, this.HabitModel);
        for (var _field in _model) {
            if (_field === key) {
                _model[_field] = model;
            }
        }
        this.HabitModel = _model;
    }


    @action setSenseWorthDefault = (data, gender) => {
        let senseWorthModel = {
            consumptionView: null, canLongDistanceLove: null, activeInFeeling: null,
            wantChild: null, familyCareerTendency: null, liveWithParents: null, waysOfTogether: null
        }
        for (var keyName in senseWorthModel) {
            if (data.filter(x => x.key === keyName).length > 0) {
                senseWorthModel[keyName] = data.filter(x => x.key === keyName)[0];
            }
            switch (keyName) {
                case 'consumptionView':
                case 'activeInFeeling':
                case 'waysOfTogether':
                    if (typeof (senseWorthModel[keyName].value) === 'string') {
                        if (senseWorthModel[keyName].value !== "")
                            senseWorthModel[keyName].value = JSON.parse(senseWorthModel[keyName].value)
                    }
                    break;
            }
        }
        this.UserModel.gender = gender;
        this.SenseWorthModel = senseWorthModel;
    }

    @action changeSenseWorthModel = (key, model) => {
        var _model = Object.assign({}, this.SenseWorthModel);
        for (var _field in _model) {
            if (_field === key) {
                _model[_field] = model;
            }
        }
        this.SenseWorthModel = _model;
    }

    @action initData = () => {
        this.BasicModel = null;
        this.HobbyModel = {
            favoriteStars: [],
            hobbyTags: [],
            hobbyTagsResource: [],
            hobbyTagsResourcePool: []
        }
        this.HabitModel = null;
        this.SenseWorthModel = null;
        this.UserModel = {
            gender: 1
        }
    }
}

export default new HerFate()
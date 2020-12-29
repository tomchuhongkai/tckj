import { observable, action, computed } from 'mobx'
import { GetFormatDateFormTimstamp, SetToLocal } from '../../tools/tool'
import AsyncStorage from '@react-native-community/async-storage';
import { throwStatement } from '@babel/types';

class User {
    
    @observable List = []
    @observable Filter = {
        pageIndex: 1,
        pageSize: 20,
        totalItemCount: 0,
        pageCount: 0,
        sortBy: 'rate',
        searchName: ''
    }

    @observable Model = {
        id: 0,
        nickName: '',
        avatar: '',
        backgroundImage: '',
        signature: '',
        phoneNumber: '',
        profile: null,
        habit: null,
        hobby: null,
        senseWorth: null
    }
    //detail页面中又新的tab  新的tab中的页面无法调用到外层的navigation，
    //所以这里赋值了一个外层的navigation
    @observable ParentNavigation = null;
    //对他人的要求
    @observable BaseModel = {
        id: 0,
        gender: null,
        age: null,
        height: null,
        maritalStatus: null,
        hasKids: null,
        figure: null,
        likePet: null,
        homeTownId: null,
        strHomeTownId: '',
        cityId: null,
        strCityId: '',
        occupation: null,
        monthSalary: null,
        constellations: null,
        likeSmoke: null,
        drink: null,
        education: null,
    }
    @observable SenseWorthModel = {
        id: 0,
        consumptionView: null,
        canLongDistanceLove: null,
        activeInFeeling: null,
        wantChild: null,
        familyCareerTendency: null,
        liveWithParents: null,
        waysOfTogether: null,
    }
    @observable HabitModel = {
        id: 0,
        diet: null,
        workAndRest: null,
        lifeStyle: null,
        houseWork: null,
        workStyle: null,
        workSystem: null,
    }

    ///必填项
    @observable NecessaryItems = []//key value 键值对modal
    ///加分项
    @observable AddScoreItems = [] //key value 键值对modal
    ///减分项
    @observable MinuseScoreItems = [] //key value 键值对modal

    @action setList = (reload, data, filter) => {
        if (data !== undefined && data !== null) {
            if (reload) {
                this.List = data;
            } else {
                this.List.concat(data);
            }
        }

        if (filter !== undefined) {
            this.Filter = filter;
        }
    }

    @action initModel = () => {
        this.Model = {
            id: 0,
            nickName: '',
            avatar: '',
            signature: '',
            phoneNumber: '',
            profile: null,
            habit: null,
            hobby: null,
            senseWorth: null
        }
        this.ParentNavigation = null;
    }

    @action setModel = (data, navigation) => {
        if (data !== undefined && data !== null) {
            var _data = Object.assign({}, this.Model, data);
            this.Model = _data;
        }
        if (navigation !== undefined) {
            this.ParentNavigation = navigation;
        }
    }
    @action setBaseModel = (data, navigation) => {
        if (data !== undefined && data !== null) {
            var _data = Object.assign({}, this.BaseModel, data);
            this.BaseModel = _data;
        }
        if (navigation !== undefined) {
            this.ParentNavigation = navigation;
        }
    }
    @action setSenseWorthModel = (data, navigation) => {
        if (data !== undefined && data !== null) {
            var _data = Object.assign({}, this.SenseWorthModel, data);
            this.SenseWorthModel = _data;
        }
        if (navigation !== undefined) {
            this.ParentNavigation = navigation;
        }
    }
    @action setHabitModel = (data, navigation) => {
        if (data !== undefined && data !== null) {
            var _data = Object.assign({}, this.HabitModel, data);
            this.HabitModel = _data;
        }

        if (navigation !== undefined) {
            this.ParentNavigation = navigation;
        }
    }

    @action addToItems = (input, type) => {
        let item = { key: '', value: null, score: 0 };
        let _score = 0;
        if (input.score !== undefined) {
            _score = input.score
        }
        item.score = _score;
        if (input.homeTownId !== undefined) {
            item.key = 'homeTownId';
            item.value = input.homeTownId;
            this.BaseModel.strHomeTownId = input.strHomeTownId
        } else if (input.cityId !== undefined) {
            item.key = 'cityId';
            item.value = input.cityId;
            this.BaseModel.strCityId = input.strCityId
        } else {
            for (var key in input) {
                if (key === 'score') {
                    item.score = input.score;
                } else {
                    item.key = key;
                    item.value = input[key];
                }
            }
        }
        let source = [];
        let data = { source: [], type: '' }
        switch (type) {
            case "N":
                source = this.NecessaryItems.slice();
                data = this.getNewSource(source, item);
                this.NecessaryItems = source;
                break;
            case "A":
                source = this.AddScoreItems.slice();
                data = this.getNewSource(source, item);
                this.AddScoreItems = data.source;
                break;
            case "M":
                source = this.MinuseScoreItems.slice();
                data = this.getNewSource(source, item);
                this.MinuseScoreItems = source;
                break;
            default:
                break;
        }
        switch (data.type) {
            case 'minuse':
                if (this.BaseModel.hasOwnProperty(item.key)) {
                    this.BaseModel[item.key] = null;
                }
                if (this.SenseWorthModel.hasOwnProperty(item.key)) {
                    this.SenseWorthModel[item.key] = null;
                }
                if (this.HabitModel.hasOwnProperty(item.key)) {
                    this.HabitModel[item.key] = null;
                }
                break;
            case 'update':
                if (this.BaseModel.hasOwnProperty(item.key)) {
                    this.BaseModel[item.key] = item.value;
                }
                if (this.SenseWorthModel.hasOwnProperty(item.key)) {
                    this.SenseWorthModel[item.key] = item.value;
                }
                if (this.HabitModel.hasOwnProperty(item.key)) {
                    this.HabitModel[item.key] = item.value;
                }
                break;
            case 'add':
                if (this.BaseModel.hasOwnProperty(item.key)) {
                    this.BaseModel[item.key] = item.value;
                }
                if (this.SenseWorthModel.hasOwnProperty(item.key)) {
                    this.SenseWorthModel[item.key] = item.value;
                }
                if (this.HabitModel.hasOwnProperty(item.key)) {
                    this.HabitModel[item.key] = item.value;
                }
                break;
            default:
                break;
        }
        //性别更改身材改变
        if (item.key === "gender") {
            let _newIndex = this.NecessaryItems.findIndex(x => x.key === 'figure');
            if (_newIndex !== -1) {
                this.NecessaryItems.splice(_newIndex, 1);
            }
            _newIndex = this.AddScoreItems.findIndex(x => x.key === 'figure');
            if (_newIndex !== -1) {
                this.AddScoreItems.splice(_newIndex, 1);
            }
            _newIndex = this.MinuseScoreItems.findIndex(x => x.key === 'figure');
            if (_newIndex !== -1) {
                this.MinuseScoreItems.splice(_newIndex, 1);
            }
            this.BaseModel.figure = null;
        }
    }
    @action clearItems = () => {
        this.BaseModel = {
            id: 0,
            gender: null,
            age: null,
            height: null,
            maritalStatus: null,
            hasKids: null,
            figure: null,
            likePet: null,
            homeTownId: null,
            cityId: null,
            occupation: null,
            monthSalary: null,
            constellations: null,
            likeSmoke: null,
            drink: null,
            education: null,
        }
        this.SenseWorthModel = {
            id: 0,
            consumptionView: null,
            canLongDistanceLove: null,
            activeInFeeling: null,
            wantChild: null,
            familyCareerTendency: null,
            liveWithParents: null,
            waysOfTogether: null,
        }
        this.HabitModel = {
            id: 0,
            diet: null,
            workAndRest: null,
            lifeStyle: null,
            houseWork: null,
            workStyle: null,
            workSystem: null,
        }
        this.NecessaryItems = [];
        this.AddScoreItems = [];
        this.MinuseScoreItems = [];
    }

    @action setRequirements = (necessaries, addScores, minuseScores) => {
        let _baseModel = Object.assign({}, this.BaseModel);
        let _habitModel = Object.assign({}, this.HabitModel);
        let _senseWorthModel = Object.assign({}, this.SenseWorthModel);
        if (necessaries !== undefined) {
            necessaries.forEach(element => {
                this.setValueToModel(_baseModel, _habitModel, _senseWorthModel, element);
            });
            this.NecessaryItems = necessaries;
        }
        if (addScores !== undefined) {
            addScores.forEach(element => {
                this.setValueToModel(_baseModel, _habitModel, _senseWorthModel, element);
            });
            this.AddScoreItems = addScores;
        }
        if (minuseScores !== undefined) {
            minuseScores.forEach(element => {
                this.setValueToModel(_baseModel, _habitModel, _senseWorthModel, element);
            });
            this.MinuseScoreItems = minuseScores;
        }
        this.BaseModel = _baseModel;
        this.HabitModel = _habitModel;
        this.SenseWorthModel = _senseWorthModel;
    }
    setValueToModel = (_baseModel, _habitModel, _senseWorthModel, element) => {
        for (var item in _baseModel) {
            if (element.key === item) {
                _baseModel[item] = element.value
            }
        }
        for (var item in _habitModel) {
            if (element.key === item) {
                _habitModel[item] = element.value
            }
        }
        for (var item in _senseWorthModel) {
            if (element.key === item) {
                _senseWorthModel[item] = element.value
            }
        }
    }
    getNewSource = (source, item) => {
        let _index = source.findIndex(x => x.key === item.key);
        let itemType = ''
        if (_index !== -1) {
            let newItem = source.filter(x => x.key === item.key)[0];
            if (newItem.value === item.value) {
                source.splice(_index, 1);
                itemType = 'minuse';
            } else {
                source[_index] = item;
                itemType = 'update';

            }
        } else {
            source.push(item)
            itemType = 'add';
        }
        return { type: itemType, source: source };
    }
    @action initAll = () => {
        this.List = [];
        this.Filter = {
            pageIndex: 1,
            pageSize: 20,
            totalItemCount: 0,
            pageCount: 0,
            sortBy: 'rate',
            searchName: ''
        }
        this.initModel();
        this.BaseModel = {
            id: 0,
            gender: null,
            age: null,
            height: null,
            maritalStatus: null,
            hasKids: null,
            figure: null,
            likePet: null,
            homeTownId: null,
            strHomeTownId: '',
            cityId: null,
            strCityId: '',
            occupation: null,
            monthSalary: null,
            constellations: null,
            likeSmoke: null,
            drink: null,
            education: null,
        };
        this.SenseWorthModel = {
            id: 0,
            consumptionView: null,
            canLongDistanceLove: null,
            activeInFeeling: null,
            wantChild: null,
            familyCareerTendency: null,
            liveWithParents: null,
            waysOfTogether: null,
        };

        this.HabitModel = {
            id: 0,
            diet: null,
            workAndRest: null,
            lifeStyle: null,
            houseWork: null,
            workStyle: null,
            workSystem: null,
        };
        this.NecessaryItems = [];//key value 键值对modal
        ///加分项
        this.AddScoreItems = []; //key value 键值对modal
        ///减分项
        this.MinuseScoreItems = []; //key value 键值对modal
    }
}

export default new User()
import { observable, action } from 'mobx'

class MyFate {
    @observable profile = {
        id:0,
        gender: null,
        strGender:'',
        age: null,
        birthYear:null,
        birthMonth:null,
        birthDay:null,
        strBirth:null,
        height: null,
        maritalStatus: null,
        strMaritalStatus:null,
        hasKids: null,
        figure: null,
        strFigure:null,
        likePet: null,
        strLikePet:null,
        homeTownId: null,
        strHomeTown:null,
        cityId: null,
        strCity:null,
        occupation: null,
        strOccupation:null,
        monthSalary: null,
        strMonthSalary:null,
        constellations:null,
        strConstellations: null,
        likeSmoke: null,
        drink: null,
        strDrink:null,
        education: null,
        strEducation:null,
        character:null,
        strBlood:null,
        blood:null,
        strWenShenState:null,
        wenShenState:null
    }
    @observable hobby = {
        favoriteStars:null,
        hobbyTags:null,
        hobbyTagsResource:[],
        hobbyTagsResourcePool:null
    }
    @observable senseWorth = {
        consumptionView: null,
        strConsumptionView:'',
        canLongDistanceLove: null,
        strCanLongDistanceLove:'',
        activeInFeeling: null,
        strActiveInFeeling:'',
        wantChild: null,
        strWantChild:'',
        familyCareerTendency: null,
        strFamilyCareerTendency:'',
        liveWithParents: null,
        strLiveWithParents:'',
        waysOfTogether: null,
        strWaysOfTogether:''
    }
    @observable habit = {
        diet: null,
        strDiet:'',
        workAndRest: null,
        strWorkAndRest:'',
        lifeStyle: null,
        strLifeStyle:'',
        houseWork: null,
        strHouseWork:'',
        workStyle: null,
        strWorkStyle:'',
        workSystem: null,
        strWorkSystem:''
    }

    @action setModel = (type, model) => {
        switch (type) {
            case 'profile':
                let _model = Object.assign({}, this.profile, model);
                this.profile = _model;
                break;
            case 'senseworth':
                let _model2 = Object.assign({}, this.senseWorth, model);
                this.senseWorth = _model2;
                break;
            case 'habit':
                let _model3 = Object.assign({}, this.habit, model);
                this.habit = _model3;
                break;
            case 'hobby':
                let _model4 = Object.assign({}, this.hobby, model);
                this.hobby = _model4;
                break;
            default:break;
        }
    }

    @action initData=()=>{
        this.profile = {
            id:0,
            gender: null,
            strGender:'',
            age: null,
            birthYear:null,
            birthMonth:null,
            birthDay:null,
            strBirth:null,
            height: null,
            maritalStatus: null,
            strMaritalStatus:null,
            hasKids: null,
            figure: null,
            strFigure:null,
            likePet: null,
            strLikePet:null,
            homeTownId: null,
            strHomeTown:null,
            cityId: null,
            strCity:null,
            occupation: null,
            strOccupation:null,
            monthSalary: null,
            strMonthSalary:null,
            constellations:null,
            strConstellations: null,
            likeSmoke: null,
            drink: null,
            strDrink:null,
            education: null,
            strEducation:null,
            character:null,
            strBlood:null,
            blood:null,
            strWenShenState:null,
            wenShenState:null
        };
        this.hobby = {
            favoriteStars:null,
            hobbyTags:null,
            hobbyTagsResource:[],
            hobbyTagsResourcePool:null
        };
        this.senseWorth = {
            consumptionView: null,
            strConsumptionView:'',
            canLongDistanceLove: null,
            strCanLongDistanceLove:'',
            activeInFeeling: null,
            strActiveInFeeling:'',
            wantChild: null,
            strWantChild:'',
            familyCareerTendency: null,
            strFamilyCareerTendency:'',
            liveWithParents: null,
            strLiveWithParents:'',
            waysOfTogether: null,
            strWaysOfTogether:''
        };
        this.habit = {
            diet: null,
            strDiet:'',
            workAndRest: null,
            strWorkAndRest:'',
            lifeStyle: null,
            strLifeStyle:'',
            houseWork: null,
            strHouseWork:'',
            workStyle: null,
            strWorkStyle:'',
            workSystem: null,
            strWorkSystem:''
        }
    }
}

export default new MyFate()
import { observable, action, computed } from 'mobx'
function getDefaultBirthYear() {
    return new Date().getFullYear() - 25;
}
class UserProfile {
    @observable profile = {
        nickName: '',
        cuteAvatar: "",
        realAvatar: "",
        gender: 0,
        likeGender: 0,
        cityId: 0,
        strCityId: '请选择',
        homeTownId: 0,
        strHomeTownId: '请选择',
        birthYear: getDefaultBirthYear(),
        birthMonth: 1,
        birthDay: 1,
        strBirth: `${getDefaultBirthYear()}-01-01`,
        strShengXiao: '',
        maritalStatus: 0,
        hasKids: true,
        wantKids: true,
        likePet: 0,
        likeSmoke: '',
        strLikeSmoke: '请选择',
        drink: 0,
        strDrink: '请选择',
        education: 0,
        strEducation: '请选择',
        monthSalary: 0,
        strMonthSalary: '',
        figure: 0,
        characterStatus: 0,
        latitude: 0,
        longitude: 0,
        futureLocationId: 0,
        occupation: 0,
        strOccupation: '请选择',
        neccesseryItems: "",
        addOnItems: "",
        minuseItems: "",
        id: 0,
        height: 175,
        showMaritalStatus: true,
        showMonthSalary: true,
        showLikeSmoke: true,
        showEducation: true
    }

    @action changeProfile = (data) => {
        var obj = Object.assign({}, this.profile, data);
        this.profile = obj;
    }
}

export default new UserProfile()
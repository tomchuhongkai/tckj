import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import * as api from '../mocks/api'
import * as tools from '../tools/tool'
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions,NavigationActions } from 'react-navigation'
const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'ManagerMain' }),  //Login 要跳转的路由
    ]
})
import AnimatedMultistep from 'react-native-animated-multistep'
import step1 from "./basicstep/step1";
import step2 from "./basicstep/step2";
import step3 from "./basicstep/step3";
import step4 from "./basicstep/step4";
import step5 from "./basicstep/step5";
import step6 from "./basicstep/step6";
import step7 from "./basicstep/step7";
import step8 from "./basicstep/step8";
import step10 from "./basicstep/step10";
import step11 from "./basicstep/step11";
import step12 from "./basicstep/step12";

const allSteps = [
    { name: "step 1", component: step1 },
    { name: "step 2", component: step2 },
    { name: "step 3", component: step3 },
    { name: "step 4", component: step4 },
    { name: "step 5", component: step5 },
    { name: "step 6", component: step6 },
    { name: "step 7", component: step7 },
    { name: "step 8", component: step8 },
    { name: "step 10", component: step10 },
    { name: "step 11", component: step11 },
    { name: "step 12", component: step12 },
];



@inject('store')
@observer
class Basicstep extends Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            Data: null,
            currentStep: 0,
        }
    }
    componentDidMount = () => {
        global.BasicStepNav = this.props.navigation;
    }

    componentWillUnmount = () => {
        tools.CancelAxios();
    }

    /* define the method to be called when you go on next step */

    onNext = () => {
        this.setState({ currentStep: this.state.currentStep + 1 });
    };

    /* define the method to be called when you go on back step */

    onBack = () => {
    };

    /* define the method to be called when the wizard is finished */
    finish = finalState => {
        // console.log(finalState);
        let that = this;
        let profile = this.props.store.userprofile.profile;
        var location = global.Coordinate === undefined ? {
            Latitude: 0,
            Longitude: 0
        } : global.Coordinate;
        var data = {
            nickName: profile.nickName,
            gender: profile.gender,
            cityId: profile.cityId,
            homeTownId: profile.homeTownId,
            birthYear: profile.birthYear,
            birthMonth: profile.birthMonth,
            birthDay: profile.birthDay,
            height: profile.height,
            maritalStatus: profile.maritalStatus,
            likePet: profile.likePet,
            likeSmoke: profile.likeSmoke,
            education: profile.education,
            monthSalary: profile.monthSalary,
            latitude: location.Latitude,
            longitude: location.Longitude,
            id: 0,
            showMaritalStatus: profile.showMaritalStatus,
            showMonthSalary: profile.showMonthSalary,
            showLikeSmoke: profile.showLikeSmoke,
            showEducation: profile.showEducation
        }
        api.SetProfile(data).then((res) => {
            if (res.data.result == 1) {
                tools.Toast.success(res.data.message, 0.5, () => {
                    that.doRedirect(res.data)
                });
            } else {
                tools.Toast.fail(res.data.message);
            }
        }, err => {
            tools.Toast.fail(err.toString());
        })
    };
    doLoginChat = (userId, nickName) => {
        if (global.MyWebSocket) {
            global.MyWebSocket.invoke("Login", nickName, userId, true);
        }
    }
    doRedirect = (data) => {
        let that = this;
        this.doLoginChat(data.userId, data.nickName)
        AsyncStorage.getItem('AUTHTOKEN').then((v) => {
            var vNew = JSON.parse(v);
            if (vNew !== undefined && vNew !== null && vNew !== "") {
                that.props.store.config.setLoginInfo({
                    token: vNew.token,
                    nickName: data.nickName,
                    userId: data.userId,
                    avatar: data.avatar,
                    setting: data.setting,
                    hasProfile: data.hasProfile,
                    gender:data.gender
                });
                that.props.navigation.dispatch(resetAction);
            }
        })
    }

    /* render MultiStep */
    componentWillUnmount = () => {
        global.BasicStepNav = null;
    }
    render() {

        // if (this.state.Data === null)
        //     return null;
        return (
            <AnimatedMultistep
                steps={allSteps}
                onFinish={this.finish}
                onBack={this.onBack}
                onNext={this.onNext}
                comeInOnNext="bounceInUp"
                OutOnNext="bounceOutDown"
                comeInOnBack="bounceInDown"
                OutOnBack="bounceOutUp"
            />)
    }
}

export default Basicstep
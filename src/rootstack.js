import React from 'react'
import { createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { Image, Text, View, ScrollView, TouchableWithoutFeedback } from 'react-native'
import SignIn from './signin'
import Register from './register'
import Agreement from './pages/agreement'
import Basicstep from './pages/basicstep'
import CitySelector from './pages/commons/cityselector'

import ModalScreen from './pages/commons/modalscreen'
import ForgotPassword from './forgotpassword'
import AuthResetPassword from './authresetpassword'
import RegisterActive from './registeractive'
import LandingPage from './landingpage'
import ManagerStacks from './managerstacks'
import { scaleSizeW,setSpText } from './tools/util';
import Pinggu from './pages/home/pinggu'
import Hengji from './pages/home/hengji'
import MyTabBar from './pages/components/myTabBar'
import commonStyle from './tools/commonstyles'
import * as tools from './tools/tool'
import * as locals from './tools/localdata'


const imageList = {
    "Home": require('../images/menu-icon-1.png'),
    "Home2": require('../images/menu-icon-1-selected.png'),
    "NewMechine": require('../images/menu-icon-2.png'),
    "NewMechine2": require('../images/menu-icon-2-selected.png'),
    "SecondMechine": require('../images/menu-icon-3.png'),
    "SecondMechine2": require('../images/menu-icon-3-selected.png'),
    "Actions": require('../images/menu-icon-6.png'),
    "Actions2": require('../images/menu-icon-6-selected.png'),
    "MyInfo": require('../images/menu-icon-5.png'),
    "MyInfo2": require('../images/menu-icon-5-selected.png')
}
const MainStack = createBottomTabNavigator(ManagerStacks, {
    initialRouteName: 'Home',
    defaultNavigationOptions: ({ navigation, screenProps }) => ({
        tabBarComponent: MyTabBar,
        indicatorStyle: {
            backgroundColor: 'transparent'
        },
        style: {
            backgroundColor: 'rgba(22, 22, 22, 0.3)',
            borderTopWidth: 3,
            borderTopColor: '#996600',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0
        },
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            let unFocusedImg = imageList[routeName];
            let focusedImg = imageList[routeName + "2"];
            let textComp = null;
            const _fontSize = setSpText(20);
            let _width = 45;
            let _height = 45;
            
            switch (routeName) {
                default:
                case 'Home':
                    textComp = <Text style={{ textAlign: 'center', marginTop: scaleSizeW(3), fontSize: _fontSize, color: focused ? '#eb5946' : '#000' }}>首页</Text>;
                    break;
                case 'NewMechine':
                    _height=42;
                    textComp = <Text style={{ textAlign: 'center', marginTop: scaleSizeW(3), fontSize: _fontSize, color: focused ? '#eb5946' : '#000' }}>新机器</Text>;
                    break;
                 case 'Actions':
                        _width=43;
                        textComp = <Text style={{ textAlign: 'center', marginTop: scaleSizeW(3), fontSize: _fontSize, color: focused ? '#eb5946' : '#000' }}>在线竞价</Text>;
                        break;
                case 'SecondMechine':
                    _width=43;
                    textComp = <Text style={{ textAlign: 'center', marginTop: scaleSizeW(9), fontSize: _fontSize, color: focused ? '#eb5946' : '#000' }}>二手机</Text>;
                    break;
             
                case 'MyInfo':
                    _width=44;
                    _height=43;
                    textComp = <Text style={{ textAlign: 'center', marginTop: scaleSizeW(3), fontSize: _fontSize, color: focused ? '#eb5946' : '#000' }}>我的</Text>;
                    break;
            }
            if (focused) {
                return (<View style={{ flexDirection: 'column', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* {routeName === "Message" && screenProps.TotalChat > 0 ? <View style={commonStyle.badges}></View> : null} */}
                    <Image source={focusedImg} style={{ width: scaleSizeW(_width), height: scaleSizeW(_height) }} />
                    {textComp}
                </View>)
            }
            return (
                <View style={{ flexDirection: 'column', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* {routeName === "Message" && screenProps.TotalChat > 0 ? <View style={commonStyle.badges}></View> : null} */}
                    <Image source={unFocusedImg} style={{ width: scaleSizeW(_width), height: scaleSizeW(_height) }} />
                    {textComp}
                </View>)
        }
    })
})

const authStack = createStackNavigator({
    // Basicstep: Basicstep,
    SignIn: SignIn,
    Register: Register,
    Agreement: Agreement,
    ForgotPassword: ForgotPassword,
    Pinggu: Pinggu,
    Hengji: Hengji,
    AuthResetPassword: AuthResetPassword,
    RegisterActive: RegisterActive,
    CitySelector: CitySelector
}, {
    initialRouteName: 'SignIn'
})

function forVertical(props) {
    const { layout, position, scene } = props;

    const index = scene.index;
    const height = layout.initHeight;

    const translateX = 0;
    const translateY = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [height, 0, 0]
    });

    return {
        transform: [{ translateX }, { translateY }]
    };
}
//createSwitchNavigator
const AllNavigations = createStackNavigator({
    Loading: LandingPage,
    ManagerMain: MainStack,
    MyModal:ModalScreen
}, {
    initialRouteName: 'Loading',
    headerMode:'none',
    mode:'modal',
})


export default AllNavigations

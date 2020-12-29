import React, { Component } from 'react'
import { View, Text, TouchableWithoutFeedback} from 'react-native'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import PersonalInfo from '../worlds/personalinfo'
import Photos from '../worlds/photos'
import Activity from '../worlds/activity'
import SocialGround from '../worlds/socialground'
import PairReason from '../worlds/pairreason'
import commonStyle from '../../tools/commonstyles'

const UserDetailTab = createMaterialTopTabNavigator({
    Personal: PersonalInfo,
    Photos: Photos,
    Activity: Activity,
    Comunity: SocialGround,
    PairDetail: PairReason
}, {
    initialRouteName: 'Personal',
    tabBarComponent: (props) => {
        const {
            navigation: { state: { index, routes } },
            jumpTo
        } = props;
        return (<View style={commonStyle.tabBar_detail}>
            {routes.map((route, idx) => {
                let _style = [commonStyle.tabBar_detail_item_text];
                if (idx === index) {
                    _style.push(commonStyle.tabBar_detail_item_selected)
                }
                switch (route.routeName) {
                    case 'Personal':
                        return <TouchableWithoutFeedback key={idx} onPress={() => { jumpTo(route.key) }}>
                            <View style={commonStyle.tabBar_detail_item}>
                                <Text style={_style}>资料</Text>
                            </View>
                        </TouchableWithoutFeedback>;
                    case 'Photos':
                        return <TouchableWithoutFeedback key={idx} onPress={() => { jumpTo(route.key) }}>
                            <View style={commonStyle.tabBar_detail_item}>
                                <Text style={_style}>相册</Text>
                            </View>
                        </TouchableWithoutFeedback>;
                    case 'Activity':
                        return <TouchableWithoutFeedback key={idx} onPress={() => { jumpTo(route.key) }}>
                            <View style={commonStyle.tabBar_detail_item}>
                                <Text style={_style}>动态</Text>
                            </View>
                        </TouchableWithoutFeedback>;
                    case 'Comunity':
                        return <TouchableWithoutFeedback key={idx} onPress={() => { jumpTo(route.key) }}>
                            <View style={commonStyle.tabBar_detail_item}>
                                <Text style={_style}>社区</Text>
                            </View>
                        </TouchableWithoutFeedback>;
                    case 'PairDetail':
                        return <TouchableWithoutFeedback key={idx} onPress={() => { jumpTo(route.key) }}>
                            <View style={commonStyle.tabBar_detail_item}>
                                <Text style={_style}>配对明细</Text>
                            </View>
                        </TouchableWithoutFeedback>;
                }

            })}
        </View>)
    },
    lazy: true
})

export default UserDetailTab
import React, { Component } from 'react'
import { View, Text, Image, TouchableWithoutFeedback, StyleSheet, TouchableOpacity,StatusBar } from 'react-native'
import { createAppContainer, SafeAreaView } from 'react-navigation'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { inject, observer } from 'mobx-react'
import commonStyle from '../../tools/commonstyles'
import PublishPage from '../mine/PublishPage'
import AuctionPage from '../mine/AuctionPage'
import SettingPage from '../mine/SettingPage'
import {config,scaleSize,setSpText,scaleSizeW,clearBoxPng} from '../../tools/util'
import HeaderTitle from '../components/headerTitle'
import BackButton from '../components/backButton'
import RightButton from '../components/rightButton'

let _this = null;
const TabHeader = (props) => {
    const {
        navigation: { state: { index, routes } },
        jumpTo
    } = props;
    return (<View style={[commonStyle.tabBar_detail, styles.tabContainer]}>
        {routes.map((route, idx) => {
            let _style = [commonStyle.tabBar_detail_item_text, styles.item_text];
            if (idx === index) {
                _style.push(styles.item_text_selected)
            }
            switch (route.routeName) {
                case 'myPublish':
                    return <TouchableWithoutFeedback key={idx} onPress={() => { jumpTo(route.key) }}>
                        <View style={[commonStyle.tabBar_detail_item, styles.item]}>
                            <Text style={_style}>我的发布</Text>
                            {idx === index ? <View style={[commonStyle.tabBar_detail_item_underline]}><View style={commonStyle.tabBar_detail_item_underline_bg}></View></View> : null}
                        </View>
                    </TouchableWithoutFeedback>;
                     case 'myAuction':
                        return <TouchableWithoutFeedback key={idx} onPress={() => { jumpTo(route.key) }}>
                            <View style={[commonStyle.tabBar_detail_item, styles.item]}>
                                <Text style={_style}>我的拍卖</Text>
                                {idx === index ? <View style={[commonStyle.tabBar_detail_item_underline]}><View style={commonStyle.tabBar_detail_item_underline_bg}></View></View> : null}
                            </View>
                        </TouchableWithoutFeedback>;
                case 'mySetting':
                    return <TouchableWithoutFeedback key={idx} onPress={() => { jumpTo(route.key) }}>
                        <View style={[commonStyle.tabBar_detail_item, styles.item]}>
                            <Text style={_style}>我的设置</Text>
                            {idx === index ? <View style={commonStyle.tabBar_detail_item_underline}><View style={commonStyle.tabBar_detail_item_underline_bg}></View></View> : null}
                        </View>
                    </TouchableWithoutFeedback>;
            }
        })}
    </View>)
}

const TabNavs = createMaterialTopTabNavigator({
    myPublish: PublishPage,
    myAuction: AuctionPage,
    mySetting: SettingPage,
}, {
    initialRouteName: 'mySetting',
    tabBarComponent: TabHeader,
    lazy: true
})

const TabContainer = createAppContainer(TabNavs);

// @inject('store')
// @observer
class MyInfoPage extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <HeaderTitle Title="我的" />,
            headerLeft: null,
            headerRight: null,
            headerStyle: {
                height: config.headerHeight+StatusBar.currentHeight,
                shadowOpacity: 0,
                backgroundColor: '#4576f7',
                paddingTop:StatusBar.currentHeight
            }
        }
    }
    render() {
        return (<SafeAreaView style={commonStyle.safeView}>
            <TabContainer screenProps={{ navigation: this.props.navigation }}/>
        </SafeAreaView>)
    }
}

export default MyInfoPage

const styles = StyleSheet.create({
    tabContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: scaleSize(100),
        marginBottom: scaleSize(0),
        borderBottomWidth: scaleSize(1),
        borderBottomColor: '#dcdcdc',
        paddingBottom: scaleSize(10)
    },
    item: {
        paddingLeft: scaleSize(15),
        paddingRight: scaleSize(15),
    },
    item_text: {
        color: '#302a2a',
        paddingTop: 0,
        paddingBottom: 0,
    },
    item_text_selected: {
        fontSize: scaleSize(36),
        fontWeight: 'bold',
        color:'#4576f7'
    },
    camera_container: {
        position: 'absolute',
        right: 0,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // backgroundColor:'red',
        paddingHorizontal: scaleSize(25)
    },
    camera: {
        width: scaleSize(35),
        height: scaleSize(29),
        top: scaleSize(0)
    }
})
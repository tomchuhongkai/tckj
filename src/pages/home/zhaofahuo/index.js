import React, { Component } from 'react'
import { View, Text, Image, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, StatusBar, DeviceEventEmitter, FlatList } from 'react-native'
import { createAppContainer, SafeAreaView } from 'react-navigation'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { inject, observer } from 'mobx-react'
import commonStyle from '../../../tools/commonstyles'
import zhaohuoPage from '../zhaofahuo/zhaohuoPage'
import fahuoPage from '../zhaofahuo/fahuoPage'
import YXCXPage from '../zhaofahuo/YXCXPage'
import { scaleSize, setSpText, scaleSizeW } from '../../../tools/util'

let _this;
const TabHeader = (props) => {
    const {
        navigation: { state: { index, routes } },
        jumpTo,
        screenProps: { routeData, parentNavigation }
    } = props;
    return (<View style={[commonStyle.tabBar_detail, styles.tabContainer]}>
        <TouchableOpacity style={styles.tabLeft} onPress={() => {
            parentNavigation.goBack();
        }}>
            <Image source={require('../../../../images/back_icon.png')} style={[commonStyle.popup_container_back_img]} />
        </TouchableOpacity>
        <FlatList
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
            data={routes}
            renderItem={(dataRow) => {
                let route = dataRow.item;
                let idx = dataRow.index;
                let _style = [commonStyle.tabBar_detail_item_text, styles.item_text];
                if (idx === index) {
                    _style.push(styles.item_text_selected)
                }
                var data = routeData.filter(x => x.key === route.routeName);
                if (data.length > 0) {
                    var item = data[0];
                    return (<TouchableWithoutFeedback key={idx} onPress={() => { jumpTo(route.key) }}>
                        <View style={[commonStyle.tabBar_detail_item, styles.item]}>
                            <Text style={_style}>{item.name}</Text>
                            {idx === index ? <View style={[commonStyle.tabBar_detail_item_underline]}><View style={[commonStyle.tabBar_detail_item_underline_bg, { width: scaleSizeW(60) }]}></View></View> : null}
                        </View>
                    </TouchableWithoutFeedback>)
                } else {
                    return null;
                }
            }}
            keyExtractor={(item) => item.routeName}
            horizontal={true}
        />
        <TouchableOpacity style={{ width: scaleSizeW(90), justifyContent: 'center', display: 'flex', flexDirection: 'row' }} onPress={() => {
            let routeKey = props.navigation.state.routes[props.navigation.state.index].key;
            parentNavigation.push('ZhaofahuoForm', {
                type: routeKey, callBack: () => {
                    if (routeKey === 'SendProducts') {
                        DeviceEventEmitter.emit('FaHuoEvent');
                    } else if (routeKey === 'FindProducts') {
                        DeviceEventEmitter.emit('ZhaoHuoEvent');
                    }else if (routeKey === 'YXCXProducts') {
                        DeviceEventEmitter.emit('YXCXEvent');
                    }
                }
            })
        }}>
            <Image style={styles.iconmsg} source={require('../../../../images/icon-add-black.png')} />
        </TouchableOpacity>
    </View>)
}
let TabNavView = null
class TabContainerView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        }
    }
    componentDidMount() {
        var routers = {
            FindProducts: zhaohuoPage,
            SendProducts: fahuoPage,
            YXCXProducts:YXCXPage
        };
        const tabNav = createMaterialTopTabNavigator(routers, {
            initialRouteName: this.props.initalPage,
            tabBarComponent: TabHeader,
            lazy: true
        });
        const TabContainer = createAppContainer(tabNav);
        TabNavView = TabContainer;
        this.setState({
            isLoaded: true
        })
    }
    componentWillUnmount() {
        TabNavView = null;
    }
    render() {
        if (!this.state.isLoaded) {
            return null;
        }
        return <TabNavView screenProps={{
            parentNavigation: this.props.navigation,
            routeData: [{ key: 'FindProducts', name: '找货' }, { key: 'SendProducts', name: '发货' }, { key: 'YXCXProducts', name: '一线成型' }]
        }} />
    }
}


@inject('store')
@observer
class ZhaofahuoPage extends Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: null,
            headerLeft: null,
            headerRight: null,
            headerStyle: {
                height: StatusBar.currentHeight,
                shadowOpacity: 0,
                backgroundColor: '#4576f7',
                borderWidth: 0
            }
        }
    }
    render() {
        return (<SafeAreaView style={{ flex: 1 }}>
            {/* <StatusBar
                animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
                hidden={false}  //是否隐藏状态栏。
                backgroundColor={'transparent'} //状态栏的背景色
                translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
                barStyle={'light-content'} // enum('default', 'light-content', 'dark-content')
            /> */}
            <TabContainerView navigation={this.props.navigation} initalPage={'FindProducts'} />
        </SafeAreaView>)
    }
}

export default ZhaofahuoPage

const styles = StyleSheet.create({
    tabContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: scaleSizeW(100),
        marginBottom: scaleSizeW(0),
        paddingBottom: scaleSizeW(10)
    },
    tabLeft: {
        width: scaleSizeW(80),
    },
    item: {
        paddingLeft: scaleSizeW(15),
        paddingRight: scaleSizeW(15),
    },
    item_text: {
        color: '#302a2a',
        paddingTop: 0,
        paddingBottom: 0,
        fontSize: setSpText(26),
    },
    item_text_selected: {
        fontWeight: 'bold',
        color: '#4576f7'
    },
    homeadd: {
        width: scaleSize(36),
        height: scaleSize(36)
    },
    iconmsg: {
        width: scaleSizeW(37),
        height: scaleSizeW(37),
    }
})
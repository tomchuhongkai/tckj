import React, { Component } from 'react'
import { View, Text, Image, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, StatusBar, FlatList } from 'react-native'
import { createAppContainer, SafeAreaView } from 'react-navigation'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { inject, observer } from 'mobx-react'
import commonStyle from '../../tools/commonstyles'
import { scaleSizeW } from '../../tools/util'
import ForumPage from './forums'
import * as locals from '../../tools/localdata'

let _this;
const TabHeader = (props) => {
    const {
        navigation: { state: { index, routes } },
        jumpTo,
        screenProps: { plates, parentNavigation }
    } = props;
    return (<View style={[commonStyle.tabBar_detail, styles.tabContainer]}>
        <TouchableOpacity style={styles.tabLeft} onPress={() => {
            parentNavigation.goBack();
        }}>
            <Image source={require('../../../images/back_icon.png')} style={[commonStyle.popup_container_back_img]} />
        </TouchableOpacity>
        <FlatList
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
            data={routes}
            ref={(e) => {
                _this = e;
            }}
            onLayout={(e) => {
                if(index!=0){
                    _this.scrollToIndex({ index: index, animated: true });
                }
            }}
            onScrollToIndexFailed={info => {
                const wait = new Promise(resolve => setTimeout(resolve, 700));
                wait.then(() => {
                  fListRef.current?.scrollToIndex({ index: index, animated: true/false });
                });
              }}
            renderItem={(dataRow) => {
                let route = dataRow.item;
                let idx = dataRow.index;
                let _style = [commonStyle.tabBar_detail_item_text, styles.item_text];
                if (idx === index) {
                    _style.push(styles.item_text_selected)
                }
                var data = plates.filter(x => x.name === route.routeName);
                if (data.length > 0) {
                    var item = data[0];
                    return (<TouchableWithoutFeedback key={idx} onPress={() => {
                        // _this.scrollToIndex({ index: idx, animated: true });
                        jumpTo(route.key)
                    }}>
                        <View style={[commonStyle.tabBar_detail_item, styles.item]}>
                            <Text style={_style}>{item.title}</Text>
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
            let platId = props.navigation.state.routes[props.navigation.state.index].key;
            parentNavigation.push('Post', { plateId: platId })
        }}>
            <Image style={styles.iconmsg} source={require('../../../images/icon-add-black.png')} />
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
        let that = this;
        this.renderSub().then(data => {
            that.setState({
                isLoaded: true,
                routeNames: data
            })
        })
    }
    componentWillUnmount() {
        TabNavView = null;
    }
    async renderSub() {
        let that = this;
        let data = await locals.LoadForumPlates();
        var routers = {};
        var routeNameDic = [];
        let initalRoute = ''
        data.map(item => {
            routers[`name_${item.id}`] = ForumPage;
            routeNameDic.push({ name: `name_${item.id}`, title: item.name, id: item.id });
            if (that.props.routeName === item.name) {
                initalRoute = `name_${item.id}`;
            }
        })
        if (initalRoute === '')
            initalRoute = `name_${data[0].id}`;
        const tabNav = createMaterialTopTabNavigator(routers, {
            initialRouteName: initalRoute,
            tabBarComponent: TabHeader,
            tabBarOptions:{
                scrollEnabled: true
            },
            lazy: true
        });
        const TabContainer = createAppContainer(tabNav);
        TabNavView = TabContainer;
        return routeNameDic;
    }
    render() {
        if (!this.state.isLoaded) {
            return null;
        }
        return <TabNavView screenProps={{ plates: this.state.routeNames, parentNavigation: this.props.navigation }} />
    }
}

@inject('store')
@observer
class Forums extends Component {
    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            isLoaded: false,
            routeName: props.navigation.state.params === undefined || props.navigation.state.params.name === undefined ? '' : props.navigation.state.params.name
        }
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
        return (<SafeAreaView style={commonStyle.safeView}>
            <TabContainerView routeName={this.state.routeName} navigation={this.props.navigation} />
            <StatusBar
                backgroundColor={'transparent'}
                barStyle={'light-content'}
                translucent={true}
            />
        </SafeAreaView>)
    }
}

export default Forums

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
        fontSize: scaleSizeW(26),
    },
    item_text_selected: {
        fontWeight: 'bold',
        color: '#4576f7'
    },
    homeadd: {
        width: scaleSizeW(36),
        height: scaleSizeW(36)
    },
    iconmsg: {
        width: scaleSizeW(36),
        height: scaleSizeW(36),
    }

})
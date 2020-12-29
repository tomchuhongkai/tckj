import React,{Component} from 'react'
import {observer,inject} from 'mobx-react'
import { View, Text, Image, TouchableWithoutFeedback, TouchableOpacity, StyleSheet,NavigationActions } from 'react-native'
import commonStyle from '../../tools/commonstyles'
import { scaleSizeW, setSpText } from '../../tools/util'

const FriendTabBar = (props,nav) => {
    const {
        navigation: { state: { index, routes },actions:{goBack,navigate,getScreenProps} },
        jumpTo
    } = props;
    return (<View style={[commonStyle.tabBar_detail,styles.tabContainer]}>
        <View style={styles.menu_container}>
            {routes.map((route, idx) => {
                let _style = [commonStyle.tabBar_detail_item_text, styles.item_text];
                if (idx === index) {
                    _style.push(styles.item_text_selected)
                }
                switch (route.routeName) {
                    case 'FriendsList':
                        return <TouchableWithoutFeedback key={idx} onPress={() => { jumpTo(route.key) }}>
                            <View style={[commonStyle.tabBar_detail_item, styles.item]}>
                                <Text style={_style}>好友</Text>
                                {idx === index ? <View style={commonStyle.tabBar_detail_item_underline}><View style={commonStyle.tabBar_detail_item_underline_bg}></View></View> : null}
                            </View>
                        </TouchableWithoutFeedback>;
                    case 'FocusMe':
                        return <TouchableWithoutFeedback key={idx} onPress={() => { jumpTo(route.key) }}>
                            <View style={[commonStyle.tabBar_detail_item, styles.item]}>
                                <Text style={_style}>粉丝</Text>
                                {idx === index ? <View style={commonStyle.tabBar_detail_item_underline}><View style={commonStyle.tabBar_detail_item_underline_bg}></View></View> : null}
                            </View>
                        </TouchableWithoutFeedback>;
                    case 'MyFavourite':
                        return <TouchableWithoutFeedback key={idx} onPress={() => { jumpTo(route.key) }}>
                            <View style={[commonStyle.tabBar_detail_item, styles.item]}>
                                <Text style={_style}>关注</Text>
                                {idx === index ? <View style={commonStyle.tabBar_detail_item_underline}><View style={commonStyle.tabBar_detail_item_underline_bg}></View></View> : null}
                            </View>
                        </TouchableWithoutFeedback>;
                }
            })}
        </View>
    </View>)
}

export default FriendTabBar

const styles = StyleSheet.create({
    tabContainer: {
        marginBottom: scaleSizeW(0),
        paddingBottom: scaleSizeW(10)
    },
    menu_container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: scaleSizeW(100),
        paddingLeft: scaleSizeW(30),
    },
    item: {
        paddingLeft: scaleSizeW(15),
        paddingRight: scaleSizeW(15),
    },
    item_text: {
        color: '#302a2a',
        paddingTop: 0,
        paddingBottom: 0,
    },
    item_text_selected: {
        fontSize: setSpText(36),
        fontWeight: 'bold'
    },
    camera_container: {
        position: 'absolute',
        right: scaleSizeW(25)
    },
    camera: {
        width: scaleSizeW(35),
        height: scaleSizeW(29),
        top: scaleSizeW(0)
    }
})
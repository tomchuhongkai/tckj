import React, { Component } from 'react';
import { View, Animated, StyleSheet,TouchableOpacity,Text } from 'react-native';
import commonStyle from '../../tools/commonstyles';
import { scaleSizeW } from '../../tools/util';

class MyCollapsibleTab extends Component {
    render() {
        return (<Animated.View {...this.props}>
            <View style={styles.tab_bar}>
                {this.props.items.map((item, index) => {
                    let _style = [commonStyle.tabBar_detail_item_text];
                    if (this.props.selectedIndex === index)
                        _style = [commonStyle.tabBar_detail_item_text_cur];
                    return (<TouchableOpacity onPress={() => this.props.onChange(index)} key={index}>
                        <View style={[commonStyle.tabBar_detail_item, styles.item]}>
                            <Text style={[_style,{paddingTop:scaleSizeW(15)}]}>{item}</Text>
                            {this.props.selectedIndex === index ? <View style={{ position: 'absolute', left: scaleSizeW(15), bottom: 0 }}><View style={[commonStyle.tabBar_detail_item_underline_bg,{bottom:scaleSizeW(10)}]}></View></View> : null}
                        </View>
                    </TouchableOpacity>)
                })}
            </View>
        </Animated.View>)
    }
}

export default MyCollapsibleTab

const styles = StyleSheet.create({
    tab_bar: {
        height: scaleSizeW(100),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: scaleSizeW(40),
    },
    tab_item: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1
    },
})